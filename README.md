# ⚡ PulseAI — Full-Stack AI Chat Platform

[![Frontend Status](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://app.pulseai.amitdev.site)
[![Backend Status](https://img.shields.io/badge/Backend-AWS_EC2-orange?style=for-the-badge&logo=amazon-aws)](https://pulseai.amitdev.site)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions)](https://github.com/AYadav06/PulseAI/actions)
[![License](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](LICENSE)

**PulseAI** is a modern, high-performance full-stack AI chat application built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, **React 19**, **Google Gemini AI**, and **Razorpay Payment Gateway**. 

It features real-time Server-Sent Events (SSE) streaming AI completions, a credit-based monetization model with lifetime premium upgrades, cryptographically verified payments, automated fallback webhooks, and an enterprise CI/CD deployment pipeline.

---

## 🌐 Live Production Links

| Service | Host / Platform | Live URL | Description |
| :--- | :--- | :--- | :--- |
| **Frontend Application** | **Vercel** | [https://app.pulseai.amitdev.site](https://app.pulseai.amitdev.site) | React 19 SPA with custom domain mapping |
| **Backend REST API** | **AWS EC2 VM** | [https://pulseai.amitdev.site](https://pulseai.amitdev.site) | Node.js Express server with SSL & Nginx reverse proxy |

---

## 🌟 Key Features

- 🤖 **Google Gemini AI Integration**: Powered by `@google/genai` supporting `gemini-2.0-flash`, `gemini-1.5-flash`, and `gemini-1.5-pro` with real-time SSE streaming.
- 💳 **Razorpay Payment Gateway**: Integrated Standard Web Checkout supporting credit packs (*Starter*, *Pro*) and lifetime *Premium Unlock*.
- 🔒 **Cryptographic Payment Verification**: Server-side HMAC-SHA256 signature verification ensuring tamper-proof credit allocations.
- 🛡️ **Fail-Safe Webhook Engine**: Handles Razorpay `payment.captured` webhook events asynchronously, guaranteeing credit delivery even if browser sessions disconnect.
- 🔐 **Secure Authentication**: Password hashing using `bcrypt` with session management via `httpOnly` secure cookies.
- 💬 **Conversation & Session Management**: Sidebar history, execution tracking, thread deletion, and dynamic credit deduction per model tier.
- 🎨 **Modern Responsive Dark UI**: React 19, Vite, TailwindCSS v4, Lucide icons, syntax-highlighted code blocks, and Markdown rendering.
- 🚀 **Automated CI/CD**: GitHub Actions deploying backend updates directly to AWS EC2 VM with PM2, Nginx, and Certbot SSL auto-renew.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, TypeScript
- **Tooling**: Vite 8
- **Styling**: TailwindCSS v4, Radix UI, Lucide Icons, Phosphor Icons
- **Markdown Rendering**: `react-markdown`, `remark-gfm`
- **Routing**: React Router v7
- **Hosting**: Vercel

### Backend
- **Runtime & Server**: Node.js, Express 5, TypeScript 6
- **Database**: MongoDB & Mongoose 9 (Users, Orders, Executions, Conversations)
- **AI SDK**: `@google/genai` (Google Gemini 2.0 / 1.5 APIs)
- **Payments**: Razorpay Node.js SDK
- **Security & Validation**: Zod, JSON Web Tokens (`jsonwebtoken`), `bcrypt`, `cookie-parser`
- **Hosting**: AWS EC2 Linux VM

### DevOps & Infrastructure
- **CI/CD Pipeline**: GitHub Actions (`.github/workflows/cd.yml`)
- **Process Manager**: PM2 (Zero-downtime process daemon)
- **Web Server & Reverse Proxy**: Nginx
- **SSL / TLS Encryption**: Certbot (Let's Encrypt automated SSL)

---

## 📁 Repository Structure

```
PulseAI/
├── .github/
│   └── workflows/
│       └── cd.yml                   # GitHub Actions CI/CD Deployment Workflow
├── backend/                         # Node.js Express Backend API
│   ├── src/
│   │   ├── config/                  # Database, Environment & Razorpay configuration
│   │   │   ├── db.ts
│   │   │   ├── env.ts
│   │   │   └── razorpay.ts
│   │   ├── controllers/             # Route logic (Auth, Chat SSE, Conversations, Payments)
│   │   │   ├── auth_controller.ts
│   │   │   ├── chat_controller.ts
│   │   │   ├── conversation.ts
│   │   │   └── payment_controller.ts
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts
│   │   ├── models/                  # Mongoose DB Schemas (User, Order, Execution, Conversation)
│   │   │   ├── conversation.ts
│   │   │   ├── execution.ts
│   │   │   ├── order.ts
│   │   │   └── user.ts
│   │   ├── routes/                  # Express endpoints (/auth, /chat, /payment)
│   │   │   ├── auth.ts
│   │   │   ├── chat.ts
│   │   │   └── payment.ts
│   │   ├── types/                   # Zod schemas, typescript interfaces & plan definitions
│   │   └── main.ts                  # Server entry point & CORS middleware
│   ├── .env                         # Backend environment variables
│   ├── tsconfig.json
│   └── package.json
├── frontend/                        # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── components/              # UI components (ChatHeader, ChatInput, SideBar, CreditsModal, etc.)
│   │   ├── context/                 # Auth & Chat State Context
│   │   ├── pages/                   # Views (Dashboard, SignIn, SignUp)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env                         # Frontend environment variables
│   ├── vite.config.ts
│   └── package.json
└── README.md                        # Documentation
```

---

## 🔑 Environment Variables Setup

### Backend `.env` (`backend/.env`)
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
RAZORPAY_KEY_ID=rzp_live_or_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

### Frontend `.env` (`frontend/.env`)
```env
VITE_API_BASE=https://pulseai.amitdev.site/api/v1
VITE_RAZORPAY_KEY_ID=rzp_live_or_test_key_id
```

---

## ⚡ Quick Start & Local Development

### 1. Prerequisites
- **Node.js** v18+ and **npm** or **bun**
- **MongoDB** instance (Local or MongoDB Atlas)
- **Google Gemini API Key** from Google AI Studio
- **Razorpay Account** (Test mode or Live mode keys)

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Build TypeScript and start dev server
npm run dev
```
The backend server runs locally at `http://localhost:3000`.

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
The frontend application runs locally at `http://localhost:5173`.

---

## 📡 API Reference & Endpoints

### 🔐 Authentication (`/api/v1`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/signup` | Register a new user account | ❌ |
| `POST` | `/signin` | Authenticate user & attach `httpOnly` JWT cookie | ❌ |
| `POST` | `/signout` | Clear authentication cookie | ❌ |
| `GET` | `/me` | Retrieve profile & current credit count | ✅ |

### 💬 Chat & Conversations (`/api/v1`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/chat` | SSE streaming endpoint for Gemini AI completions | ✅ |
| `GET` | `/executions` | Fetch history sidebar items for user | ✅ |
| `GET` | `/converstion/:id` | Fetch full message transcript for a execution | ✅ |
| `DELETE`| `/chat/:chatId` | Delete a specific execution and message thread | ✅ |

### 💳 Payments (`/api/v1/payment`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/create-order` | Create a Razorpay Order (`starter`, `pro`, `premium`) | ✅ |
| `POST` | `/verify` | Verify HMAC-SHA256 signature and credit account | ✅ |
| `POST` | `/webhook` | Razorpay `payment.captured` fallback handler | ❌ (HMAC Signed) |

---

## 💰 Credit Billing & Pricing Tiers

| Plan Key | Name | Price (INR) | Amount (Paise) | Benefits |
| :--- | :--- | :--- | :--- | :--- |
| `starter` | **Starter Pack** | ₹99 | 9,900 | **50 Credits** |
| `pro` | **Pro Pack** | ₹299 | 29,900 | **200 Credits** |
| `premium` | **Premium Unlock** | ₹499 | 49,900 | **Unlimited Access** (`isPremium: true`) |

---

## 🔄 Razorpay Payment Architecture

```
┌──────────────┐          ┌────────────────┐          ┌───────────────────┐
│   Frontend   │ ────────>│ Backend Server │ ────────>│ Razorpay Orders   │
│   (Vercel)   │          │   (AWS EC2)    │          │      API          │
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
       │                          │ Razorpay       │
       │                          │ Webhook Engine │
       │                          └────────────────┘
```

1. **Order Initialization**: The frontend issues a `POST /api/v1/payment/create-order` request with the desired `plan`. The backend computes the exact cost in paise and invokes `razorpay.orders.create()`. An `Order` record with status `created` is stored in MongoDB.
2. **Checkout Modal**: The frontend launches the native Razorpay modal using `window.Razorpay(options)`.
3. **Verification**: After payment completion, Razorpay returns `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`. The frontend sends these to `POST /api/v1/payment/verify`. The backend verifies `HMAC-SHA256(order_id + "|" + payment_id, secret)`. Upon match, user credits or premium status are updated instantly.
4. **Asynchronous Webhook**: If the user closes the browser before step 3, Razorpay sends a `payment.captured` POST request to `/api/v1/payment/webhook`. The backend verifies the signature header (`x-razorpay-signature`) and updates the user's credits idempotently.

---

## 🚀 Production Deployment Architecture

```
                     ┌─────────────────────────────────────────┐
                     │                 User                    │
                     └────────────────────┬────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  │                                               │
                  ▼                                               ▼
     ┌────────────────────────┐                      ┌────────────────────────┐
     │  Frontend: Vercel      │                      │  Backend: AWS EC2 VM   │
     │  app.pulseai.          │                      │  pulseai.              │
     │  amitdev.site          │                      │  amitdev.site          │
     └────────────────────────┘                      └────────────┬───────────┘
                                                                  │ (Port 443 HTTPS)
                                                                  ▼
                                                     ┌────────────────────────┐
                                                     │ Nginx Reverse Proxy    │
                                                     │ + Certbot SSL          │
                                                     └────────────┬───────────┘
                                                                  │ (Pass to Port 3000)
                                                                  ▼
                                                     ┌────────────────────────┐
                                                     │ Express Server (PM2)   │
                                                     └────────────────────────┘
```

### 1. Frontend Deployment (Vercel)
- **Domain**: `app.pulseai.amitdev.site`
- **Build Settings**:
  - Build Command: `npm run build`
  - Output Directory: `dist`
- **Environment Variables**:
  - `VITE_API_BASE`: `https://pulseai.amitdev.site/api/v1`
  - `VITE_RAZORPAY_KEY_ID`: `rzp_live_...`
- **DNS Configuration**: CNAME record pointing `app.pulseai.amitdev.site` to `cname.vercel-dns.com`.

---

### 2. Backend Deployment (AWS EC2 + GitHub Actions + PM2 + Nginx)
- **Domain**: `pulseai.amitdev.site`

#### A. Automated CI/CD Pipeline (`.github/workflows/cd.yml`)
When code is pushed to the `main` branch, GitHub Actions connects via SSH to the AWS EC2 instance and runs the build deployment:

```yaml
name: CD
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to AWS EC2 VM
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            export PATH="$HOME/.nvm/versions/node/v24.13.0/bin:$PATH"
            cd PulseAI/backend
            git pull origin main
            npm install
            npm run build
            pm2 restart app
            pm2 save
```

#### B. Process Management with PM2
PM2 ensures the Node.js Express app runs continuously and automatically restarts after crashes or server reboots:
```bash
cd PulseAI/backend
pm2 start dist/main.js --name "app"
pm2 save
pm2 startup
```

#### C. Nginx Reverse Proxy Configuration
Nginx handles incoming HTTPS requests on port `443` and proxies them internally to `http://127.0.0.1:3000`:

`/etc/nginx/sites-available/default`:
```nginx
server {
    listen 80;
    server_name pulseai.amitdev.site;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### D. Certbot SSL Configuration (Let's Encrypt)
Certbot manages automated SSL/TLS certificates and automatic HTTP-to-HTTPS redirects:
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d pulseai.amitdev.site
```
Verify automatic renewal timer:
```bash
sudo certbot renew --dry-run
```

#### E. GitHub Secrets Required
To enable automated deployments, configure the following secrets under **Repository Settings $\rightarrow$ Secrets and variables $\rightarrow$ Actions**:
- `HOST`: AWS EC2 Instance IPv4 address / Public DNS.
- `USERNAME`: Server SSH username (e.g. `ubuntu` or `ec2-user`).
- `SSH_KEY`: Content of the private SSH key file (`.pem`).

---

## 🔒 Security Best Practices

- **Strict CORS Policy**: Whitelists only trusted origins (`https://app.pulseai.amitdev.site` and `localhost`).
- **HTTP-Only Cookies**: JWT authentication token is delivered inside an `httpOnly` secure cookie to mitigate XSS vulnerabilities.
- **HMAC Signatures**: Every payment verification and webhook execution requires SHA256 HMAC verification.
- **Environment Confidentiality**: Secret keys, database connection strings, and webhook tokens are injected exclusively via environment variables.

---

## 📄 License

This project is licensed under the **ISC License**. Built with ❤️ for PulseAI.
