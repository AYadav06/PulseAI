import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createOrder,
  verifyPayment,
  razorpayWebhook,
} from "../controllers/payment_controller";

export const paymentRouter = Router();

// Authenticated routes — user must be logged in
paymentRouter.post("/payment/create-order", authMiddleware, createOrder);
paymentRouter.post("/payment/verify", authMiddleware, verifyPayment);

// Webhook — unauthenticated, verified via Razorpay signature
paymentRouter.post("/payment/webhook", razorpayWebhook);
