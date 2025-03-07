import React, { useEffect, useState } from 'react';
import API from '../services/api';

function LivePrices() {
  const [price, setPrice] = useState(null);
  const symbol = 'AAPL';

  const fetchPrice = async () => {
    try {
      const res = await API.get(`/stocks/search?symbol=${symbol}`);
      setPrice(res.data.c);
    } catch (error) {
      console.error('Error fetching live price:', error);
    }
  };

  useEffect(() => {
    // Fetch once immediately so the user sees a price right away
    fetchPrice();
    // Set up an interval to fetch updated data every 2 seconds
    const intervalId = setInterval(() => {
      fetchPrice();
    }, 2000);
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="card" style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <h4>Live Price for {symbol}</h4>
      {price !== null ? (
        <p>Current Price: ${price}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default LivePrices;
