import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCartStore } from '@/stores/cart';
import cartService from '@/services/cartService';

// Mock do cartService
vi.mock('@/services/cartService', () => ({
  default: {
    getCart: vi.fn(),
    addItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe('useCartStore', () => {
  let cartStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    cartStore = useCartStore();
    vi.clearAllMocks();
  });

  it('should initialize with an empty cart and closed status', () => {
    expect(cartStore.items).toEqual([]);
    expect(cartStore.loading).toBe(false);
    expect(cartStore.isOpen).toBe(false);
    expect(cartStore.itemsCount).toBe(0);
    expect(cartStore.totalPrice).toBe(0);
  });

  it('toggleCart should toggle the isOpen status', () => {
    expect(cartStore.isOpen).toBe(false);
    cartStore.toggleCart();
    expect(cartStore.isOpen).toBe(true);
    cartStore.toggleCart();
    expect(cartStore.isOpen).toBe(false);
  });

  it('fetchCart should populate the cart items', async () => {
    const mockCartItems = [
      { id: 1, productId: 101, quantity: 1, product: { price: 50 } },
      { id: 2, productId: 102, quantity: 2, product: { price: 25 } },
    ];
    cartService.getCart.mockResolvedValue({ data: { items: mockCartItems } });

    await cartStore.fetchCart();

    expect(cartStore.items).toEqual(mockCartItems);
    expect(cartStore.loading).toBe(false);
    expect(cartService.getCart).toHaveBeenCalled();
    expect(cartStore.itemsCount).toBe(3); // 1 + 2
    expect(cartStore.totalPrice).toBe(100); // 50*1 + 25*2
  });

  it('fetchCart should handle errors', async () => {
    const error = new Error('Failed to fetch cart');
    cartService.getCart.mockRejectedValue(error);
    console.error = vi.fn(); // Mock console.error

    await cartStore.fetchCart();

    expect(cartStore.items).toEqual([]);
    expect(cartStore.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Erro ao buscar carrinho', error);
  });

  it('addToCart should add an item and refetch the cart', async () => {
    const productId = 103;
    const quantity = 1;
    cartService.addItem.mockResolvedValue({ success: true });
    const mockFetchedCartItems = [
      { id: 1, productId: 101, quantity: 1, product: { price: 50 } },
      { id: 2, productId: 102, quantity: 2, product: { price: 25 } },
      { id: 3, productId: 103, quantity: 1, product: { price: 100 } },
    ];
    cartService.getCart.mockResolvedValue({ data: { items: mockFetchedCartItems } });

    await cartStore.addToCart(productId, quantity);

    expect(cartService.addItem).toHaveBeenCalledWith(productId, quantity);
    expect(cartStore.isOpen).toBe(true);
    expect(cartService.getCart).toHaveBeenCalledTimes(1); // Chamado dentro de addToCart
    expect(cartStore.items).toEqual(mockFetchedCartItems);
  });

  it('addToCart should handle errors', async () => {
    const productId = 104;
    const error = new Error('Failed to add item');
    cartService.addItem.mockRejectedValue(error);
    console.error = vi.fn();

    await expect(cartStore.addToCart(productId)).rejects.toThrow('Failed to add item');
    expect(cartStore.loading).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Erro no Store ao adicionar:', error);
  });

  it('removeItem should remove an item from the cart', async () => {
    const initialItems = [
      { id: 1, productId: 101, quantity: 1, product: { price: 50 } },
      { id: 2, productId: 102, quantity: 2, product: { price: 25 } },
    ];
    cartStore.items = initialItems;

    const itemIdToRemove = 1;
    cartService.removeItem.mockResolvedValue({ success: true });

    await cartStore.removeItem(itemIdToRemove);

    expect(cartService.removeItem).toHaveBeenCalledWith(itemIdToRemove);
    expect(cartStore.items).toEqual([
      { id: 2, productId: 102, quantity: 2, product: { price: 25 } },
    ]);
  });

  it('removeItem should handle errors', async () => {
    const initialItems = [
      { id: 1, productId: 101, quantity: 1, product: { price: 50 } },
    ];
    cartStore.items = initialItems;

    const itemIdToRemove = 1;
    const error = new Error('Failed to remove item');
    cartService.removeItem.mockRejectedValue(error);
    console.error = vi.fn();

    await cartStore.removeItem(itemIdToRemove);

    expect(cartService.removeItem).toHaveBeenCalledWith(itemIdToRemove);
    expect(cartStore.items).toEqual(initialItems); // Items should not change if error occurs
    expect(console.error).toHaveBeenCalledWith('Erro ao remover:', error);
  });
});