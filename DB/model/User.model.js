import mongoose, { Schema, model ,Types } from "mongoose";


const userSchema = new Schema({

    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase: true,
    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
        lowercase : true
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    address:{
        type:String
    },
    gender:{
        type:String,
        default:'male',
        enum:['male','female']
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    },

    status: {
        type: String,
        default: 'Offline',
        enum: ['Offline', 'Online', 'Blocked']
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    image: { type: Object },
    DOB: String,
    changePasswordTime : {type:Date},
    wishList:[{
        type: Types.ObjectId, ref: 'Product', required: true
    }]

}, {
    timestamps: true
})


const userModel = mongoose.models.User || model('User', userSchema)
export default userModel