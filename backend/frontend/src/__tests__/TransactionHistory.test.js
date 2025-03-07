import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TransactionHistory from '../pages/TransactionHistory';
import API from '../services/api';
import '@testing-library/jest-dom';

// Mock the entire API object, including defaults.headers
jest.mock('../services/api', () => {
  const mockAPI = {
    defaults: {
      headers: {
        common: {}
      }
    },
    get: jest.fn(),
  };
  return mockAPI;
});

describe('TransactionHistory Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a "No transactions found" message when there are no transactions', async () => {
    API.get.mockResolvedValueOnce({ data: { transactions: [] } });
    render(<TransactionHistory token="fake-token" />);
    await waitFor(() => {
      expect(screen.getByText(/No transactions found/i)).toBeInTheDocument();
    });
  });

  it('renders transactions in a table when available', async () => {
    const fakeTransactions = [
      {
        stock_symbol: 'AAPL',
        transaction_type: 'BUY',
        price: 150,
        quantity: 10,
        timestamp: new Date().toISOString(),
      },
      {
        stock_symbol: 'TSLA',
        transaction_type: 'SELL',
        price: 700,
        quantity: 5,
        timestamp: new Date().toISOString(),
      },
    ];
    API.get.mockResolvedValueOnce({ data: { transactions: fakeTransactions } });
    render(<TransactionHistory token="fake-token" />);
    await waitFor(() => {
      expect(screen.getByText(/AAPL/i)).toBeInTheDocument();
      expect(screen.getByText(/BUY/i)).toBeInTheDocument();
      expect(screen.getByText(/TSLA/i)).toBeInTheDocument();
    });
  });
});
