import React, { useEffect, useState } from 'react';
import API from '../services/api';

/**
 * Performance Page
 * 
 * Shows:
 * - Overall profit/loss = (current portfolio value + current balance) - initialBalance
 * - Today's profit/loss = sum over holdings of (currentPrice - openPrice) * quantity
 */
function Performance({ token }) {
  const initialBalance = 10000;

  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState({
    overallProfitLoss: 0,
    todayProfitLoss: 0,
  });

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    // Set the Authorization header for all subsequent requests
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchData();
  }, [token]);

  // Fetch user balance, portfolio holdings, and live stock data
  const fetchData = async () => {
    try {
      // 1) Fetch current user balance from /auth/me
      const resMe = await API.get('/auth/me');
      const currentBalance = parseFloat(resMe.data.balance);
      setBalance(currentBalance);

      // 2) Fetch portfolio holdings from /portfolio
      const resPortfolio = await API.get('/portfolio');
      const portfolio = resPortfolio.data.holdings || [];
      setHoldings(portfolio);

      // 3) For each holding, fetch live data (currentPrice `c` and openPrice `o`)
      const holdingPromises = portfolio.map(async (h) => {
        const resStock = await API.get(`/stocks/search?symbol=${h.stock_symbol}`);
        return {
          stock_symbol: h.stock_symbol,
          quantity: h.quantity,
          currentPrice: resStock.data.c,
          openPrice: resStock.data.o,
        };
      });

      const liveHoldings = await Promise.all(holdingPromises);

      // Calculate portfolio value + today's P/L
      let portfolioValue = 0;
      let todayProfitLoss = 0;
      liveHoldings.forEach((h) => {
        portfolioValue += h.currentPrice * h.quantity;
        todayProfitLoss += (h.currentPrice - h.openPrice) * h.quantity;
      });

      // overallProfitLoss = (portfolioValue + currentBalance) - initialBalance
      const overallProfitLoss = (portfolioValue + currentBalance) - initialBalance;

      setPerformance({
        overallProfitLoss,
        todayProfitLoss,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading performance data...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="container">
        <p>Please log in to view performance data.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="section-title">Performance</h2>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Overall Performance</h3>
        <p>
          Overall Profit/Loss:{' '}
          {performance.overallProfitLoss >= 0 ? (
            <span style={{ color: 'green' }}>
              +${performance.overallProfitLoss.toFixed(2)}
            </span>
          ) : (
            <span style={{ color: 'red' }}>
              -${Math.abs(performance.overallProfitLoss).toFixed(2)}
            </span>
          )}
        </p>
      </div>

      <div>
        <h3>Today's Performance</h3>
        <p>
          Profit/Loss Today:{' '}
          {performance.todayProfitLoss >= 0 ? (
            <span style={{ color: 'green' }}>
              +${performance.todayProfitLoss.toFixed(2)}
            </span>
          ) : (
            <span style={{ color: 'red' }}>
              -${Math.abs(performance.todayProfitLoss).toFixed(2)}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default Performance;
