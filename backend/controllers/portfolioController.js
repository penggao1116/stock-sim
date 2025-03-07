const pool = require('../db');

exports.getPortfolio = async (req, res) => {
  const userId = req.userId;  // from authenticate middleware
  try {
    const result = await pool.query(
      'SELECT stock_symbol, quantity, average_price FROM portfolio WHERE user_id = $1',
      [userId]
    );
    return res.json({ holdings: result.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching portfolio' });
  }
};
