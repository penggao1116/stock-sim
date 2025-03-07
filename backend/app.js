const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const pool = require('./db'); 

const app = express();
app.use(express.json());
app.use(cors());

// Import routes
const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stocks');
const portfolioRoutes = require('./routes/portfolio');
const transactionRoutes = require('./routes/transactions');
const userRoutes = require('./routes/users');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

module.exports = app; 