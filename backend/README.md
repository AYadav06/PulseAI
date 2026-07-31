# ⚡ PulseAI Backend API

[![Backend Status](https://img.shields.io/badge/Backend-AWS_EC2-orange?style=for-the-badge&logo=amazon-aws)](https://pulseai.amitdev.site)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions)](https://github.com/AYadav06/PulseAI/actions)

This is the backend REST API server for **PulseAI**, built using **Node.js**, **Express 5**, **TypeScript 6**, **MongoDB & Mongoose 9**, **Google Gemini AI SDK**, and **Razorpay Payment Gateway**.

- **Production API URL**: [https://pulseai.amitdev.site](https://pulseai.amitdev.site)
- **Frontend App URL**: [https://app.pulseai.amitdev.site](https://app.pulseai.amitdev.site)

---

## 🛠️ Tech Stack & Dependencies

- **Server Framework**: Node.js & Express 5
- **Language**: TypeScript 6
- **Database**: MongoDB (Atlas) via Mongoose 9
- **AI SDK**: `@google/genai` (Google Gemini 2.0 Flash / 1.5 Flash / 1.5 Pro)
- **Payments**: Razorpay Node SDK (`razorpay`)
- **Authentication**: JWT (`jsonwebtoken`), Password Hashing (`bcrypt`), Cookie Parser (`cookie-parser`)
- **Schema Validation**: Zod (`zod`)
- **Deployment**: AWS EC2 VM, PM2 process manager, Nginx reverse proxy, Certbot SSL

---

## 📁 Backend Directory Structure

```
backend/
├── src/
│   ├── config/              # Database, env & Razorpay instances
│   │   ├── db.ts
│   │   ├── env.ts
│   │   └── razorpay.ts
│   ├── controllers/         # Endpoint handlers
│   │   ├── auth_controller.ts
│   │   ├── chat_controller.ts
│   │   ├── conversation.ts
│   │   └── payment_controller.ts
│   ├── middleware/
│   │   └── authMiddleware.ts
│   ├── models/              # Mongoose database models
│   │   ├── conversation.ts
│   │   ├── execution.ts
│   │   ├── order.ts
│   │   └── user.ts
│   ├── routes/              # Express route declarations
│   │   ├── auth.ts
│   │   ├── chat.ts
│   │   └── payment.ts
│   ├── types/               # Type definitions, plan specs & Zod validation
│   └── main.ts              # Entry point & Express configuration
├── .env                     # Local environment variables
├── tsconfig.json
└── package.json
```

---

## 🔑 Environment Variables Setup

Create a `.env` file in `backend/`:

```env
# Server Configuration
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://app.pulseai.amitdev.site

# Database & Auth
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/pulseai
JWT_SECRETE=your_jwt_secret_key_here
COOKIE_NAME=access_token

# AI Provider
GEMINI_API_KEY=your_google_gemini_api_key

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_or_live_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

---

## ⚡ Local Development

```bash
# Install dependencies
npm install

# Start development server with ts-node/tsc
npm run dev
```

---

## 📡 Key API Endpoints

- **Auth**: `/api/v1/signup`, `/api/v1/signin`, `/api/v1/signout`, `/api/v1/me`
- **Chat**: `/api/v1/chat` (SSE Streaming), `/api/v1/executions`, `/api/v1/converstion/:id`, `/api/v1/chat/:chatId`
- **Payments**: `/api/v1/payment/create-order`, `/api/v1/payment/verify`, `/api/v1/payment/webhook`

---

## 🚀 AWS EC2 Deployment Details

- **Host Domain**: `pulseai.amitdev.site`
- **Reverse Proxy**: Nginx listening on port 443 proxying to `http://127.0.0.1:3000`
- **SSL**: Certbot Let's Encrypt automated certificate
- **Process Manager**: PM2 running `dist/main.js` as process `app`
- **CI/CD**: GitHub Actions on `git push main` using SSH key deployment
