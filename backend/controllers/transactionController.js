const axios = require('axios');
const pool = require('../db');

exports.buyStock = async (req, res) => {
  const userId = req.userId;
  const { symbol, quantity } = req.body;

  if (!symbol || !quantity) {
    return res.status(400).json({ message: 'Symbol and quantity are required' });
  }

  try {
    const priceResponse = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${process.env.FINNHUB_API_KEY}`
    );
    const currentPrice = priceResponse.data.c;

    // If the returned price is 0, the stock symbol is invalid
    if (!currentPrice || currentPrice === 0) {
      return res.status(400).json({ message: 'Invalid stock symbol' });
    }

    // Check user's balance
    const userResult = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
    const balance = parseFloat(userResult.rows[0].balance);
    const cost = currentPrice * quantity;

    if (cost > balance) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct cost from user's balance
    const newBalance = balance - cost;
    await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, userId]);

    // Insert the transaction record
    await pool.query(
      `INSERT INTO transactions (user_id, stock_symbol, transaction_type, price, quantity)
       VALUES ($1, $2, 'BUY', $3, $4)`,
      [userId, symbol.toUpperCase(), currentPrice, quantity]
    );

    // Update portfolio: if the stock already exists for the user, update it; otherwise, insert a new row.
    const portfolioResult = await pool.query(
      'SELECT * FROM portfolio WHERE user_id = $1 AND stock_symbol = $2',
      [userId, symbol.toUpperCase()]
    );
    if (portfolioResult.rowCount > 0) {
      const existing = portfolioResult.rows[0];
      const totalShares = existing.quantity + quantity;
      const newAvgPrice = ((existing.average_price * existing.quantity) + (currentPrice * quantity)) / totalShares;
      await pool.query(
        'UPDATE portfolio SET quantity = $1, average_price = $2 WHERE id = $3',
        [totalShares, newAvgPrice, existing.id]
      );
    } else {
      await pool.query(
        `INSERT INTO portfolio (user_id, stock_symbol, quantity, average_price)
         VALUES ($1, $2, $3, $4)`,
        [userId, symbol.toUpperCase(), quantity, currentPrice]
      );
    }

    return res.json({ message: 'Stock purchased successfully' });
  } catch (error) {
    console.error('Error buying stock:', error);
    return res.status(500).json({ message: 'Error buying stock' });
  }
};

exports.sellStock = async (req, res) => {
  const userId = req.userId;
  const { symbol, quantity } = req.body;

  if (!symbol || !quantity) {
    return res.status(400).json({ message: 'Symbol and quantity are required' });
  }

  try {
    const priceResponse = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${process.env.FINNHUB_API_KEY}`
    );
    const currentPrice = priceResponse.data.c;

    if (!currentPrice || currentPrice === 0) {
      return res.status(400).json({ message: 'Invalid stock symbol' });
    }

    // Check if user owns the stock
    const portfolioResult = await pool.query(
      'SELECT * FROM portfolio WHERE user_id = $1 AND stock_symbol = $2',
      [userId, symbol.toUpperCase()]
    );
    if (portfolioResult.rowCount === 0) {
      return res.status(400).json({ message: 'You do not own any shares of this stock' });
    }

    const existing = portfolioResult.rows[0];
    if (existing.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient shares to sell' });
    }

    // Increase user's balance by the proceeds from selling
    const proceeds = currentPrice * quantity;
    const userResult = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
    const balance = parseFloat(userResult.rows[0].balance);
    const newBalance = balance + proceeds;
    await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, userId]);

    // Insert the transaction record for selling
    await pool.query(
      `INSERT INTO transactions (user_id, stock_symbol, transaction_type, price, quantity)
       VALUES ($1, $2, 'SELL', $3, $4)`,
      [userId, symbol.toUpperCase(), currentPrice, quantity]
    );

    // Update portfolio: subtract sold shares, or delete the record if none remain.
    const remainingShares = existing.quantity - quantity;
    if (remainingShares === 0) {
      await pool.query('DELETE FROM portfolio WHERE id = $1', [existing.id]);
    } else {
      await pool.query('UPDATE portfolio SET quantity = $1 WHERE id = $2', [remainingShares, existing.id]);
    }

    return res.json({ message: 'Stock sold successfully' });
  } catch (error) {
    console.error('Error selling stock:', error);
    return res.status(500).json({ message: 'Error selling stock' });
  }
};