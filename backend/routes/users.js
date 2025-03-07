const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { adjustBalance } = require('../controllers/userController');

router.put('/balance', authenticate, adjustBalance);

module.exports = router;
