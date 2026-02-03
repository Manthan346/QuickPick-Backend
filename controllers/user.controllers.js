import { success } from "zod"
import userModel from "../models/user.model.js"
import { zodSignUpSchema, zodLoginSchema } from "../zodModels/zod.users.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY)
}


const loginUser = async (req, res) => {
    try {

         console.log("Incoming body:", req.body);
        const result = zodLoginSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "validation failed",
                error: result.error.issues[0]["message"]
            })
        }
        const { email, phoneNo, password } = result.data




        const existingUser = await userModel.findOne({
            $or: [{ email }, { phoneNo }]
        })
        console.log(req.body)
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "user doesnt exists"

                
            })


        }
        const isMatch = await bcrypt.compare(password, existingUser.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "invalid password"
            })


        }

        const token = createToken(existingUser._id)
        return res.status(200).json({
            success: true,
            token,
            message: "login successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server error",
            error: result.error.issues[0]["message"]
        })


    }


}

const registerUser = async (req, res) => {
    try {
        const result = zodSignUpSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(401).json({
                success: false,
                message: "validation failed",
                error: result.error.issues[0]["message"]
            })
        }

        const { fullname, email, phoneNo, password } = result.data
        const existsUser = await userModel.findOne({
            $or: [{ email }, { phoneNo }]
        })

        if (existsUser) {
            return res.status(400).json({
                success: false,
                message: "user already registered with respective phoneNo or email"
            })

        }
        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await userModel.create({
            fullname,
            email,
            phoneNo,
            password: hashedPassword

        })
        const token = createToken(newUser._id)



        return res.status(201).json({
            success: true,
            message: "user created successfully",
            token

        })
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating user",
            error: error.message
        });
    }



}

const userName = async (req,res) => {
    try {
          const userId = req.userId

    const user = await userModel.findById(userId)
    if(!user){
        return res.status(404).json({
            success: false,
            message: "no user found"
        })
    }

    const name = user.fullname
    if(!name) {
        return res.status(400).json({
            success: false,
            message: "no  username found"
        })
    }

    return res.status(200).json({
        success: true,
        message: "User Name found Successfully",
        name
    })
        
    } catch (error) {
        return res.status(400).json({
            message: "cannot find user",
            errors: error.message
        })
        
    }
  

}




const adminLogin = async (req,res) => {
    try {
         const {email, password} = req.body
    if (email === process.env.ADMIN_ID && password === process.env.PASSWORD) {
        const token = createToken(process.env.ADMIN_ID)
        return res.status(200).json({
            success: true,
            message: "admin login successfully",
            token

            

        })
        
    }
    if (email != process.env.ADMIN_ID) {
        return res.status(402).json({
            success: false,
            message: "email is invalid"
        })
        
    }
    if (password != process.env.PASSWORD) {
        return res.status(402).json({
            success: false,
            message: "password is invalid"
        })
        
    }
     
    } catch (error) {
       return res.status(400).json({
        success: false,
        message: error.message
       })
        
    }
   
    

}

export { loginUser, registerUser, adminLogin,createToken,userName }