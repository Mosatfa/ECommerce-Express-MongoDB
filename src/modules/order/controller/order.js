import cartModel from "../../../../DB/model/Cart.model.js";
import couponModel from "../../../../DB/model/Coupon.model.js"
import orderModel from "../../../../DB/model/Order.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { deleteItemFromCart } from "../../cart/controller/cart.js";



export const createOrder = asyncHandler( async (req, res, next) => {
    const { products, address, phone, note, couponName, paymentType } = req.body;

    if (couponName) {
        const coupon = await couponModel.findOne({ name: couponName.toLowerCase(), usedBy: { $nin: req.user._id } })
        if (!coupon || coupon.expireDate.getTime() < Date.now()) {
            return next(new Error('In-Valid or Expire Coupon', { cause: 400 }))
        }
        req.body.coupon = coupon
    }

    const productIds = []
    const finalProductList = []
    let subtotal = 0;
    for (const product of products) {
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity },
            isDeleted: false
        })

        if (!checkProduct) {
            return next(new Error('In-Valid product', { cause: 400 }))
        }
        productIds.push(product.productId)
        product.name = checkProduct.name
        product.unitPrice = checkProduct.finalPrice
        product.finalPrice = checkProduct.finalPrice * product.quantity.toFixed(2)
        finalProductList.push(product)
        subtotal += product.finalPrice

    }
    console.log({ paymentType });

    const order = await orderModel.create({
        userId: req.user._id,
        address,
        phone,
        note,
        products: finalProductList,
        couponId: req.body.coupon?._id,
        subtotal,
        finalPrice: subtotal - (subtotal * ((req.body.coupon?.amount || 0) / 100)).toFixed(2),
        paymentType,
        status: paymentType ? "placed" : "waitPayment",
    })

    for (const product of products) {await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -parseInt(product.quantity) } })}

    if (req.body.coupon) {
        await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})
    }


    await deleteItemFromCart(productIds , req.user._id)
    
    return res.status(201).json({ message: "Done", order })
})

export const  cancelOrder = asyncHandler( async (req, res, next) => {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await orderModel.findOne({_id:orderId , userId:req.user._id})
    if(!order){
        return next(new Error(`In-Valid Order Id`, { cause: 404 }))
    }
    if((order.status !="placed" && order.paymentType == "cash" )|| (order.status != "waitPayment" && order.paymentType == "card" )){
        return next(new Error(`Cannot cancel your order after it been changed to ${order.status} `, { cause: 400 }))
    }

    const cancelOrder = await orderModel.updateOne({_id:order._id }, {status:"canceled",reason,updatedBy:req.user._id})

    if(!cancelOrder.matchedCount){
        return next(new Error(`Fail to cancel your order`, { cause: 400 }))
    }

    
    for (const product of order.products) {await productModel.updateOne({ _id: product.productId }, { $inc: { stock: parseInt(product.quantity) } })}

    if (order.couponId) {
        await couponModel.updateOne({_id:order.couponId},{$pull:{usedBy:req.user._id}})
    }


    return res.status(200).json({ message: "Done"})
})

export const  updateOrderStatusByAdmin = asyncHandler( async (req, res, next) => {
    const { orderId } = req.params;
    const {status} = req.body;
    const order = await orderModel.findOne({_id:orderId , userId:req.user._id})
    if(!order){
        return next(new Error(`In-Valid Order Id`, { cause: 404 }))
    }


    const cancelOrder = await orderModel.updateOne({_id:order._id }, {status,updatedBy:req.user._id})

    if(!cancelOrder.matchedCount){
        return next(new Error(`Fail to cancel your order`, { cause: 400 }))
    }

    return res.status(200).json({ message: "Done"})
})



// 
// export const createOrder = asyncHandler( async (req, res, next) => {
//     const {address, phone, note, couponName, paymentType } = req.body;

//     const cart = await cartModel.findOne({userId:req.user._id})
//     if(!cart?.products?.length){
//         return next(new Error('Empty cart', { cause: 400 }))
//     }

//     req.body.products = cart.products

//     if (couponName) {
//         const coupon = await couponModel.findOne({ name: couponName.toLowerCase(), usedBy: { $nin: req.user._id } })
//         if (!coupon || coupon.expireDate.getTime() < Date.now()) {
//             return next(new Error('In-Valid or Expire Coupon', { cause: 400 }))
//         }
//         req.body.coupon = coupon
//     }

//     const productIds = []
//     const finalProductList = []
//     let subtotal = 0;
//     for (let product of req.body.products) {

//         const checkProduct = await productModel.findOne({
//             _id: product.productId,
//             stock: { $gte: product.quantity },
//             isDeleted: false
//         })

//         if (!checkProduct) {
//             return next(new Error('In-Valid product', { cause: 400 }))
//         }
//         // product => bson object
//         product = product.toObject()
//         productIds.push(product.productId)
//         product.name = checkProduct.name
//         product.unitPrice = checkProduct.finalPrice
//         product.finalPrice = checkProduct.finalPrice * product.quantity.toFixed(2)
//         finalProductList.push(product)
//         subtotal += product.finalPrice

//     }
//     console.log({ paymentType });

//     //CREATE ORDER
//     const order = await orderModel.create({
//         userId: req.user._id,
//         address,
//         phone,
//         note,
//         products: finalProductList,
//         couponId: req.body.coupon?._id,
//         subtotal,
//         finalPrice: subtotal - (subtotal * ((req.body.coupon?.amount || 0) / 100)).toFixed(2),
//         paymentType,
//         status: paymentType ? "placed" : "waitPayment",
//     })

//     for (const product of req.body.products) {await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -parseInt(product.quantity) } })}

//     // push userId in usedbY COUPON
//     if (req.body.coupon) {
//         await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})
//     }

//     // clear item cart
//     await cartModel.updateOne({userId:req.user._id},{products:[]})
    
//     return res.status(201).json({ message: "Done", order })
// })