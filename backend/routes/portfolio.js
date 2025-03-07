const express = require('express');
const router = express.Router();
const { getPortfolio } = require('../controllers/portfolioController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/', authenticate, getPortfolio);

module.exports = router;
