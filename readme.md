# 💸 UPI App Backend (Node.js + Express + Knex + PostgreSQL)

A backend implementation of a **UPI-like payment system** built with **Express.js, Knex.js, PostgreSQL**, and **JWT authentication**.  
This project supports **user authentication, bank account linking, sending/receiving money, transaction requests, and history tracking**.  

---

## 🚀 Features
- **Authentication**
  - Register, Login, JWT Auth  
  - Secure password hashing with **bcrypt**  
- **Bank Accounts**
  - Link a bank account  
  - Check balances  
- **Transactions**
  - Send Money (direct transfer)  
  - Request Money → Respond (Accept/Reject)  
  - View requests (made/received) with filters  
  - Transaction history & transaction status  
- **Security**
  - Input validation with **Joi**  
  - **Rate limiting** (express-rate-limit) for login & transaction APIs  
  - **Helmet** & **CORS** enabled  
  - Centralized error handling  

---

## 🛠️ Tech Stack
- **Node.js** + **Express.js**  
- **Knex.js** (Query Builder)  
- **PostgreSQL** (Database)  
- **JWT** (Authentication)  
- **bcrypt** (Password hashing)  
- **express-rate-limit**, **helmet**, **cors**, **morgan**, **joi**  

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/your-username/upi_app_backend.git
cd upi_app_backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in root:
```env
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=upi_db
JWT_SECRET=your_jwt_secret
```

### 4. Run Migrations & Seeds
```bash
npm run migrate   # create tables
npm run seed      # populate with sample data
```

### 5. Start Server
```bash
npm run dev
```

Server will run on → `http://localhost:4000`

---

## 📑 API Documentation

### 🔐 Authentication APIs

#### 1. Register
`POST /api/auth/register`
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "123456"
}
```
✅ Creates a new user with hashed password.

---

#### 2. Login
`POST /api/auth/login`
```json
{
  "email": "alice@example.com",
  "password": "123456"
}
```
✅ Returns JWT token.

---

#### 3. Profile
`GET /api/auth/profile`  
Header:
```
Authorization: Bearer <token>
```
✅ Returns user details.

---

### 🏦 Bank Account APIs

#### 1. Link Bank Account
`POST /api/bank/link`  
```json
{
  "account_number": "111111",
  "ifsc": "BANK001",
  "balance": 50000
}
```

#### 2. Check Balance
`GET /api/bank/balance`  
Header: `Authorization: Bearer <token>`  
✅ Returns linked accounts & balances.

---

### 💸 Transaction APIs

#### 1. Send Money
`POST /api/transaction/send`  
```json
{   
  "fromAccountId": 1,
  "to_upi_id": "alice@upi",
  "amount": 1000
}
```
✅ Debits sender’s account, credits receiver.

---

#### 2. Request Money
`POST /api/transaction/request`  
```json
{
  "to_user_id": 2,
  "amount": 500
}
```
✅ Creates a pending money request.

---

#### 3. Respond to Request
`POST /api/transaction/respond`  
```json
{
  "request_id": 1,
  "action": "Accepted"
}
```
- `Accepted` → money transferred  
- `Rejected` → request closed  

---

#### 4. View Requests Received
`GET /api/transaction/requests/received`  
Optional filters:  
```
/api/transaction/requests/received?status=Pending&from=2025-09-01&to=2025-09-07
```

#### 5. View Requests Made
`GET /api/transaction/requests/made`

---

#### 6. Transaction History
`GET /api/transaction/history`  
Optional filters:
```
/api/transaction/history?status=Success&from=2025-09-01&to=2025-09-07&page=1&limit=10
```

---

#### 7. Transaction Status
`GET /api/transaction/status/:id`  
✅ Returns details of a specific transaction.

---

## 🧪 Testing in Postman

1. Import environment with `BASE_URL=http://localhost:4000`.  
2. Register → Login → copy token.  
3. Add token in `Authorization: Bearer <token>` for protected routes.  
4. Try linking accounts, sending requests, responding, and viewing history.  

---

## 🔒 Security Measures
- Passwords hashed with **bcrypt**  
- JWT auth middleware  
- **Rate limiting** on login & transaction APIs  
- Input validation with **Joi**  
- **Helmet** & **CORS** enabled  
- Centralized error handling with custom messages  

---

## 📌 Scripts
```bash
npm run dev       # start server with nodemon
npm run migrate   # run latest migrations
npm run seed      # populate database
npm run rollback  # rollback last migration
```

---

## ✅ Sample Users (from seeds)
| Email             | Password | UPI ID     |
|-------------------|----------|------------|
| alice@example.com | 123456   | alice@upi  |
| bob@example.com   | 123456   | bob@upi    |
| charlie@example.com | 123456 | charlie@upi |

---

## 👨‍💻 Author
Built by **Sachin Dhuriya** 🚀  
