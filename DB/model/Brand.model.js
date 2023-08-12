import mongoose, { Schema, Types, model } from "mongoose";

const brandSchema = new Schema({

    name: { type: String, required: true, unique: true, lowercase: true },
    logo: { type: Object, required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true }, // to be converted to true later after prototype
    updatedBy: { type: Types.ObjectId, ref: 'User' },

}, {
    timestamps: true
});


const brandModel = mongoose.models.Brand || model('Brand', brandSchema);

export default brandModel;