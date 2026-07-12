import { Request, Response } from "express"
import { userTypes } from "../types";
import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { User } from "../models/user";


export const create_user=async (req:Request,res:Response)=>{

    try{
        const {success,data}=userTypes.safeParse(req.body);
        if(!success){
            res.status(411).send("Invalid input")
            return;
        }
        else{
            const hashedPassword=await bcrypt.hash(data.password,10);
            const createUser=await User.create({
                email:data.email,
                password:hashedPassword
            });
            res.status(200).json({
                "message":"User is created..."
            })
            
        }
    }
    catch(e){
        console.error("Signup error details:", e);
        res.status(400).json({
            "message":"Error while signup..."
        })

    };

}
export const sign_user=async(req:Request,res:Response)=>{

    try {
        const {data,success}=userTypes.safeParse(req.body);
       
        if(!success){
            return res.status(411).json({
                message:"Invalid email or password"
            })
        }
        const user=await User.findOne({
            email:data.email,
        })
           if(!user?.password){
            throw new Error("user  password not found..")
           }

        const matchPassword=await bcrypt.compare(data.password,user.password);

        if(matchPassword){
            const token=jwt.sign({
                id:user._id,
            },ENV.JWT_SECRETE as string,
            {expiresIn:"7d"});

            return res
            .status(200)
            .cookie('access_token',token,{
                httpOnly:true,
                secure:true,
                sameSite:ENV.NODE_ENV =="Production",
                maxAge: 7*24*60*60*1000 
            })
            .json({
                message:"Login Successful"
            })
        }
        } catch (error) {
           return res.json({
                message:"error while signup.."
            })
    }
}

export const signout_user=async(req:Request,res:Response)=>{
   return res
   .clearCookie('access_token')
   .json({ message:"logged out successfully."})
}