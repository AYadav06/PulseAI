import { GoogleGenAI } from "@google/genai";
import { ENV } from "../config/env";
import { Request, Response } from "express";
import { chatschemes, MODELS } from "../types";
import { Conversation } from "../models/conversation";
import { Execution } from "../models/execution";



const ai =new GoogleGenAI({
    apiKey:ENV.GEMINI_API_KEY
});


export const handleStreamingChat= async (req:Request,res:Response):Promise<void>=>{
    const userId=req.userId;

    const {data,success}=chatschemes.safeParse(req.body);
    const conversationId=data?.conversationId;
    if(!success || !data){

        res.status(411).json({
            message:"Incorrect inputs"
        });
        return ;
    }
    const message=data.message;
    let activeConversation;
    let isNewchat=false;

    try{
   if(conversationId){
    activeConversation=await Conversation.findOne({
        _id:conversationId,
        userId
    })
   }
   if(!activeConversation){
    activeConversation=new Conversation({
        userId,
        messages:[]
    });
    isNewchat=true;
   }

   const history=activeConversation.messages.map(msg =>({
    role:msg.role === "assistant" ?"assistant":"user",
    parts:[{text:msg.content}]
   }));

   // set http header ..
   res.setHeader('Content-Type','text/event-stream');
   res.setHeader('Cache-Control','no-cache');
   res.setHeader('Connection','keep-alive');
   res.flushHeaders();

   const responseStream=await  ai.models.generateContentStream({
    model:'gemini-2.5-flash',
    contents:message,
   });

   let completeAiResponse='';

   for await (const chunk of responseStream) {
   const chunkText = chunk.text || '';
   completeAiResponse += chunkText;
   res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
   }

   activeConversation.messages.push({role:'user',content:message,createdAt:new Date()});
   activeConversation.messages.push({role:'assistant',content:completeAiResponse,createdAt:new Date()});
  
   await activeConversation.save();

   if(isNewchat){
    await Execution.create({
        userId,
        title:message.substring(0,40) + '...',
        conversationId:activeConversation._id
    });
   }
   res.write('data:[Done]\n\n');
   res.end();

    } catch (error) {
        console.error('Streaming Interruption:',error);
    }
 

}

export const deleteChat=async(req:Request,res:Response)=>{

}