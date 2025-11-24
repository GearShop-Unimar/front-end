import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import cartService from '@/services/cartService';

// Mock do axios
vi.mock('axios');

// Mock do localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('cartService', () => {
  const MOCK_TOKEN = 'fake-token-cart';
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5282/api';
  const API_URL = `${BASE_URL}/cart`;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', MOCK_TOKEN);
  });

  it('should fetch the cart with authorization headers', async () => {
    const mockCart = { items: [{ id: 1, quantity: 2 }] };
    axios.get.mockResolvedValue({ data: mockCart });

    const response = await cartService.getCart();

    expect(axios.get).toHaveBeenCalledWith(
      API_URL,
      {
        headers: {
          Authorization: `Bearer ${MOCK_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    expect(response.data).toEqual(mockCart);
  });

  it('should add an item to the cart with authorization headers', async () => {
    const productId = 1;
    const quantity = 1;
    const mockResponse = { message: 'Item added' };
    axios.post.mockResolvedValue({ data: mockResponse });

    const response = await cartService.addItem(productId, quantity);

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/add`,
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${MOCK_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    expect(response.data).toEqual(mockResponse);
  });

  it('should remove an item from the cart with authorization headers', async () => {
    const itemId = 1;
    const mockResponse = { message: 'Item removed' };
    axios.delete.mockResolvedValue({ data: mockResponse });

    const response = await cartService.removeItem(itemId);

    expect(axios.delete).toHaveBeenCalledWith(
      `${API_URL}/item/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${MOCK_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    expect(response.data).toEqual(mockResponse);
  });

  it('should handle errors when fetching the cart', async () => {
    const error = new Error('Network error');
    axios.get.mockRejectedValue(error);

    await expect(cartService.getCart()).rejects.toThrow('Network error');
  });

  it('should handle errors when adding an item to the cart', async () => {
    const productId = 1;
    const quantity = 1;
    const error = new Error('Add item error');
    axios.post.mockRejectedValue(error);

    await expect(cartService.addItem(productId, quantity)).rejects.toThrow('Add item error');
  });

  it('should handle errors when removing an item from the cart', async () => {
    const itemId = 1;
    const error = new Error('Remove item error');
    axios.delete.mockRejectedValue(error);

    await expect(cartService.removeItem(itemId)).rejects.toThrow('Remove item error');
  });
});