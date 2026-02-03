import express from 'express'
import orderModel from '../models/orders.model.js'
import { json, success } from 'zod'
import userModel from '../models/user.model.js'

const MonthlyIncome = async (req, res) => {
  try {
    const income = await orderModel.aggregate([
      {
        $match: {
          paymentStatus: "paid"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalIncome: {
            $sum: "$totalAmount"
          }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ])

    return res.status(200).json({
      success: true,
      message: "monthly data found",
      data: income
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//revenue and orders stats and total users
const revenueAndOrdersData = async (req, res) => {
  try {
    const revenueAndOrderStats = await orderModel.aggregate([
      {
        $facet: {
          Revenue: [
            {
              $match: { paymentStatus: "paid" }
            },


            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" },


              },
            },

          ],
          pendingOrders: [
            { $match: { orderStatus: "placed" } },
            { $count: "count" }
          ],
          ordersDelivered: [
            {$match: {orderStatus: "delivered"}},
            {$count: "count"}
          ],
            ordersShipped: [
            {$match: {orderStatus: "shipped"}},
            {$count: "count"}
          ],
          ordersPlaced: [
            {$match: {orderStatus: "placed"}},
            {$count: "count"}
          ],
          ordersCancelled: [
            {$match: {orderStatus: "cancelled"}},
            {$count: "count"}
          ]

          

        }
      },



    ])
        const users = await userModel.aggregate([
    {
      $group: {
        _id: null,
       totalusers: {$sum: 1}


      }
    }
  ])

   

    
    return res.status(200).json({
      success: true,
      message: "total income found",
      totalRevenueAndOrderStats: revenueAndOrderStats,
      totalusers: users



      

    })


    
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "total income not found",
      data: error.message

    })


  }


}





export {
  MonthlyIncome,
  revenueAndOrdersData,
  
}


