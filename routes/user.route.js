
import express from 'express'
import { loginUser,registerUser,adminLogin, userName } from '../controllers/user.controllers.js'
import { userAuth } from '../middlewares/user.middleware.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/username',userAuth, userName)

export default userRouter
