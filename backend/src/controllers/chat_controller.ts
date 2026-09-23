import { GoogleGenAI } from "@google/genai";
import { ENV } from "../config/env";
import { Request, Response } from "express";
import { chatschemes, MODELS } from "../types";
import { Conversation } from "../models/conversation";
import { Execution } from "../models/execution";
import { User } from "../models/user";

const ai = new GoogleGenAI({
    apiKey: ENV.GEMINI_API_KEY
});

export const handleStreamingChat = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    const { data, success } = chatschemes.safeParse(req.body);
    const conversationId = data?.conversationId;
    if (!success || !data) {
        res.status(411).json({
            message: "Incorrect inputs"
        });
        return;
    }

    const message = data.message;
    const modelId = data.model;

    // 1. Verify model exists
    const selectedModel = MODELS.find(m => m.id === modelId);
    if (!selectedModel) {
        res.status(400).json({
            message: "Invalid model selected"
        });
        return;
    }

    // 2. Fetch user to check premium access and credit balance
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({
            message: "User not found"
        });
        return;
    }

    // 3. Premium Gating: Models flagged with isPremium require a premium subscription
    if (selectedModel.isPremium && !user.isPremium) {
        res.status(403).json({
            message: `${selectedModel.name} requires a Premium subscription. Please upgrade to access this model.`
        });
        return;
    }

    // 4. Credit Deduction: Premium users have unlimited usage. Free users pay per message.
    let creditDeducted = 0;
    let remainingCredits = user.credits;

    if (!user.isPremium) {
        const cost = selectedModel.creditCost ?? 1;
        if (user.credits < cost) {
            res.status(402).json({
                message: `Insufficient credits. ${selectedModel.name} requires ${cost} credits, but you have ${user.credits}. Please top up your credits.`
            });
            return;
        }

        // Atomically deduct credits to prevent concurrent overspending
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, credits: { $gte: cost } },
            { $inc: { credits: -cost } },
            { returnDocument: 'after' }
        );

        if (!updatedUser) {
            res.status(402).json({
                message: `Insufficient credits. ${selectedModel.name} requires ${cost} credits, but you have ${user.credits}. Please top up your credits.`
            });
            return;
        }

        creditDeducted = cost;
        remainingCredits = updatedUser.credits;
    }

    let activeConversation;
    let isNewchat = false;

    try {
        if (conversationId) {
            activeConversation = await Conversation.findOne({
                _id: conversationId,
                userId
            });
        }
        if (!activeConversation) {
            activeConversation = new Conversation({
                userId,
                messages: []
            });
            isNewchat = true;
        }

        // set http header ..
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        res.write(`data: ${JSON.stringify({ 
            conversationId: activeConversation._id.toString(),
            remainingCredits: user.isPremium ? undefined : remainingCredits
        })}\n\n`);

        const MODEL_API_MAP: Record<string, string> = {
            "gemini-2.5-flash-lite": "gemini-3.5-flash-lite",
            "gemini-2.5-flash": "gemini-3.6-flash",
            "gemini-2.5-pro": "gemini-3.1-pro-preview",
        };

        const geminiModel = MODEL_API_MAP[data.model] || data.model;

        const responseStream = await ai.models.generateContentStream({
            model: geminiModel,
            contents: message,
        });

        let completeAiResponse = '';

        for await (const chunk of responseStream) {
            const chunkText = chunk.text || '';
            completeAiResponse += chunkText;
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }

        activeConversation.messages.push({ role: 'user', content: message, createdAt: new Date() });
        activeConversation.messages.push({ role: 'assistant', content: completeAiResponse, createdAt: new Date() });

        await activeConversation.save();

        if (isNewchat) {
            await Execution.create({
                userId,
                title: message.substring(0, 40) + '...',
                conversationId: activeConversation._id
            });
        } else {
            await Execution.findOneAndUpdate(
                { conversationId: activeConversation._id, userId },
                { updatedAt: new Date() }
            );
        }
        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error('Streaming Interruption:', error);
        // Refund deducted credits if generation failed
        if (creditDeducted > 0) {
            try {
                await User.findByIdAndUpdate(userId, { $inc: { credits: creditDeducted } });
            } catch (refundErr) {
                console.error('Failed to refund credits:', refundErr);
            }
        }
        try {
            res.write(`data: ${JSON.stringify({ error: "Something went wrong generating a response." })}\n\n`);
            res.write('data: [DONE]\n\n');
        } catch {}
        res.end();
    }


}

export const deleteChat=async(req:Request,res:Response)=>{
    const userId=req.userId;
    const chatId=req.params.chatId as string;

    try {
        const conversation=await Conversation.findOneAndDelete({
            _id:chatId,
            userId
        });
        if(!conversation){
            res.status(404).json({ message:"Conversation not found" });
            return;
        }
        // Also remove the linked Execution (sidebar entry)
        await Execution.findOneAndDelete({ conversationId:chatId as any, userId });
        res.status(200).json({ message:"Conversation deleted" });
    } catch(error){
        console.error("Error deleting chat:",error);
        res.status(500).json({ message:"Internal server error" });
    }
}
