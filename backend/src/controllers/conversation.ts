import { Request, Response } from "express";
import { Execution } from "../models/execution";
import { Conversation } from "../models/conversation";


export const conversationController=async (req:Request,res:Response)=>{

    const userId=req.userId;
    const conversationId=req.params;

    try {
        
        const execution=await Execution.findOne({
            conversationId,
            userId
        });
      if(!execution){
        res.status(404).json({
            message:"Execution not found.."
        })
        return ;
      }

      const conversation=await Conversation.findOne({
        _id:conversationId,
        userId:userId
      })
      res.json({
        conversation
      })
 
    } catch (error) {
        console.error("Error fetching conversation:",error);
        res.status(500).json({
            message:"Internal server error"
        })
        
    }
}