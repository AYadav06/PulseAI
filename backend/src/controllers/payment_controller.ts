import { Request, Response } from "express";
import crypto from "crypto";
import { razorpayInstance } from "../config/razorpay";
import { ENV } from "../config/env";
import { Order } from "../models/order";
import { User } from "../models/user";
import {
  PLANS,
  PlanType,
  createOrderSchema,
  verifyPaymentSchema,
} from "../types";

// ─── Create a Razorpay Order ────────────────────────────────────────────────
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { success, data } = createOrderSchema.safeParse(req.body);

    if (!success || !data) {
      return res.status(400).json({ message: "Invalid plan selection" });
    }

    const plan = data.plan as PlanType;
    const planConfig = PLANS[plan];

    if (!planConfig) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    if (!ENV.RAZORPAY_KEY_ID || !ENV.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay API key or secret missing in .env file");
      return res.status(500).json({
        message: "Razorpay credentials not configured in backend .env file",
      });
    }

    // Create a Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: planConfig.amount,
      currency: "INR",
      receipt: `rcp_${Date.now()}_${String(userId).slice(-8)}`,
      notes: {
        userId: userId as string,
        plan: plan,
      },
    });

    // Save order in our database
    await Order.create({
      userId,
      razorpayOrderId: razorpayOrder.id,
      plan,
      amount: planConfig.amount,
      currency: "INR",
      status: "created",
    });

    return res.status(201).json({
      orderId: razorpayOrder.id,
      amount: planConfig.amount,
      currency: "INR",
      keyId: ENV.RAZORPAY_KEY_ID,
      planLabel: planConfig.label,
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    const msg =
      error?.statusCode === 401 || error?.error?.code === "BAD_REQUEST_ERROR"
        ? "Invalid Razorpay Key ID or Key Secret in backend .env file"
        : "Failed to create payment order";
    return res.status(error?.statusCode || 500).json({ message: msg });
  }
};

// ─── Verify Payment Signature ───────────────────────────────────────────────
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { success, data } = verifyPaymentSchema.safeParse(req.body);

    if (!success || !data) {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    // Verify signature: HMAC SHA256 of "order_id|payment_id"
    const expectedSignature = crypto
      .createHmac("sha256", ENV.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Mark order as failed
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed" }
      );
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Find the order
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "paid") {
      return res.status(200).json({ message: "Payment already verified" });
    }

    // Update order with payment details
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.status = "paid";

    const planConfig = PLANS[order.plan as PlanType];

    // Award credits or set premium
    if (order.plan === "premium") {
      await User.findByIdAndUpdate(userId, { isPremium: true });
      order.creditsAwarded = 0;
    } else {
      await User.findByIdAndUpdate(userId, {
        $inc: { credits: planConfig.credits },
      });
      order.creditsAwarded = planConfig.credits;
    }

    await order.save();

    return res.status(200).json({
      message: "Payment verified successfully",
      plan: order.plan,
      creditsAwarded: order.creditsAwarded,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ message: "Payment verification failed" });
  }
};

// ─── Razorpay Webhook Handler ───────────────────────────────────────────────
export const razorpayWebhook = async (req: Request, res: Response) => {
  try {
    const webhookSecret = ENV.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"] as string;

    if (!signature) {
      return res.status(400).json({ message: "Missing signature" });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Webhook signature mismatch");
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === "payment.captured") {
      const paymentEntity = payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      // Find the order
      const order = await Order.findOne({ razorpayOrderId });

      if (!order) {
        console.error("Webhook: Order not found for", razorpayOrderId);
        return res.status(200).json({ status: "ok" }); // Still return 200 to Razorpay
      }

      // Skip if already processed
      if (order.status === "paid") {
        return res.status(200).json({ status: "ok" });
      }

      // Update order
      order.razorpayPaymentId = razorpayPaymentId;
      order.status = "paid";

      const planConfig = PLANS[order.plan as PlanType];

      // Award credits or set premium
      if (order.plan === "premium") {
        await User.findByIdAndUpdate(order.userId, { isPremium: true });
        order.creditsAwarded = 0;
      } else {
        await User.findByIdAndUpdate(order.userId, {
          $inc: { credits: planConfig.credits },
        });
        order.creditsAwarded = planConfig.credits;
      }

      await order.save();
      console.log(`Webhook: Payment captured for order ${razorpayOrderId}`);
    }

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
};
