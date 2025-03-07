import React, { useEffect, useState } from 'react';
import API from '../services/api';

function Balance({ token }) {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');

  // Fetch the current user’s balance from /auth/me
  const fetchBalance = async () => {
    try {
      const res = await API.get('/auth/me');
      // The backend might return the balance as a string, so parse it
      setBalance(parseFloat(res.data.balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // On mount or whenever the token changes, set the Authorization header and fetch balance
  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchBalance();
    }
  }, [token]);

  // Handle adding or withdrawing funds
  const handleAdjustBalance = async (delta) => {
    try {
      const res = await API.put('/users/balance', { amount: delta });
      alert(`Balance updated! New balance: $${parseFloat(res.data.newBalance).toFixed(2)}`);
      setAmount('');
      fetchBalance();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update balance');
    }
  };

  return (
    <div className="container">
      <h2 className="section-title">Account Balance</h2>
      <p>
        Your current balance is:{' '}
        <strong data-testid="balance-amount">${balance.toFixed(2)}</strong>
      </p>
      <div className="balance-form">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <button onClick={() => handleAdjustBalance(Number(amount))}>
            Add Funds
          </button>
          <button onClick={() => handleAdjustBalance(Number(amount) * -1)}>
            Withdraw Funds
          </button>
        </div>
      </div>
    </div>
  );
}

export default Balance;
