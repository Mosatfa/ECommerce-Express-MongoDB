import orderModel from "../../../../DB/model/Order.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const createReview = asyncHandler(async (req, res, next) => {
    const { productId } = req.params
    console.log({productId});
    const { comment, rating } = req.body

    const order = await orderModel.findOne({
        userId: req.user._id,
        status: "delivered",
        "products.productId": productId
    })

    if (!order) {
        return next(new Error('Cannot review product before receive it', { cause: 400 }))
    }

    if (await reviewModel.findOne({ createdBy: req.user._id, productId, orderId: order._id })) {
        return next(new Error('Already Review by you', { casue: 400 }))
    }

    const review = await reviewModel.create({ comment, rating, createdBy: req.user._id, orderId: order._id , productId })


    return res.status(201).json({ message: "Done", review })
})


export const updateReview = asyncHandler(async (req, res, next) => {
    const { productId, reviewId } = req.params

    const review = await reviewModel.findOneAndUpdate({_id:reviewId , productId} , req.body ,{new:true})

    if (!review) {
        return next(new Error('In-Valid Review Id ', { cause: 400 }))
    }

    return res.status(200).json({ message: "Done", review })
})