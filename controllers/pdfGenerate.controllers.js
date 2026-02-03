import { success } from "zod";
import orderModel from "../models/orders.model.js";
import { generateInvoice } from "../utils/pdfkit.js";



 const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: true,
        message: "Order not found" });
    }

    generateInvoice(order, res);
  } catch (err) {
    res.status(500).json({ success: false,
         message: "Invoice generation failed",
        erros: err.message });
         
  }
};


export {
    downloadInvoice
}