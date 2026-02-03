import { Router } from "express";
import { adminAuth } from "../middlewares/admin.middleware.js";
import { revenueAndOrdersData, MonthlyIncome } from "../controllers/dashboardData.controllers.js";

const dashboardRouter = Router()

dashboardRouter.get("/monthlyincome", adminAuth,MonthlyIncome)
dashboardRouter.get("/totalincomeAndOrderStats",adminAuth,revenueAndOrdersData)
// dashboardRouter.get("/totalusers", adminAuth,TotalUsers)

export default dashboardRouter