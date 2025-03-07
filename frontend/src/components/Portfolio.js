import React, { useEffect, useState } from 'react';

function Portfolio({ token }) {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const response = await fetch('http://localhost:5000/api/portfolio', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPortfolio(data);
    };

    fetchPortfolio();
  }, [token]);

  if (!portfolio) return <p>Loading portfolio...</p>;

  return (
    <div>
      <h2>Your Portfolio</h2>
      {portfolio.holdings.length === 0 ? (
        <p>No holdings yet</p>
      ) : (
        <ul>
          {portfolio.holdings.map((holding, index) => (
            <li key={index}>
              {holding.symbol}: {holding.quantity} shares at average price ${holding.avgPrice.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Portfolio;
