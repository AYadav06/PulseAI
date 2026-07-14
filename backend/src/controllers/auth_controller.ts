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
            const token=jwt.sign({
                id:createUser._id,
            },ENV.JWT_SECRETE as string,
            {expiresIn:"7d"});

            res
            .status(201)
            .cookie('access_token',token,{
                httpOnly:true,
                secure:ENV.NODE_ENV === "Production",
                sameSite:ENV.NODE_ENV === "Production" ? "none" : "lax" as any,
                maxAge: 7*24*60*60*1000 
            })
            .json({
                message:"User is created...",
                user: { id: createUser._id, email: createUser.email }
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
                secure:ENV.NODE_ENV === "Production",
                sameSite:ENV.NODE_ENV === "Production" ? "none" : "lax" as any,
                maxAge: 7*24*60*60*1000 
            })
            .json({
                message:"Login Successful",
                user: { id: user._id, email: user.email }
            })
        } else {
            return res.status(401).json({ message:"Invalid email or password" })
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

export const getMe=async(req:Request,res:Response)=>{
    try {
        const user=await User.findById(req.userId).select('-password');
        if(!user){
            return res.status(404).json({ message:"User not found" });
        }
        return res.status(200).json({
            user: { id: user._id, email: user.email }
        });
    } catch (error) {
        return res.status(500).json({ message:"Internal server error" });
    }
}