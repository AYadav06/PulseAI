import { NextFunction, Request, Response } from "express";
import { ENV } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken"


export const authMiddleware=(req:Request,res:Response,next:NextFunction)=>{

 try {
    const token=req.cookies.access_token;

    if(!token){
        return res
        .status(400)
        .json({message:"no token ,authorization denied."})
    }

    const decoded=jwt.verify(token,ENV.JWT_SECRETE as string) as JwtPayload;
    req.userId=decoded.id;
    next();

 } 
 catch (error) {
    return res
    .status(401)
    .json(
        {
            message:"Unauthorized User",error
        })
 }

}