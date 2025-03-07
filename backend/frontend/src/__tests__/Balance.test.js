import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Balance from '../pages/Balance';
import API from '../services/api';
import '@testing-library/jest-dom';

// Mock the entire API object, including defaults.headers, get, and put
jest.mock('../services/api', () => {
  const mockAPI = {
    defaults: {
      headers: {
        common: {}
      }
    },
    get: jest.fn(),
    put: jest.fn()
  };
  return mockAPI;
});

describe('Balance Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the current balance on mount', async () => {
    // Simulate initial GET request returning a balance of "10000"
    API.get.mockResolvedValueOnce({ data: { balance: '10000' } });

    render(<Balance token="fake-token" />);

    // Wait for the component to fetch and display the balance
    await waitFor(() => {
      // The text "$10000.00" should appear in the element with data-testid="balance-amount"
      const balanceElement = screen.getByTestId('balance-amount');
      expect(balanceElement).toHaveTextContent('$10000.00');
    });
  });

  it('updates the balance when adding funds', async () => {
    // 1) On mount, the GET returns balance of "10000"
    API.get.mockResolvedValueOnce({ data: { balance: '10000' } });
    // 2) The PUT call returns newBalance=10500
    API.put.mockResolvedValueOnce({ data: { newBalance: 10500 } });
    // 3) After updating, a second GET might happen if your code fetches balance again
    API.get.mockResolvedValueOnce({ data: { balance: '10500' } });

    render(<Balance token="fake-token" />);

    // Wait for initial balance
    await waitFor(() => {
      expect(screen.getByTestId('balance-amount')).toHaveTextContent('$10000.00');
    });

    // Enter 500 in the input
    fireEvent.change(screen.getByPlaceholderText(/Enter amount/i), {
      target: { value: '500' }
    });
    // Click "Add Funds"
    fireEvent.click(screen.getByText(/Add Funds/i));

    // The PUT call should have been invoked
    expect(API.put).toHaveBeenCalledWith('/users/balance', { amount: 500 });

    // Wait for updated balance
    await waitFor(() => {
      expect(screen.getByTestId('balance-amount')).toHaveTextContent('$10500.00');
    });
  });

  it('updates the balance when withdrawing funds', async () => {
    // 1) On mount, the GET returns balance of "10000"
    API.get.mockResolvedValueOnce({ data: { balance: '10000' } });
    // 2) The PUT call returns newBalance=9700
    API.put.mockResolvedValueOnce({ data: { newBalance: 9700 } });
    // 3) A second GET for the updated balance
    API.get.mockResolvedValueOnce({ data: { balance: '9700' } });

    render(<Balance token="fake-token" />);

    // Wait for initial balance
    await waitFor(() => {
      expect(screen.getByTestId('balance-amount')).toHaveTextContent('$10000.00');
    });

    // Enter 300 in the input
    fireEvent.change(screen.getByPlaceholderText(/Enter amount/i), {
      target: { value: '300' }
    });
    // Click "Withdraw Funds"
    fireEvent.click(screen.getByText(/Withdraw Funds/i));

    // Check the PUT call
    expect(API.put).toHaveBeenCalledWith('/users/balance', { amount: -300 });

    // Wait for updated balance
    await waitFor(() => {
      expect(screen.getByTestId('balance-amount')).toHaveTextContent('$9700.00');
    });
  });
});
