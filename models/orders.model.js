import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true
        },
        
        name: { type: String, required: true },
        size: String,
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: String
      }
    ],



    totalAmount: {
      type: Number,
      required: true
    },

    address: {
      fullName: { type: String },
      phone: { type: String },
      street: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String }
    },


    paymentMethod: {
      type: String,
      enum: ["cod", "razorPay", "stripe"],
      default: "cod"
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    },

    orderStatus: {
      type: String,
      enum: ["placed","shipped", "delivered", "cancelled"],
      default: "placed"
    },
    shippingDetails: {
      type: String,
      require: true,
      default: "enter shipping details"
    },
    stripeSessionId: {
      type: String,
      default: null
    }
  },
  
  { timestamps: true }
);

const orderModel =
  mongoose.models.Orders || mongoose.model("Orders", orderSchema);

export default orderModel;
