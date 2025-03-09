const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { buyStock, sellStock } = require('../controllers/transactionController');
const pool = require('../db');

// POST /api/transactions/buy
router.post('/buy', authenticate, buyStock);

// POST /api/transactions/sell
router.post('/sell', authenticate, sellStock);

router.get('/history', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      `SELECT stock_symbol, transaction_type, price, quantity, timestamp
       FROM transactions
       WHERE user_id = $1
       ORDER BY timestamp DESC`,
      [userId]
    );
    res.json({ transactions: result.rows });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ message: 'Error fetching transaction history' });
  }
});

module.exports = router;
