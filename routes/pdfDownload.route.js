import { downloadInvoice } from "../controllers/pdfGenerate.controllers.js";
import express from 'express'
import Router from "express";

const pdfRouter = express.Router()

pdfRouter.get("/downloadinvoice/:orderId", downloadInvoice)

export default pdfRouter