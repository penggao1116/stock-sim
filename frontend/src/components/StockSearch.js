import React, { useState } from 'react';
import API from '../services/api';

function StockSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setResult(null);
    if (!query) return;

    try {
      const res = await API.get(`/stocks/search?symbol=${query}`);
      setResult(res.data);
    } catch (error) {
      const msg = error.response?.data?.message || 'Error searching stock';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="section">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by symbol"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
      {result && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h4>Result for {result.symbol}</h4>
          <p>Current Price: ${result.c}</p>
          <p>Open: ${result.o}</p>
          <p>High: ${result.h}</p>
          <p>Low: ${result.l}</p>
          <p>Previous Close: ${result.pc}</p>
        </div>
      )}
    </div>
  );
}

export default StockSearch;
