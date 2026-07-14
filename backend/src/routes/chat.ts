import { Router } from "express";
import { conversationController, listExecutions } from "../controllers/conversation";
import { authMiddleware } from "../middleware/authMiddleware";
import { deleteChat, handleStreamingChat } from "../controllers/chat_controller";


export const chatRouter=Router();


chatRouter.get("/converstion/:converstionId",authMiddleware,conversationController);
chatRouter.post("/chat",authMiddleware,handleStreamingChat);
chatRouter.delete("/chat/:chatId",authMiddleware,deleteChat);
chatRouter.get("/executions", authMiddleware, listExecutions);