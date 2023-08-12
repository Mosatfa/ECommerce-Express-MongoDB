import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';


export const createOrder = joi.object({
    products: joi.array().items(joi.object({
        productId: generalFields.id,
        quantity: joi.number().integer().positive().min(1).required()
    }).required()).min(1).required(),

    address: joi.string().min(1).required(),

    phone: joi.array().items( 
        joi.string().pattern(new RegExp(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/)).required()
    ).min(1).max(3).required(),

    note: joi.string().min(1),

    couponName: joi.string().min(1),

    paymentType :joi.string().valid("cash", "card")
}).required()

export const cancelOrder = joi.object({
    orderId: generalFields.id,
    reason: joi.string().min(1).required(),
}).required()

export const updateOrderStatusByAdmin = joi.object({
    orderId: generalFields.id,
    status: joi.string().valid("delivered", "onWay")
}).required()