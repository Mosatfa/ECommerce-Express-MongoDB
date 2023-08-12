import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const createsubcategory = joi.object({
    categoryId: generalFields.id,
    name: joi.string().min(2).max(200).required(),
    file: generalFields.file.required()
}).required()

export const updatesubcategory = joi.object({
    categoryId: generalFields.id,
    subcategoryId: generalFields.id,
    name: joi.string().min(2).max(200),
    file: generalFields.file
}).required()