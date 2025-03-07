import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Performance from '../pages/Performance';
import API from '../services/api';
import '@testing-library/jest-dom';

// Mock the entire API object, including defaults and get
jest.mock('../services/api', () => {
  const mockAPI = {
    defaults: {
      headers: { common: {} }
    },
    get: jest.fn()
  };
  return mockAPI;
});

describe('Performance Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows a message if no token is provided', () => {
    // Render with no token
    render(<Performance token="" />);
    expect(screen.getByText(/Please log in to view performance data/i)).toBeInTheDocument();
  });

  it('displays loading state initially, then shows performance data', async () => {
    // Mock the calls:
    // 1) /auth/me => returns balance
    API.get.mockResolvedValueOnce({ data: { balance: '9000' } });

    // 2) /portfolio => returns an array of holdings
    API.get.mockResolvedValueOnce({ data: { holdings: [
      { stock_symbol: 'AAPL', quantity: 10 },
      { stock_symbol: 'TSLA', quantity: 5 }
    ] } });

    API.get.mockResolvedValueOnce({ data: { c: 150, o: 145 } }); // AAPL
    API.get.mockResolvedValueOnce({ data: { c: 700, o: 680 } }); // TSLA

    // Render with a fake token
    render(<Performance token="fake-token" />);

    // Initially, we should see "Loading performance data..."
    expect(screen.getByText(/Loading performance data.../i)).toBeInTheDocument();

    // Wait for final render
    await waitFor(() => {
      // The loading text should be gone
      expect(screen.queryByText(/Loading performance data.../i)).not.toBeInTheDocument();
    });

    // Now check that we see overall and today's P/L
    // initialBalance is 10000 in Performance.js
    // currentBalance = 9000
    // AAPL => c=150, quantity=10 => value=1500
    // TSLA => c=700, quantity=5 => value=3500
    // portfolioValue= 1500+3500=5000
    // overallProfitLoss = (9000 + 5000) - 10000= 4000 => +$4000.00
    expect(screen.getByText(/\+\$4000\.00/i)).toBeInTheDocument();

    // today's profit => AAPL => (150-145)*10= +50
    // TSLA => (700-680)*5= +100
    // total => +150 => +$150.00
    expect(screen.getByText(/\+\$150\.00/i)).toBeInTheDocument();
  });
});
