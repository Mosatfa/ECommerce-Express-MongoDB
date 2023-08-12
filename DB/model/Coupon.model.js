import mongoose, { Schema, Types, model } from "mongoose";

const couponSchema = new Schema({

    name: { type: String, required: true, unique: true , lowercase : true},
    image: { type: Object },
    amount: { type: Number, default: 1 },
    expireDate: { type: Date , required : true },
    usedBy: [{ type: Types.ObjectId, ref: 'User' }],
    createdBy: { type: Types.ObjectId, ref: 'User', required: true }, // to be converted to true later after prototype
    updatedBy: { type: Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});


const couponModel = mongoose.models.Coupon || model('Coupon', couponSchema);

export default couponModel;