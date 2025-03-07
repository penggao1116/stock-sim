CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  balance DECIMAL(15,2) DEFAULT 10000
);

CREATE TABLE IF NOT EXISTS portfolio (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  stock_symbol VARCHAR(10) NOT NULL,
  quantity INT NOT NULL,
  average_price DECIMAL(15,2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  stock_symbol VARCHAR(10) NOT NULL,
  transaction_type VARCHAR(4) NOT NULL CHECK (transaction_type IN ('BUY','SELL')),
  price DECIMAL(15,2) NOT NULL,
  quantity INT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
