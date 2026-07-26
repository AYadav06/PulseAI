import express  from "express";
import cors from "cors";

import dotenv from "dotenv";
import connectDb from "./config/db";
import { userRouter } from "./routes/auth";
import { chatRouter } from "./routes/chat";
import { paymentRouter } from "./routes/payment";
import cookieParser from "cookie-parser";

dotenv.config();

const app=express();
const port=3000;
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1",userRouter);
app.use("/api/v1",chatRouter);
app.use("/api/v1",paymentRouter);
connectDb();
app.listen(port ,()=>{
    console.log("server is running...");
})

app.use((req, res) => {
    console.log(`Received a ${req.method} request to path: ${req.originalUrl}`);
    res.status(404).send(`Route not found on this server.`);
});

