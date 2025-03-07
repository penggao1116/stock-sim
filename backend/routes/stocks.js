const express = require('express');
const router = express.Router();
const { getTrendingStocks, searchStock } = require('../controllers/stockController');

router.get('/trending', getTrendingStocks);
router.get('/search', searchStock);

module.exports = router;
