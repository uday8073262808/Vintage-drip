# 🛍️ MyDrip T-Shirt Store - Backend

This is the Node.js + Express backend for the MyDrip e-commerce app. It handles authentication (email, phone, Google OAuth), product APIs, cart logic, and user data persistence.

## ✅ Features Done
- User authentication
  - Email/password login
  - Phone OTP login via Twilio
  - Google OAuth login via Passport.js
- JWT-based token system
- MySQL database connection
- Product data from MySQL
- Address saving & user profile fetching
- Image hosting via `/public/images/`

## 🛠️ Technologies Used
- Node.js + Express
- MySQL (with `mysql2`)
- Passport.js (OAuth strategy)
- JWT (`jsonwebtoken`)
- dotenv
- Twilio

## ▶️ How to Run
```bash
cd server
npm install
node server.js
```

Ensure your `.env` includes:

```
JWT_SECRET=yourSecret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourPassword
DB_NAME=tshirt_store

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

TWILIO_SID=...
TWILIO_AUTH=...
TWILIO_PHONE=...
```

## 📦 APIs Created
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/phone/send-otp`
- `POST /api/auth/phone/verify-otp`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `GET /api/products/search?q=`
- `GET /api/user/profile` (protected)
- `POST /api/user/address` (save address)

## 📝 What’s Next (Backend)
- Create `orders` table
- Add `/api/orders` POST + GET endpoints
- Create `/api/admin/products` (CRUD routes)
- Add pagination + filters

---

## 🧠 Continuing Later
- Open terminal in `server/`
- Run `npm install` (if needed)
- Start with `node server.js`
- Make sure your `.env` is set and MySQL is running
- Tokens are issued via `/login`, saved in `localStorage` on frontend