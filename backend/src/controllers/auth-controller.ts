import { Request, Response } from "express"
import { userTypes } from "../types";
import userModel, { userSchema } from "../models/user";
import bcrypt from "bcrypt";


export const create_user=async (req:Request,res:Response)=>{


    try{

        const {success,data}=userTypes.safeParse(req.body);
        
        if(!success){
            res.status(411).send("Invalid input")
            return;
        }
        else{
            const hashedPassword=await bcrypt.hash(data.password,10);
            const createUser=await userModel.create({
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

    return ;

}

export const logout_user=async(req:Request,res:Response)=>{
    return ;
}