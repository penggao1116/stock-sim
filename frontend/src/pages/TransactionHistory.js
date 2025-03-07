import React, { useEffect, useState } from 'react';
import API from '../services/api';

function TransactionHistory({ token }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    fetchHistory();
  }, [token]);

  const fetchHistory = async () => {
    try {
      const res = await API.get('/transactions/history');
      setTransactions(res.data.transactions);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="section-title">Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #ccc' }}>
              <th>Symbol</th>
              <th>Type</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Date/Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #ccc' }}>
                <td>{tx.stock_symbol}</td>
                <td>{tx.transaction_type}</td>
                <td>${tx.price}</td>
                <td>{tx.quantity}</td>
                <td>{new Date(tx.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TransactionHistory;
