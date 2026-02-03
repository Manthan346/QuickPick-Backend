import { success } from "zod"
import userModel from "../models/user.model.js"


const addToCart = async (req,res) => {
    try {
        const {productId, size} = req.body
        const userId = req.userId
        console.log("USER ID FROM TOKEN:", req.userId)
 
        const userData = await userModel.findById(userId)
        const cartData = await userData.cartData || {}
        if (cartData[productId]) {
            if (cartData[productId][size]) {
                cartData[productId][size] += 1
                
            }else {
                cartData[productId][size] = 1
            }
            
        }else{
            cartData[productId] = {}
                cartData[productId][size] = 1
        }
            await userModel.findByIdAndUpdate(userId, {cartData})

            res.status(200).json({
                success: true,
                message: "Product added to cart"
            })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })

        
    }

}


const updateCart = async (req,res) => {
    try {
        const { productId, size, quantity} = req.body
        const userId = req.userId
    const userData = await userModel.findById(userId)
    
    const cartData = userData.cartData

    if (cartData[productId] && cartData[productId][size]) {
        cartData[productId][size] = quantity
        
    }
    await userModel.findByIdAndUpdate(userId, {cartData})
    return res.status(200).json({
        success: true,
        message: "cart updated"
    })
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
        
    }
    




}

const getCartData = async (req,res) => {

    try {
        const userId = req.userId
    const userData = await userModel.findById(userId)
    const cartData = userData.cartData

    res.status(200).json({
        success: true,
        message: "cart data found", cartData
    })

        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "couldnt found cart data",
            errors: error.message

        })
        
    }
    
  


}

export {
    addToCart, updateCart,getCartData
}