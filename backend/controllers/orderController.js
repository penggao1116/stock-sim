const axios = require('axios');

let orders = [];
let portfolios = [];

exports.placeOrder = async (req, res) => {
  const { userId } = req;
  const { symbol, quantity, orderType } = req.body;
  
  if (!['BUY', 'SELL'].includes(orderType)) {
    return res.status(400).json({ message: 'Invalid order type' });
  }
  
  // Get current stock price using Finnhub
  const priceResponse = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`);
  const currentPrice = priceResponse.data.c;
  
  const totalCost = currentPrice * quantity;

  const order = { id: Date.now(), userId, symbol, quantity, orderType, price: currentPrice, totalCost, timestamp: new Date() };
  orders.push(order);
  
  let portfolio = portfolios.find(p => p.userId === userId);
  if (!portfolio) {
    portfolio = { userId, holdings: [] };
    portfolios.push(portfolio);
  }
  
  if (orderType === 'BUY') {
    const holding = portfolio.holdings.find(h => h.symbol === symbol);
    if (holding) {
      const newQuantity = holding.quantity + quantity;
      holding.avgPrice = ((holding.avgPrice * holding.quantity) + (currentPrice * quantity)) / newQuantity;
      holding.quantity = newQuantity;
    } else {
      portfolio.holdings.push({ symbol, quantity, avgPrice: currentPrice });
    }
  } else if (orderType === 'SELL') {
    const holding = portfolio.holdings.find(h => h.symbol === symbol);
    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient shares to sell' });
    }
    holding.quantity -= quantity;
    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol);
    }
  }
  
  // Emit a real-time update via WebSocket
  const io = req.app.get('socketio');
  io.emit('orderUpdate', order);
  
  res.json({ message: 'Order placed', order });
};
