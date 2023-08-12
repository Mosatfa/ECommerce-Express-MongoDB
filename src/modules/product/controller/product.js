import productModel from "../../../../DB/model/Product.model.js";
import subcategoryModel from "../../../../DB/model/Subcategory.model.js";
import brandModel from "../../../../DB/model/Brand.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import ApiFeatures from "../../../utils/apiFeatures.js";


export const getProduct = asyncHandler(async (req, res, next) => {

    const apiFeature = new ApiFeatures(productModel.find().populate([
        {
            path: 'review'
        }
    ]), req.query).filter().sort().select()
    const products = await apiFeature.mongooseQuery


    for (let i = 0; i < products.length; i++) {
        let calcRating = 0;
        for (let j = 0; j < products[i].review.length; j++) {
            calcRating += products[i].review[j].rating
        }
        const avgRating = calcRating / products[i].review.length
        const proudct = products[i].toObject()
        proudct.avgRating = avgRating || 0
        products[i] = proudct
    }

    return res.status(200).json({ message: "Done", products })
})

export const createProduct = asyncHandler(async (req, res, next) => {
    const { name, categoryId, supcategoryId, brandId, price, discount } = req.body;

    if (!await subcategoryModel.findOne({ _id: supcategoryId, categoryId })) {
        return next(new Error(`In-Valid supcategoryId or  categoryId Id`, { cause: 400 }))
    }

    if (!await brandModel.findOne({ _id: brandId })) {
        return next(new Error(`In-Valid brandId Id `, { cause: 400 }))
    }

    req.body.slug = slugify(name, {
        replacement: '-',
        trim: true,
        lower: true
    })

    req.body.finalPrice = Number(price - (price * ((discount) / 100))).toFixed(2)

    req.body.customId = nanoid()

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}` })
    req.body.mainImage = { secure_url, public_id }

    if (req.files.subImages) {
        req.body.subImages = []
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}/subImages` })
            req.body.subImages.push({ secure_url, public_id })
        }
    }

    req.body.createdBy = req.user._id
    const product = await productModel.create(req.body)
    if (!product) {
        return next(new Error(`Fail to create this product`, { cause: 400 }))
    }

    return res.status(201).json({ message: "Done", product })
})


export const updateProduct = asyncHandler(async (req, res, next) => {
    const { name, categoryId, supcategoryId, brandId, price, discount } = req.body;

    const product = await productModel.findById(req.params.productId)
    if (!product) {
        return next(new Error(`In-Valid product Id`, { cause: 400 }))
    }

    if (supcategoryId && categoryId) {
        if (!await subcategoryModel.findOne({ _id: supcategoryId, categoryId })) {
            return next(new Error(`In-Valid supcategoryId or  categoryId Id`, { cause: 400 }))
        }
    }

    if (brandId) {
        if (!await brandModel.findOne({ _id: brandId })) {
            return next(new Error(`In-Valid supcategoryId or  categoryId Id`, { cause: 400 }))
        }
    }

    if (name) {
        req.body.slug = slugify(name, {
            replacement: '-',
            trim: true,
            lower: true
        })
    }


    if (price || discount) {
        req.body.finalPrice = Number(price - (price * ((discount) / 100))).toFixed(2)
    } else if (price) {
        req.body.finalPrice = Number(price - (price * ((product.discount) / 100))).toFixed(2)
    } else if (discount) {
        req.body.finalPrice = Number(product.price - (product.price * ((discount) / 100))).toFixed(2)
    }


    if (req.files?.mainImage?.length) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${product.customId}` })
        await cloudinary.uploader.destroy(product.mainImage.public_id)
        req.body.mainImage = { secure_url, public_id }
    }

    if (req.files?.subImages?.length) {
        if (req.files.subImages) {
            req.body.subImages = []
            for (const file of req.files.subImages) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/product/${product.customId}/subImages` })
                for (let i = 0; i < product.subImages.length; i++) {
                    console.log(product.subImages[i].public_id);
                    await cloudinary.uploader.destroy(product.subImages[i].public_id)
                    console.log(product.subImages[i].public_id)
                }
                req.body.subImages.push({ secure_url, public_id })
            }
        }
    }


    req.body.updatedBy = req.user._id

    const newProduct = await productModel.updateOne({ _id: product._id }, req.body)

    return newProduct.matchedCount ? res.status(200).json({ message: "Done", newProduct }) : next(new Error(`Fail to create this product`, { cause: 400 }))

})



export const addWishList = asyncHandler(async (req, res, next) => {
    const { productId } = req.params
    const product = await productModel.findById(productId)

    if (!product) {
        return next(new Error(`In-Valid product Id`, { cause: 400 }))
    }

    await userModel.updateOne({ _id: req.user._id }, { $addToSet: { wishList: product._id } })

    return res.status(200).json({ message: "Done" })
})

export const removeWishList = asyncHandler(async (req, res, next) => {
    const { productId } = req.params
    const product = await productModel.findById(productId)

    if (!product) {
        return next(new Error(`In-Valid product Id`, { cause: 400 }))
    }

    await userModel.updateOne({ _id: req.user._id }, { $pull: { wishList: product._id } })

    return res.status(200).json({ message: "Done" })
})