// import { GoogleGenAI } from "@google/genai";
// import { Router } from "express";
// import { ENV } from "../config/env";


// const ai = new GoogleGenAI({
//  apiKey:ENV.GEMINI_API_KEY
// });

// export const chatRouter = Router();

// // 1. Changed to a standard async request/response handler for Express
// chatRouter.get("/chat", async (req, res) => {
//     try {
//         // 2. Use ai.models.generateContent instead of interactions.create
//         const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: "how are you???",
//         });

//         // 3. Log it and send it back to the client so your API doesn't hang
//         console.log(response.text);
//         res.json({ reply: response.text });
        
//     } catch (error) {
//         console.error("Gemini Error:", error);
//         res.status(500).json({ error: "Failed to generate content" });
//     }
// });