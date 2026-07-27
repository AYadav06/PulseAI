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

app.use(express.json());
app.use(cookieParser());



const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL || "https://app.pulseai.amitdev.site", 
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/v1",userRouter);
app.use("/api/v1",chatRouter);
app.use("/api/v1",paymentRouter);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "PulseAI Backend is running",
  });
});
connectDb();
app.listen(port ,()=>{
    console.log("server is running...");
})

app.use((req, res) => {
    console.log(`Received a ${req.method} request to path: ${req.originalUrl}`);
    res.status(404).send(`Route not found on this server.`);
});

