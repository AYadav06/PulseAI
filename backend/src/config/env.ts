import dotenve from "dotenv";

dotenve.config();

export const ENV={
NODE_ENV:process.env.NODE_ENV,
MONGO_URL:process.env.MONGO_URL,
PORT:process.env.PORT,
GEMINI_API_KEY:process.env.GEMINI_API_KEY || "",
JWT_SECRETE:process.env.JWT_SECRETE,
COOKIE_NAME:process.env.COOKIE_NAME
}