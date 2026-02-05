import express from 'express'
import userModel from '../models/user.model.js'
import productModel from '../models/product.model.js'
import orderModel from '../models/orders.model.js'
import { success } from 'zod'
import { error } from 'console'
import Stripe from 'stripe'
import { orderConfirmationTemplate } from '../utils/resend.js';
import {Resend} from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const resend = new Resend(process.env.RESEND_TOKEN);



const placeOrder = async (req, res) => {
  try {
    const userId = req.userId
    const { address, paymentMethod } = req.body

    const user = await userModel.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errors: error.message
      })
    }

    if (!user.cartData || Object.keys(user.cartData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      })
    }

    let items = []
    let subtotal = 0

    for (const productId in user.cartData) {
      const product = await productModel.findById(productId)
      if (!product) continue

      for (const size in user.cartData[productId]) {
        const quantity = user.cartData[productId][size]

        items.push({
          productId,
          name: product.name,
          price: product.price,
          size,
          quantity,
          image: product.image[0]
        })

        subtotal += product.price * quantity
      }
    }

    const DELIVERY_FEE = 50
    const totalAmount = subtotal + DELIVERY_FEE

    const order = await orderModel.create({
      userId,
      items,
      totalAmount,
      address,
      paymentMethod: "cod",
      orderStatus: "placed"
    })

  
   
    
    user.cartData = {}
    await user.save()
    const getEmailByUserModel = await userModel.findById(order.userId)
    const email = getEmailByUserModel.email
      await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: email,
        subject: "order confirmation",
        html: orderConfirmationTemplate(order),
      });
    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order,
      
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//place order using stripe 
const StripePayment = async (req,res) => {
   try {
    const userId = req.userId;
    const { address } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.cartData || Object.keys(user.cartData).length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    let items = [];
    let subtotal = 0;

    for (const productId in user.cartData) {
      const product = await productModel.findById(productId);
      if (!product) continue;

      for (const size in user.cartData[productId]) {
        const quantity = user.cartData[productId][size];

        items.push({
          productId,
          name: product.name,
          price: product.price,
          size,
          quantity,
          image: product.image[0]
        });

        subtotal += product.price * quantity;
      }
    }

    const DELIVERY_FEE = 50;
    const totalAmount = subtotal + DELIVERY_FEE;

    //  Create order 
    const order = await orderModel.create({
      userId,
      items,
      address,
      totalAmount,
      paymentStatus: "pending",
      paymentMethod: "stripe",
      email: user.email
    });

    //  Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [ ...items.map(item => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: item.price * 100, // Stripe uses paise
        },
        quantity: item.quantity,
      })),
       {
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 50 * 100, // delvery charge
      },
      quantity: 1,
    },
    
    ],
      mode: "payment",
      success_url: `http://localhost:5173/success?orderId=${order._id}`,
      cancel_url: `http://localhost:5173/cancel?orderId=${order._id}`,
    
    });
  
    // ✅ Save Stripe session ID
    order.stripeSessionId = session.id;
    await order.save();

    // ✅ Clear cart
  
    await user.save();

    res.status(200).json({
      success: true,
      url: session.url, 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
       success: false, message: "Payment failed",
       errors: error.message
      
      });

  }


}

const userOrder = async (req, res) => {
  try {
    const userId = req.userId
    const DELIVERY_FEE = 50

    const order = await orderModel.find({ userId }).sort({createdAt: -1})
     
    return res.status(200).json({
      success: true,
      message: "User order found successfully",
      order,
      deliverfee: DELIVERY_FEE
    })

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "cannot find order"
    })

  }




}

const allOrders = async (req, res) => {
  try {
    const {limit,page,skip} = req.pagination
    const orders = await orderModel.find({}).sort({ createdAt: -1 }).limit(limit).skip(skip)
    const totalOrders = await productModel.countDocuments();
    
    return res.status(200).json({
      success: true,
      message: "all orders found",
         page: page,
      limit: limit,
      ordersLenght: orders.length,
      totalPages: Math.ceil(totalOrders / limit),
      orders,
   
      
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "cannot find order",
      error: error.message,
    


    })

  }

}

const userShipping = async (req, res) => {
 try {
    const { shippingDetails, orderId, orderStatus } = req.body

    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required"
      })
    }

    
    const order = await orderModel.findById(orderId)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      })
    }

    
    if (shippingDetails !== undefined) {
      order.shippingDetails = shippingDetails
    }

    if (orderStatus !== undefined) {
      order.orderStatus = orderStatus
    }

    if (order.paymentMethod === "cod" && orderStatus === "delivered") {
      order.paymentStatus = "paid"
    }

    await order.save() 

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }




}






export {
  placeOrder,
  allOrders,
  userOrder,
  userShipping,
  StripePayment
}