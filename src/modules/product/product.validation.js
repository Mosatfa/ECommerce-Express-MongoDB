import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const createProduct = joi.object({
    name: joi.string().min(2).max(200).required(),
    description: joi.string().min(2).max(2000000).required(),
    stock : joi.number().integer().positive().min(1).required(),
    price: joi.number().positive().min(1).required(),
    discount : joi.number().positive().min(1),
    colors: joi.array().items(joi.string()),
    size: joi.array().items(joi.string()),
    categoryId: generalFields.id,
    supcategoryId: generalFields.id,
    brandId: generalFields.id,
    file: joi.object({
        mainImage : joi.array().items(generalFields.file.required()).length(1).required(),
        subImages : joi.array().items(generalFields.file).min(1).max(5)
    })
}).required()

export const updateProduct = joi.object({
    productId : generalFields.id,
    name: joi.string().min(2).max(200),
    description: joi.string().min(2).max(2000000),
    stock : joi.number().integer().positive().min(1),
    price: joi.number().positive().min(1),
    discount : joi.number().positive().min(1),
    colors: joi.array().items(joi.string()),
    size: joi.array().items(joi.string()),
    categoryId: generalFields.optId,
    supcategoryId: generalFields.optId,
    brandId: generalFields.optId,
    file: joi.object({
        mainImage : joi.array().items(generalFields.file).max(1),
        subImages : joi.array().items(generalFields.file).min(1).max(5)
    })
}).required()


export const addWishlist = joi.object({
    productId : generalFields.id,
}).required()