import express from 'express'
import { Router } from 'express'
import { allOrders, placeOrder, StripePayment, userOrder, userShipping } from '../controllers/orders.controllers.js'
import { adminAuth } from '../middlewares/admin.middleware.js'
import { userAuth } from '../middlewares/user.middleware.js'
import { pagination } from '../middlewares/pagination.middleware.js'

const orderRouter = express.Router()

orderRouter.post('/placeorder', userAuth, placeOrder ),
orderRouter.get('/yourorders',userAuth,userOrder ),
orderRouter.get('/allorders',adminAuth,pagination,allOrders ),
orderRouter.post('/shippingdetails', adminAuth,userShipping)
orderRouter.post("/stripePayment",userAuth,StripePayment)

export default orderRouter