import express  from "express";

import dotenv from "dotenv";
import connectDb from "./config/db";
import { userRouter } from "./routes/auth";

dotenv.config();

const app=express();
const port=3000;

app.use(express.json());

app.use("/api/v1",userRouter);
connectDb();
app.listen(port ,()=>{
    console.log("server is running...");
})

// Place this at the VERY END of your server.ts routes
app.use((req, res) => {
    console.log(`Received a ${req.method} request to path: ${req.originalUrl}`);
    res.status(404).send(`Route not found on this server.`);
});

