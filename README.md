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
- 🚀 **Automated CI/CD**: GitHub Actions deploying automatically to AWS EC2 VM with PM2, Nginx, and Certbot SSL.

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

### DevOps & Deployment
| Technology | Description |
| :--- | :--- |
| **AWS EC2** | Linux Virtual Machine hosting backend |
| **GitHub Actions** | Automated CI/CD CD pipeline on `git push main` |
| **PM2** | Process manager keeping backend running continuously |
| **Nginx** | Reverse proxy, HTTP-to-HTTPS redirection & CORS handling |
| **Certbot (Let's Encrypt)** | Free automated SSL/TLS certificates and renewal |

---

## 📁 Repository Structure

```
PulseAI/
├── .github/
│   └── workflows/
│       └── cd.yml                  # GitHub Actions CI/CD Deployment Workflow
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

## 🚀 Deployment (AWS EC2 + GitHub Actions + PM2 + Nginx + Certbot)

This project features an automated **CI/CD Pipeline** that automatically deploys backend updates to an **AWS EC2 Virtual Machine** whenever code is pushed to the `main` branch.

### 🤖 CI/CD Workflow (`.github/workflows/cd.yml`)
The workflow utilizes `appleboy/ssh-action` to log into the EC2 instance via SSH, pull the latest code, install dependencies, compile TypeScript, and restart the server gracefully with PM2:

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
            - name: deploy to VM 
              uses: appleboy/ssh-action@v1
              with:
                host: ${{ secrets.HOST }}
                username: ${{ secrets.USERNAME }}
                key: ${{ secrets.SSH_KEY }}
                script: |
                 export PATH="$HOME/.nvm/versions/node/v24.13.0/bin:$PATH"
                 cd PulseAI/backend
                 git pull origin main 
                 npm i 
                 npm run build 
                 pm2 restart app
                 pm2 save
```

### ⚙️ Server Configuration on AWS EC2

#### 1. Process Manager (PM2)
PM2 ensures the Express backend runs continuously in the background and automatically revives upon system reboot or unexpected errors:
```bash
# Start backend app with PM2
cd PulseAI/backend
pm2 start dist/main.js --name "app"
pm2 save
pm2 startup
```

#### 2. Reverse Proxy (Nginx)
Nginx sits in front of the Node.js application, handling incoming HTTP/HTTPS traffic on port `80`/`443` and forwarding requests to Express running locally on port `3000`.

Example `/etc/nginx/sites-available/default` configuration:
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

#### 3. SSL/TLS Encryption with Certbot (Let's Encrypt)
Certbot is used to automatically issue, configure, and renew free SSL/TLS certificates for HTTPS encryption.

**Step A: Install Certbot & Nginx plugin**
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

**Step B: Obtain & Configure SSL Certificate**
Run Certbot to automatically configure Nginx for SSL HTTPS on your domain:
```bash
sudo certbot --nginx -d pulseai.amitdev.site
```
> Certbot automatically modifies `/etc/nginx/sites-available/default` to listen on port `443` with SSL enabled and sets up automatic HTTP-to-HTTPS redirection on port `80`.

**Step C: Verify Automatic Certificate Renewal**
Certbot automatically installs a systemd timer to renew certificates before they expire. Test auto-renewal with:
```bash
sudo certbot renew --dry-run
```

#### 4. GitHub Secrets Setup
To enable the deployment workflow, set the following secrets in GitHub Repository $\rightarrow$ **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions**:

- **`HOST`**: Public IP or DNS of the AWS EC2 instance.
- **`USERNAME`**: SSH login username (e.g. `ubuntu` or `ec2-user`).
- **`SSH_KEY`**: Private SSH key (`.pem` / `id_rsa`) associated with the EC2 instance.

---

## 📄 License

ISC License. Built with ❤️ for PulseAI.
