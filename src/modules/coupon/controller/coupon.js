import couponModel from "../../../../DB/model/Coupon.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";


export const getCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.find({})
    return res.status(200).json({ message: "Done", coupon })
});

export const createCoupon = asyncHandler(async (req, res, next) => {
    const name = req.body.name.toUpperCase();

    if (await couponModel.findOne({ name })) {
        return next(new Error(`Duplicate subcategory name ${name}`, { cause: 409 }))
    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/coupon` })
        req.body.image = { secure_url, public_id }
    }
    req.body.expireDate = new Date(req.body.expireDate)
    req.body.createdBy = req.user._id
    const subcategory = await couponModel.create(req.body,)

    return res.status(201).json({ message: "Done", subcategory })
});


export const updateCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.findById(req.params.couponId)
    if (!coupon) {
        return next(new Error(`In-Valid Id coupon `, { cause: 400 }))
    }

    if (req.body.name) {
        req.body.name = req.body.name.toUpperCase()
        if (coupon.name == req.body.name) {
            return next(new Error(`Sorry can't update because The new name is the same as the old one`, { cause: 400 }))
        }
        if (await couponModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicate coupon name ${req.body.name}`, { cause: 409 }))
        }
        coupon.name = req.body.name
    }
    if (req.body.amount) {
        coupon.amount = req.body.amount
    }
    if (req.body.expireDate) {
        req.body.expireDate = new Date(req.body.expireDate)
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/coupon` })
        if (coupon.image) {
            await cloudinary.uploader.destroy(coupon.image.public_id)
        }
        coupon.image = { secure_url, public_id }
    }
    coupon.updatedBy = req.user._id
    coupon.save()
    return res.status(200).json({ message: "Done", coupon })
});