import React, { useEffect, useState } from 'react';
import API from '../services/api';

function HoldingCard({ holding }) {
  const [livePrice, setLivePrice] = useState(null);

  // Function to fetch live price for this holding's symbol
  const fetchLivePrice = async () => {
    try {
      const res = await API.get(`/stocks/search?symbol=${holding.stock_symbol}`);
      setLivePrice(res.data.c); // assuming 'c' is the current price
    } catch (error) {
      console.error(`Error fetching live price for ${holding.stock_symbol}:`, error);
    }
  };

  useEffect(() => {
    // Fetch initial live price
    fetchLivePrice();

    // Set up interval to update price every 2 seconds
    const intervalId = setInterval(fetchLivePrice, 2000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [holding.stock_symbol]);

  return (
    <div className="card">
      <strong>{holding.stock_symbol}</strong>
      <p>Shares: {holding.quantity}</p>
      <p>Avg. Buy Price: ${holding.average_price}</p>
      <p>
        Live Price:{" "}
        {livePrice !== null ? `$${livePrice}` : 'Loading...'}
      </p>
    </div>
  );
}

export default HoldingCard;
