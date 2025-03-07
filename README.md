# Stock Exchange Simulation Website

Investing in the stock market can be intimidating, especially for beginners. This Stock Exchange Simulation platform provides a realistic trading experience using live market data—allowing users to buy, sell, and manage a virtual portfolio without any financial risk.

## Overview

This project simulates a stock exchange environment where users can:
- **Practice trading** using real-time stock market data.
- **Track portfolio performance** with live updating prices.
- **View transaction history** to analyze past trades.
- **Manage account balance** by adding or withdrawing virtual funds.
- **Monitor performance** with metrics for overall profit/loss since account creation and profit/loss for the current day.

In addition to the stock simulation, the proposal includes additional ideas (like weather-based outfit recommendation and a recipe generator), but this repository focuses on the stock exchange simulation.

## Features

- **User Authentication:** Sign up, login, and secure routes using JWT.
- **Real-Time Trading:** Buy and sell stocks with live market data.
- **Portfolio Management:** View current holdings and adjust your portfolio.
- **Transaction History:** See a detailed log of all your buy/sell transactions.
- **Account Balance:** Track your virtual funds and update them as needed.
- **Performance Tracking:** View overall performance (profit/loss since opening account) and today's performance.
- **Live Price Updates:** Trending stocks update live, and clicking a stock shows a live updating chart of its price history.

## Technology Stack

- **Frontend:**  
  - React
  - React Router
  - Axios
  - Chart.js with react-chartjs-2
  - React Testing Library & Jest for unit/integration tests
- **Backend:**  
  - Node.js with Express
  - PostgreSQL
  - JWT for authentication
  - Axios for API calls
  - Jest & Supertest for backend testing
- **APIs:**  
  - Finnhub Stock API (or alternatives like Yahoo Finance, Alpha Vantage, Alpaca)


## Installation

### Backend

1. **Clone the repository and navigate to the backend folder:**
   git clone <repository-url>
   cd stock-exchange-simulation/backend
2. **Install backend dependencies:**
   npm install express cors dotenv pg axios
   npm install --save-dev jest supertest
3. **Create a .env file in the backend folder and add your environment variables**
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   DATABASE_URL=postgres://USERNAME:PASSWORD@HOST:PORT/DATABASE
   FINNHUB_API_KEY=your_finnhub_api_key_here
4. **Start the backend server in development mode:**
   npm run dev
5. **Run backend tests:** 
   npm test

### Frontend

1. **Navigate to the frontend folder:**
   cd ../frontend
2. **Install frontend dependencies:**
   npm install react react-dom react-router-dom axios
   npm install react-chartjs-2 chart.js
   npm install --save-dev @testing-library/react @testing-library/jest-dom jest
3. **Create a .env file in the frontend folder and add your Finnhub API key:**
   REACT_APP_FINNHUB_API_KEY=your_actual_finnhub_api_key
4. **Start the frontend server in development mode:**
   npm start
5. **Run frontend tests:** 
   npm test
