import React, { useEffect, useState } from 'react';
import API from '../services/api';
import StockSearch from '../components/StockSearch';
import LiveUpdatingChart from '../components/LiveUpdatingChart';

function Home({ token }) {
  const [trending, setTrending] = useState([]);
  // Single selected stock (chart replaces on new click)
  const [selectedStock, setSelectedStock] = useState(null);

  // Poll trending stocks every 5 seconds
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await API.get('/stocks/trending');
        setTrending(res.data);
      } catch (error) {
        console.error('Error fetching trending stocks:', error);
      }
    };
    fetchTrending();
    const intervalId = setInterval(fetchTrending, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // When a trending stock is clicked, set it as the selected stock (replacing the previous one)
  const handleSelectStock = (symbol) => {
    setSelectedStock(symbol);
  };

  // Option to close the chart
  const handleCloseChart = () => {
    setSelectedStock(null);
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="home-hero">
        <h1>Welcome to StockSim</h1>
        <p>Search for a stock symbol or check out what’s trending!</p>
        <div style={{ marginTop: '1rem' }}>
          <StockSearch />
        </div>
      </div>

      {/* Trending Stocks Section */}
      <h2 className="section-title">Trending Stocks</h2>
      <div className="trending-stocks">
        {trending.length > 0 ? (
          trending.map((stock, idx) => (
            <div
              key={idx}
              className="card"
              onClick={() => handleSelectStock(stock.symbol)}
              style={{ cursor: 'pointer' }}
            >
              <strong>{stock.symbol}</strong>
              <p>Current: ${stock.c}</p>
            </div>
          ))
        ) : (
          <p>No trending data available</p>
        )}
      </div>

      {/* Display the live updating chart for the selected stock */}
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

export default Home;
