import * as zod from "zod";


export const zodSignUpSchema = zod.object({
    fullname: zod.string().min(2, {message: "full name must be 2 character long"}),


    email: zod.string().email({message: "enter valid email"}),

    phoneNo: zod.string().regex(/^[0-9]{10}$/ , "please enter valid phone number"),

    password: zod.string().min(8,{ message: "password must have 8 character"})


})



export const zodLoginSchema = zod.object({
  email: zod.string().email({ message: "enter valid email" }).optional(),
  phoneNo: zod.string().regex(/^[0-9]{10}$/, "please enter valid phone number").optional(),
  password: zod.string().min(8, { message: "password must have 8 character" }),
}).refine((data) => data.email || data.phoneNo, {
  message: "Either email or phone number is required",
});