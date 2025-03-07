import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyStocks from './pages/MyStocks';
import TransactionHistory from './pages/TransactionHistory';
import Balance from './pages/Balance';
import Performance from './pages/Performance';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="navbar">
        <Link to="/">Home</Link>
        {!token && <Link to="/login">Login</Link>}
        {!token && <Link to="/signup">Signup</Link>}
        {token && <Link to="/my-stocks">My Stocks</Link>}
        {token && <Link to="/transactions">History</Link>}
        {token && <Link to="/balance">Balance</Link>}
        {token && <Link to="/performance">Performance</Link>}
        <div className="spacer"></div>
        {token && <button onClick={handleLogout}>Logout</button>}
      </div>
      <Routes>
        <Route path="/" element={<Home token={token} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-stocks" element={<MyStocks token={token} />} />
        <Route path="/transactions" element={<TransactionHistory token={token} />} />
        <Route path="/balance" element={<Balance token={token} />} />
        <Route path="/performance" element={<Performance token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;
