
import  * as z from "zod"

const MAX_INPUT_TOKENS=1000;
export const  userTypes= z.object({
    email:z.email(),
    password:z.string()
})
export type ModelFull={
    id:string;
    name:string;
    isPremium:boolean;
    creditCost:number;
}
export const MODELS:ModelFull[]=[
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", isPremium: false, creditCost: 2 },
  { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", isPremium: false, creditCost: 1 },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", isPremium: true, creditCost: 5 },
]

export const SUPPORTER_MODELS = MODELS.map(model => model.id);
export type MODEL = typeof SUPPORTER_MODELS[number];

export const chatschemes=z.object({
   conversationId:z.string().optional(),
    message:z.string().max(MAX_INPUT_TOKENS),
    model:z.enum(SUPPORTER_MODELS)
})

// ---- Payment Plan Types ----

export type PlanType = "starter" | "pro" | "premium";

export const PLANS: Record<PlanType, { amount: number; credits: number; label: string }> = {
  starter:  { amount: 9900,  credits: 50,  label: "Starter Pack" },
  pro:      { amount: 29900, credits: 200, label: "Pro Pack" },
  premium:  { amount: 49900, credits: 0,   label: "Premium Unlock" }, // sets isPremium=true
};

export const createOrderSchema = z.object({
  plan: z.enum(["starter", "pro", "premium"]),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});
