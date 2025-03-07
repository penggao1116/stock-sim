import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Home from '../pages/Home';
import API from '../services/api';
import '@testing-library/jest-dom';

jest.mock('../services/api');

describe('Home Page', () => {
  const fakeTrending = [
    { symbol: 'AAPL', c: 150 },
    { symbol: 'TSLA', c: 700 },
  ];

  beforeEach(() => {
    API.get.mockImplementation((url) => {
      if (url === '/stocks/trending') {
        return Promise.resolve({ data: fakeTrending });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders trending stocks and allows clicking a stock to display live chart', async () => {
    render(<Home token="fake-token" />);
    // Wait for trending stocks to be rendered
    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument();
      expect(screen.getByText('TSLA')).toBeInTheDocument();
    });
    
    // Click on the AAPL stock card
    fireEvent.click(screen.getByText('AAPL'));
    
    // Expect to see the chart header for AAPL
    await waitFor(() => {
      expect(screen.getByText(/Live Prices for AAPL/i)).toBeInTheDocument();
    });
  });
});
