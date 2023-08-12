import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const signUp = joi.object({
    userName: joi.string().min(2).max(20).required(),
    email: generalFields.email,
    password: generalFields.password,
    confrimPassword: generalFields.password.valid(joi.ref('password'))
}).required()

export const login = joi.object({
    email: generalFields.email,
    password: generalFields.password,
}).required()

export const token = joi.object({
    token : joi.string().required()
}).required()

export const sendCode = joi.object({
    email: generalFields.email,
}).required()

export const forgetPssword = joi.object({
    code: joi.string().pattern(/^[0-9]*$/).required(),
    newPassword: generalFields.password,
    newConfirmPassword: generalFields.password.valid(joi.ref('newPassword')),
}).required()

export const changePassword = joi.object({
    oldPassword: generalFields.password,
    newPassword: generalFields.password.invalid(joi.ref('oldPassword')),
    newConfirmPassword: generalFields.password.valid(joi.ref('newPassword')),
}).required()





