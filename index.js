import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { Resend } from "resend";

import connectDB from './config/mongoosedb.js'
import connectCloudinary from './config/Cloudinary.js'
import userRouter from './routes/user.route.js'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'
import orderRouter from './routes/orders.route.js'
import pdfRouter from './routes/pdfDownload.route.js'
import Stripe from 'stripe'
import orderModel from './models/orders.model.js'
import userModel from './models/user.model.js'
import dashboardRouter from './routes/dashboardDataroute.js'
import { orderConfirmationTemplate } from './utils/resend.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express()
const port = 4000

const resend = new Resend(process.env.RESEND_TOKEN);

app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.url);
  next();
});

app.post(
  "/api/v1/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("🔥 WEBHOOK HIT");

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("❌ Webhook error:", err.message);
      return res.status(400).send(`Webhook Error`);
    }

    console.log("EVENT:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("SESSION:", session.id);

      const order = await orderModel.findOne({ stripeSessionId: session.id });
      // getting email
      const user = await userModel.findById(order.userId)
      const email = user.email
      
      if (!order) {
  
        return res.json({ 
          received: true
         });
      }

      order.paymentStatus = "paid";
      order.orderStatus = "placed";
      await order.save();
      await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "order confirmation",
    html: orderConfirmationTemplate(order),
  });
  
 console.log(email)
 


      await userModel.findByIdAndUpdate(order.userId, {
        cartData: {},
      });

      console.log(" PAYMENT DONE, CART CLEARED");
    }

    res.json({ received: true });
  }
  
);



app.use(express.json())
app.use(cors())
// mongo connection
connectDB()
// cloudinary connection
connectCloudinary()

app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/pdf', pdfRouter)
app.use('/api/v1/data', dashboardRouter)









app.get('/', (req,res)=> {
    res.send("api working")
})

app.listen(port, ()=> console.log("server started "))