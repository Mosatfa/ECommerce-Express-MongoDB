import subcategoryModel from "../../../../DB/model/Subcategory.model.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from "slugify";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { nanoid } from "nanoid";

export const getSubcategory = asyncHandler(async (req, res, next) => {
    const subcategory = await subcategoryModel.find({})
    return res.status(200).json({ message: "Done", subcategory })
});

export const createSubcategory = asyncHandler(async (req, res, next) => {
    const  name  = req.body.name.toLowerCase();
    if (!await categoryModel.findById(req.params.categoryId)) {
        return next(new Error(`In-Valid Id Category`, { cause: 400 }))
    }
    if (await subcategoryModel.findOne({ name })) {
        return next(new Error(`Duplicate subcategory name ${name}`, { cause: 409 }))
    }
    const customId = nanoid()
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category/${req.params.categoryId}/${customId}` })

    const subcategory = await subcategoryModel.create({
        name,
        slug: slugify(name, '-'),
        image: { secure_url, public_id },
        categoryId: req.params.categoryId,
        customId,
        createdBy: req.user._id
    })

    return res.status(201).json({ message: "Done", subcategory })
});


export const updateSubcategory = asyncHandler(async (req, res, next) => {
    const { subcategoryId, categoryId } = req.params
    const subcategory = await subcategoryModel.findOne({ _id: subcategoryId, categoryId })
    if (!subcategory) {
        return next(new Error(`In-Valid Id Category `, { cause: 400 }))
    }

    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
        if (subcategory.name == req.body.name) {
            return next(new Error(`Sorry can't update because The new name is the same as the old one`, { cause: 400 }))
        }
        if (await subcategoryModel.findOne({ name: req.body.name })) {
        
            return next(new Error(`Duplicate subcategory name ${req.body.name}`, { cause: 409 }))
        }
        subcategory.name = req.body.name
        subcategory.slug = slugify(req.body.name, '-')
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category/${req.params.categoryId}/${subcategory.customId}` })
        await cloudinary.uploader.destroy(subcategory.image.public_id)
        subcategory.image = { secure_url, public_id }
    }
    subcategory.updatedBy = req.user._id
    subcategory.save()
    return res.status(200).json({ message: "Done", subcategory })
});