import express from 'express'
import { addToCart,updateCart,getCartData } from '../controllers/cart.controllers.js'
import { userAuth } from '../middlewares/user.middleware.js'

const cartRouter = express.Router()

cartRouter.post('/addtocart',userAuth, addToCart )
cartRouter.post('/updatecart',userAuth, updateCart )
cartRouter.get("/getcart", userAuth, getCartData )

export default cartRouter