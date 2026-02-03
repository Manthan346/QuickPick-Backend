import mongoose, { Types } from "mongoose";


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true 
    },
    category: {
        type: String,
        require: true,
    },
    image: {
        type: Array,
        require: true,

    },
    subCategory: {
        type: String,
        require: true,
    },
    sizes: {
        type: Array,
        require: true
    },
    bestseller: {
        type: Boolean,
        
    },
    gender: {
        type: String,
        require: true

    },


},
{
    timestamps: true
})
 
const productModel = mongoose.models.products || mongoose.model('Products', productSchema)

export default productModel