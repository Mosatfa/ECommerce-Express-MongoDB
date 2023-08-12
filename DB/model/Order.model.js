import mongoose, { Schema, Types, model } from "mongoose";

const orderSchema = new Schema({
    address: { type: String, required: true },
    phone: [{ type: String, required: true }],
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    note:{type:String},
    products: [{
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1, required: true },
        unitPrice: { type: Number, default: 1, required: true },
        finalPrice: { type: Number, default: 1, required: true }
    }],
    couponId: { type: Types.ObjectId, ref: 'Coupon', },
    subTotal: { type: Number, default: 1, required: true },
    finalPrice: { type: Number, default: 1, required: true },
    paymentType: {
        type: String,
        default: 'cash',
        enum: ['cash', 'card']
    },
    status: {
        type: String,
        default: 'placed',
        enum: ['placed', 'waitPayment', 'canceled', 'rejected', 'onWay', 'delivered']
    },
    reason: { type: String },
    updatedBy : { type: Types.ObjectId, ref: 'User'}

}, {
    timestamps: true
});


const orderModel = mongoose.models.Order || model('Order', orderSchema);

export default orderModel;