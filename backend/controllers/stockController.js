const axios = require('axios');

exports.getTrendingStocks = async (req, res) => {
  try {

    const popularSymbols = ['AAPL', 'TSLA', 'AMZN', 'MSFT', 'GOOGL'];
    const quotes = [];

    for (const symbol of popularSymbols) {
      const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`);
      quotes.push({ symbol, ...response.data });
    }

    return res.json(quotes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching trending stocks' });
  }
};

exports.searchStock = async (req, res) => {
  const { symbol } = req.query;
  try {
    if (!symbol) {
      return res.status(400).json({ message: 'Missing symbol query parameter' });
    }

    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${process.env.FINNHUB_API_KEY}`);
    const data = response.data;

    // If Finnhub returns 0 for 'c' (current price), it's often invalid or unknown
    if (!data || data.c === 0) {
      return res.status(400).json({ message: 'Invalid or unknown stock symbol' });
    }

    // Otherwise, return the data
    return res.json({ symbol: symbol.toUpperCase(), ...data });
  } catch (error) {
    console.error('Error searching stock:', error);
    return res.status(500).json({ message: 'Error fetching stock data' });
  }
};
