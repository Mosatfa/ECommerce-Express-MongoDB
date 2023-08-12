import { Schema, model } from "mongoose";

const optSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    code:{
        type:String,
    },
    expireIn:{
        type:Number
    }

},{
    timestamps:true,
})

const optModel = model('Opt', optSchema)

export default optModel