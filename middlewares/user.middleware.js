import express from 'express'
import jwt from 'jsonwebtoken'
import { success } from 'zod'
import { createToken } from '../controllers/user.controllers.js'


const userAuth = (req, res, next) => {
    try {

        let token = req.headers.authorization
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User is not authorized"
            })


        }

        token = token.split(" ")[1]
        const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.userId = token_decode.id

        if (token_decode.id === process.env.ADMIN_ID) {
            return res.status(403).json({
                success: false,
                message: "Admin cannot use cart"
            })
        }

        next()





    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            errors: error.message
        })

    }

}


export {
    userAuth
}