import React, { useEffect, useState } from 'react';
import API from '../services/api';
import LiveUpdatingChart from '../components/LiveUpdatingChart';

function MyStocks({ token }) {
  const [holdings, setHoldings] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [action, setAction] = useState('BUY');
  // Single selected stock for chart display
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    fetchPortfolio();
  }, [token]);

  const fetchPortfolio = async () => {
    try {
      const res = await API.get('/portfolio');
      setHoldings(res.data.holdings);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const handleTrade = async () => {
    if (!symbol || !quantity) {
      alert('Symbol and quantity are required');
      return;
    }
    try {
      if (action === 'BUY') {
        await API.post('/transactions/buy', { symbol, quantity: Number(quantity) });
      } else {
        await API.post('/transactions/sell', { symbol, quantity: Number(quantity) });
      }
      alert('Transaction successful');
      fetchPortfolio();
    } catch (error) {
      alert(error.response?.data?.message || 'Transaction failed');
    }
  };

  // When a holding is clicked, set that as the selected stock (replacing any previous)
  const handleSelectStock = (sym) => {
    setSelectedStock(sym);
  };

  const handleCloseChart = () => {
    setSelectedStock(null);
  };

  return (
    <div className="container">
      <h2 className="section-title">My Stocks</h2>
      <div className="my-stocks-form">
        <input
          type="text"
          placeholder="Symbol (e.g. AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
        <button onClick={handleTrade}>Submit Trade</button>
      </div>

      <h3>Your Holdings</h3>
      <div className="my-stocks-holdings">
        {holdings.length === 0 ? (
          <p>No stocks in your portfolio.</p>
        ) : (
          holdings.map((h) => (
            <div
              key={h.stock_symbol}
              className="card"
              onClick={() => handleSelectStock(h.stock_symbol)}
              style={{ cursor: 'pointer' }}
            >
              {h.stock_symbol}: {h.quantity} shares @ ${h.average_price}
            </div>
          ))
        )}
      </div>

      {selectedStock && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Live Prices for {selectedStock}</h3>
            <button onClick={handleCloseChart} style={{ padding: '0.5rem 1rem' }}>
              Close Chart
            </button>
          </div>
          <LiveUpdatingChart symbol={selectedStock} />
        </div>
      )}
    </div>
  );
}

export default MyStocks;
