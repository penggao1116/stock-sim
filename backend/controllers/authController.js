const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
      // Check if password is at least 6 characters
      if (!password || password.length < 6) {
          return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      // Check if user already exists
      const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userCheck.rowCount > 0) {
          return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Insert new user (balance defaults to 10000)
      const result = await pool.query(
          'INSERT INTO users (username, email, password_hash, balance) VALUES ($1, $2, $3, $4) RETURNING id, balance',
          [username, email, passwordHash, 10000]
      );

      return res.status(201).json({ message: 'User created', userId: result.rows[0].id, balance: result.rows[0].balance });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating user' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const user = userResult.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error logging in' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id, username, email, balance FROM users WHERE id = $1',
      [req.userId]
    );
    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];
    // Convert the DB string to a float
    user.balance = parseFloat(user.balance);

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching user info' });
  }
};
