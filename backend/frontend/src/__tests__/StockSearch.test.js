import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StockSearch from '../components/StockSearch';
import API from '../services/api';
import '@testing-library/jest-dom';

jest.mock('../services/api');

describe('StockSearch Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders input and button, and displays result on successful search', async () => {
    const fakeResponse = {
      data: { symbol: 'AAPL', c: 150, o: 148, h: 151, l: 147, pc: 149 }
    };
    API.get.mockResolvedValueOnce(fakeResponse);

    render(<StockSearch />);
    
    const input = screen.getByPlaceholderText(/search by symbol/i);
    const button = screen.getByText(/search/i);
    
    fireEvent.change(input, { target: { value: 'AAPL' } });
    fireEvent.click(button);
    
    // Wait for the result to appear
    await waitFor(() => {
      expect(screen.getByText(/Result for AAPL/i)).toBeInTheDocument();
      expect(screen.getByText(/Current Price: \$150/i)).toBeInTheDocument();
    });
  });

  it('displays error message on failed search', async () => {
    API.get.mockRejectedValueOnce({ response: { data: { message: 'Invalid stock symbol' } } });
    render(<StockSearch />);
    
    const input = screen.getByPlaceholderText(/search by symbol/i);
    const button = screen.getByText(/search/i);
    
    fireEvent.change(input, { target: { value: 'INVALID' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid stock symbol/i)).toBeInTheDocument();
    });
  });
});
