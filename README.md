# 📈 Stock Exchange Simulation Website

## 🚀 Project Overview
This project is a **stock market simulation platform** where users can **buy and sell stocks with virtual money** using **real-time stock market data**. It provides an **educational experience** for beginners and finance enthusiasts who want to test investment strategies **risk-free**.

---

## 📌 Proposal Questions & Answers

### **1️⃣ Tech Stack**
This project is built using a **React.js frontend** and an **Express.js (Node.js) backend**. The database used is **PostgreSQL**.

- **Frontend:** React.js  
- **Backend:** Express.js (Node.js)  
- **Database:** PostgreSQL  
- **APIs Used:**  
  - [Alpha Vantage API](https://www.alphavantage.co/) - Real-time stock market data  
  - [Finnhub API](https://finnhub.io/) - Alternative for real-time and historical stock data  

---

### **2️⃣ Frontend vs Backend Focus**
This project is an **evenly focused full-stack application**.  
- The **frontend** ensures a **smooth user experience** with features such as stock search, portfolio tracking, and interactive charts.  
- The **backend** handles **authentication, stock transactions, virtual wallet management, and API integration** for real-time stock prices.  

---

### **3️⃣ Type of Application**
This is a **web-based application** accessible via **desktop and mobile browsers**.

---

### **4️⃣ Project Goal**
The goal of this project is to **simulate stock trading using real-world stock data** while allowing users to practice **investment strategies risk-free**.

- Users start with **$10,000 virtual money** and can **buy/sell stocks** based on live stock prices.
- They can **track their portfolio, monitor their performance, and learn how stock trading works**.

---

### **5️⃣ Target Users & Demographics**
👤 **Primary users of this project include:**  
- **Finance Enthusiasts** - People interested in learning stock trading without financial risk.  
- **Students & Beginners** - Individuals studying finance or investing.  
- **Casual Users** - Those who want a **fun and educational trading experience**.  

---

## 📊 **Data Usage & Collection**
### **📡 Data Sources**
#### 📌 **Stock Market Data (From APIs)**
- 📌 **Stock Symbols:** (e.g., AAPL, TSLA, MSFT)  
- 📌 **Current Stock Prices:** Real-time price updates  
- 📌 **Price Changes:** Daily percentage and absolute price fluctuations  
- 📌 **Market Open/Close Prices:** Track session performance  
- 📌 **Trading Volume:** Number of shares traded per session  

#### 📌 **User Data (Stored in PostgreSQL)**
- **User Account Details:** Username, email, password (hashed)  
- **Virtual Balance:** $10,000 starting money  
- **Portfolio Data:** Stocks owned, average buy price, total value  
- **Transaction History:** Buy/sell records with timestamps  

### **📡 Data Collection Method**
- **Stock Market Data:**
  - Retrieved from **Alpha Vantage API** or **Finnhub API**.
  - **On-demand fetching** when users search for stock prices.
  - Cached **temporarily** to prevent excessive API requests.

- **User & Portfolio Data:**
  - Stored in **PostgreSQL database**.
  - Managed via **Express.js backend API** (custom-built).
  - **Secured using JWT authentication** and **hashed passwords (bcrypt)**.

---

## 🏗️ **Database Schema (PostgreSQL)**
### **Users Table**
| Column          | Type       | Description                 |
|---------------|-----------|-----------------------------|
| `id`         | INT (PK)  | Unique user ID              |
| `username`   | VARCHAR   | User’s name                 |
| `email`      | VARCHAR   | User’s email                |
| `password_hash` | VARCHAR  | Hashed password           |
| `balance`    | DECIMAL   | Virtual money ($10,000 default) |

### **Portfolio Table**
| Column         | Type       | Description                |
|---------------|-----------|----------------------------|
| `id`         | INT (PK)  | Unique portfolio entry     |
| `user_id`    | INT (FK)  | Links to Users table       |
| `stock_symbol` | VARCHAR  | e.g., AAPL, TSLA          |
| `quantity`   | INT       | Number of shares owned    |
| `average_price` | DECIMAL  | Avg. buy price          |

### **Transactions Table**
| Column         | Type       | Description                |
|---------------|-----------|----------------------------|
| `id`         | INT (PK)  | Unique transaction ID      |
| `user_id`    | INT (FK)  | Links to Users table       |
| `stock_symbol` | VARCHAR  | e.g., AAPL, TSLA          |
| `transaction_type` | ENUM   | "BUY" or "SELL"           |
| `price`      | DECIMAL   | Price at time of transaction |
| `quantity`   | INT       | Number of shares traded   |
| `timestamp`  | TIMESTAMP | Transaction time          |

---

## 🔥 **Functionality Beyond CRUD**
✅ **Real-Time Stock Data** - Fetching and updating live stock prices.  
✅ **Simulated Trading** - Users can buy/sell stocks based on live prices.  
✅ **Portfolio & Performance Tracking** - Users can monitor their investment performance over time.  
✅ **Leaderboard System** *(Stretch Goal)* - Ranks users based on portfolio value.  
✅ **Stock Market News Feed** *(Stretch Goal)* - Fetch latest financial news.  

---

## 🚨 **Potential API Issues**
⚠️ **Rate Limits:** API providers (Alpha Vantage, Finnhub) have request limits. **Caching mechanism** will help reduce redundant calls.  
⚠️ **Data Delays:** APIs may have minor delays, so users might see slight mismatches in stock prices.  
⚠️ **Accuracy Issues:** If API data is unavailable, a fallback mechanism (like historical averages) will be used.  

---

## 🔒 **Security Considerations**
🔐 **User Authentication**: JWT authentication with secure login/signup.  
🔐 **Password Protection**: All passwords will be **hashed using bcrypt** before storing in the database.  
🔐 **API Key Management**: API keys will be stored in **.env files** and **never exposed in public code**.  
🔐 **Data Encryption**: User data and transactions will be **secured and encrypted** in PostgreSQL.  

---

## 🔄 **User Flow**
1️⃣ **Sign up/Login** → Users create an account.  
2️⃣ **Virtual Wallet** → Users start with **$10,000**.  
3️⃣ **Search for Stocks** → Enter a stock symbol to get live price data.  
4️⃣ **Buy/Sell Stocks** → Users place trades, updating their balance and portfolio.  
5️⃣ **Track Portfolio** → View stock holdings and total value.  
6️⃣ **Transaction History** → Users can see past trades.  
7️⃣ *(Stretch Goal)* **Leaderboard** → Compare performance with other users.  

## 📌 User Flowchart
Below is the user flow for the Stock Exchange Simulation Website:

<pre>
+------------------------+
|  Start (Sign up/Login) |
+-----------+------------+
            |
            v
+------------------------+
| Virtual Wallet ($10,000) |
+-----------+------------+
            |
            v
+----------------------+
|  Search for Stocks   |
+-----------+----------+
            |
            v
+----------------------+
| View Stock Details   |
+-----------+----------+
            |
            v
+----------------------+
|   Buy/Sell Stocks    |
+-----------+----------+
            |
            v
+----------------------+
| Confirm Transaction  |
+-----------+----------+
            |
            v
+------------------------------+
| Update Balance & Portfolio   |
+-----------+------------------+
        |                   |
        v                   v
+------------------+   +----------------------+
| Track Portfolio  |   | View Transaction History |
+-------+----------+   +-------------+--------+
        |                              |
        v                              v
+----------------------+       +--------+
|  Leaderboard (Goal)  | -----> |  End  |
+----------------------+
</pre>

---

## 📅 **Development Roadmap**
| **Day** | **Task** | **Outcome** |
|------|-------------|------------|
| **Day 1** | Setup backend, database, and frontend | API & database connected |
| **Day 2** | User authentication (JWT) | Users can sign up/login |
| **Day 3** | Virtual wallet & stock API integration | Users can search stocks |
| **Day 4** | Buy/sell stock functionality | Users can trade stocks |
| **Day 5** | Portfolio & transaction history | Users can track holdings |
| **Day 6** | UI improvements & testing | Clean UI, bug fixes |
| **Day 7** | Deployment & final testing | Live website is fully functional |
