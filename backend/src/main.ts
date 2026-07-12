import express  from "express";

import dotenv from "dotenv";
import connectDb from "./config/db";
import { userRouter } from "./routes/auth";
import { chatRouter } from "./routes/chat";
import cookieParser from "cookie-parser";

dotenv.config();

const app=express();
const port=3000;
console.log("DEBUG: GEMINI_API_KEY is:", process.env.GEMINI_API_KEY ? "FOUND (Starts with " + process.env.GEMINI_API_KEY.slice(0, 5) + "...)" : "NOT FOUND / UNDEFINED");
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1",userRouter);
app.use("/api/v1",chatRouter);
connectDb();
app.listen(port ,()=>{
    console.log("server is running...");
})

// Place this at the VERY END of your server.ts routes
app.use((req, res) => {
    console.log(`Received a ${req.method} request to path: ${req.originalUrl}`);
    res.status(404).send(`Route not found on this server.`);
});

