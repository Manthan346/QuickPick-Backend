import express from 'express'
import jwt from 'jsonwebtoken'
import { success } from 'zod'
import { createToken } from '../controllers/user.controllers.js'


export const adminAuth = async (req,res,next) => {
   
    
   try {
     let token = req.headers.authorization
     createToken({id: process.env.ADMIN_ID})

     
    if(!token){
        return res.status(500).json({
            success: false,
            message: "token didnt created"
        })

    }
    token = token.split(" ")[1]

    const verify = jwt.verify(token,process.env.JWT_SECRET_KEY)
    if (verify.id !== process.env.ADMIN_ID) {
        return res.status(500).json({
            success: false,
            message: "token is there but admin not found"
        })
        
    }
    next()
   } catch (error) {
        return res.status(500).json({
            success: false,
            message: `something went wrong ${error.message}`
   
        })
        


    }
}