import { timeStamp } from "console";
import mongoose from "mongoose";
import { object } from "zod";


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phoneNo: {
        type: Number,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    cartData: {
        type: object,
        default: {}
    }
},{minimize: false},
{
    timeStamps: true
})

const userModel = mongoose.models.user || mongoose.model('User', userSchema)

export default userModel