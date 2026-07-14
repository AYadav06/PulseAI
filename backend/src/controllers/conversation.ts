import { Request, Response } from "express";
import { Execution } from "../models/execution";
import { Conversation } from "../models/conversation";


export const conversationController=async (req:Request,res:Response)=>{

    const userId=req.userId;
    const conversationId=req.params.converstionId as string;

    try {
        
        const execution=await Execution.findOne({
            conversationId: conversationId,
            userId
        });
      if(!execution){
        res.status(404).json({
            message:"Execution not found.."
        })
        return ;
      }

      const conversation=await Conversation.findOne({
        _id: conversationId,
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

export const listExecutions=async (req:Request,res:Response)=>{
    try {
        const executions=await Execution.find({ userId: req.userId })
            .sort({ updatedAt: -1 })
            .select('title conversationId createdAt updatedAt');
        res.json({ executions });
    } catch (error) {
        console.error("Error listing executions:",error);
        res.status(500).json({ message:"Internal server error" });
    }
}