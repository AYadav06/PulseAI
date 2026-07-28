# ⚡ PulseAI — AI Chat Platform with Razorpay Payment Gateway

PulseAI is a modern, full-stack AI chat application built with Node.js, Express, TypeScript, MongoDB, React, Google Gemini AI, and Razorpay Standard Web Checkout. It features real-time streaming AI responses, user authentication, a credit-based billing model, lifetime premium upgrades, and server-verified payment handling.

---

## 🌟 Key Features

- 🤖 **Google Gemini AI Integration**: Powered by `@google/genai` supporting `gemini-2.0-flash`, `gemini-1.5-flash`, and `gemini-1.5-pro` with real-time Server-Sent Events (SSE) streaming.
- 💳 **Razorpay Payment Gateway**: Standard Web Checkout supporting credit packs (*Starter*, *Pro*) and lifetime *Premium Unlock*.
- 🔒 **Cryptographic Payment Verification**: Server-side HMAC-SHA256 signature verification ensuring 100% tamper-proof payment processing.
- 🛡️ **Fail-Safe Webhook Support**: Server-to-server Razorpay `payment.captured` webhook handler ensuring credit delivery even if user browsers disconnect or crash.
- 🔐 **Secure Authentication**: Password hashing with `bcrypt`, JWT stored in `httpOnly` secure cookies.
- 💬 **Conversation Management**: Session tracking, execution history sidebar, chat deletion, and credit deductions per model tier.
- 🎨 **Modern Dark UI**: React 19, Vite, TypeScript, TailwindCSS v4, Lucide icons, and Markdown response rendering.

---

## 🛠️ Tech Stack

### Backend
| Technology | Description |
| :--- | :--- |
| **Node.js & Express 5** | High-performance HTTP server |
| **TypeScript 6** | Strongly-typed application code |
| **MongoDB & Mongoose 9** | NoSQL database for users, orders, and chats |
| **Google GenAI SDK** | `@google/genai` for streaming AI completions |
| **Razorpay SDK** | Node.js payment gateway integration |
| **Zod** | Runtime schema validation |
| **JWT & bcrypt** | Authentication & security |

### Frontend
| Technology | Description |
| :--- | :--- |
| **React 19** | Component framework |
| **Vite 8** | Next-generation frontend tooling |
| **TailwindCSS v4** | Utility-first styling with custom dark theme |
| **React Router 7** | Client-side routing |
| **Lucide & Phosphor Icons** | UI icons |
| **React Markdown & Remark GFM** | Markdown & code block rendering |

---

## 📁 Repository Structure

```
PulseAI/
├── backend/                        # Node.js Express Backend
│   ├── src/
│   │   ├── config/                 # DB, ENV, and Razorpay initializers
│   │   │   ├── db.ts
│   │   │   ├── env.ts
│   │   │   └── razorpay.ts
│   │   ├── controllers/            # Route controllers
│   │   │   ├── auth_controller.ts
│   │   │   ├── chat_controller.ts
│   │   │   ├── conversation.ts
│   │   │   └── payment_controller.ts
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts
│   │   ├── models/                 # Mongoose database models
│   │   │   ├── conversation.ts
│   │   │   ├── execution.ts
│   │   │   ├── order.ts
│   │   │   └── user.ts
│   │   ├── routes/                 # Express API routes
│   │   │   ├── auth.ts
│   │   │   ├── chat.ts
│   │   │   └── payment.ts
│   │   ├── types/                  # Plan types, Zod schemas & model configs
│   │   ├── public/                 # Static HTML checkout test page
│   │   │   └── checkout.html
│   │   └── main.ts                 # Server entry point
│   ├── .env                        # Environment variables (git-ignored)
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

---

## 🔑 Environment Setup

Create a `.env` file inside the `backend/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database & Auth
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/pulse
JWT_SECRETE=your_jwt_secret_key_here
COOKIE_NAME=access_token

# AI Provider
GEMINI_API_KEY=your_gemini_api_key_here

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXX
RAZORPAY_WEBHOOK_SECRET=XXXXXXXXXXXXXXXXXXXX
```

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_BASE=http://localhost:3000/api/v1
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
```

---

## ⚡ Quick Start & Local Development

### 1. Prerequisites
- Node.js (v18+)
- MongoDB database instance (Local or MongoDB Atlas)
- Razorpay Account (Test mode keys)
- Google Gemini API Key

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Build & start development server
npm run dev
```
The backend server will start on `http://localhost:3000`.

### 3. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
The frontend application will start on `http://localhost:5173`.

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/v1`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/signup` | Register a new user | ❌ |
| `POST` | `/signin` | Log in user (returns `httpOnly` JWT cookie) | ❌ |
| `POST` | `/signout` | Clear authentication cookie | ❌ |
| `GET` | `/me` | Get current authenticated user details | ✅ |

### 💬 Chat & Conversations (`/api/v1`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/chat` | SSE streaming route for Gemini AI completion | ✅ |
| `GET` | `/executions` | List past conversation executions for sidebar | ✅ |
| `GET` | `/converstion/:id` | Fetch full message history for a conversation | ✅ |
| `DELETE`| `/chat/:chatId` | Delete a conversation and its execution record | ✅ |

### 💳 Payments (`/api/v1/payment`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/create-order` | Create a Razorpay Order (`starter`, `pro`, `premium`) | ✅ |
| `POST` | `/verify` | Verify HMAC-SHA256 signature and grant credits | ✅ |
| `POST` | `/webhook` | Razorpay `payment.captured` fallback handler | ❌ (HMAC Signed) |

---

## 💰 Pricing & Plans Configuration

Plan parameters are defined in [`src/types/index.ts`](file:///home/amit/Projects/webdev/PulseAI/backend/src/types/index.ts):

| Plan Key | Label | Price (INR) | Amount (Paise) | Credits Awarded |
| :--- | :--- | :--- | :--- | :--- |
| `starter` | Starter Pack | ₹99 | 9,900 | 50 Credits |
| `pro` | Pro Pack | ₹299 | 29,900 | 200 Credits |
| `premium` | Premium Unlock | ₹499 | 49,900 | Unlimited (`isPremium: true`) |

---

## 🔄 Razorpay Payment Architecture

```
┌──────────────┐          ┌────────────────┐          ┌───────────────────┐
│   Frontend   │ ────────>│ Backend Server │ ────────>│ Razorpay Orders   │
│ (React/Vite) │          │  (Express.js)  │          │      API          │
└──────┬───────┘          └───────┬────────┘          └─────────┬─────────┘
       │                          │                             │
       │ 1. POST /create-order    │ 2. razorpay.orders.create   │
       │                          │<────────────────────────────┘
       │<─────────────────────────┘  (returns orderId & keyId)
       │
       │ 3. Opens Razorpay Modal (Checkout.js)
       │ 4. User completes payment
       │
       │ 5. POST /verify (razorpay_order_id, payment_id, signature)
       ├─────────────────────────>┌────────────────┐
       │                          │ Verify HMAC    │
       │                          │ Update DB      │
       │<─────────────────────────┤ Return Success │
       │                          └────────────────┘
       │                                  ▲
       │                                  │ (Fallback Webhook if browser drops)
       │                          ┌───────┴────────┐
       └─────────────────────────>│ Razorpay       │
                                  │ Webhook Engine │
                                  └────────────────┘
```

1. **Order Creation**: Client requests `/payment/create-order` with chosen plan. Server calculates amount in paise and invokes `razorpayInstance.orders.create()`, saving an `Order` document in MongoDB with status `created`.
2. **Checkout Modal**: Client opens the Razorpay popup using `window.Razorpay(options)`.
3. **Verification**: On payment completion, client calls `/payment/verify`. Backend computes HMAC-SHA256 of `order_id|payment_id` using `RAZORPAY_KEY_SECRET`. If signature matches, order status changes to `paid` and user credits are incremented.
4. **Webhook Safety Net**: If network disconnects before step 3, Razorpay sends a `payment.captured` POST request to `/payment/webhook`. The backend verifies the `x-razorpay-signature` and updates user credits idempotently.

---

## 🧪 Testing Razorpay Integration

When testing in **Test Mode**:
- Use domestic test card details to prevent *"International cards are not supported"* errors:
  - **Visa Domestic**: `4000 0000 0000 0002` (CVV: `123`, Expiry: Any future date)
  - **MasterCard Domestic**: `5123 4567 8901 2346` (CVV: `123`, Expiry: Any future date)
  - **UPI / Netbanking**: Select Netbanking/UPI in modal and click **Success** on the mock page.

---
