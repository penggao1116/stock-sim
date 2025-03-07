const pool = require('../db');

exports.adjustBalance = async (req, res) => {
  const userId = req.userId;
  const { amount } = req.body; // e.g., { "amount": 500 } to add, or { "amount": -200 } to withdraw

  if (amount === undefined) {
    return res.status(400).json({ message: 'Missing amount in request body' });
  }

  try {
    // Get current balance
    const userResult = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentBalance = parseFloat(userResult.rows[0].balance);
    const newBalance = currentBalance + parseFloat(amount);

    // Optionally prevent negative balance:
    // if (newBalance < 0) {
    //   return res.status(400).json({ message: 'Insufficient funds' });
    // }

    // Update balance
    await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, userId]);
    return res.json({ message: 'Balance updated', newBalance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adjusting balance' });
  }
};
