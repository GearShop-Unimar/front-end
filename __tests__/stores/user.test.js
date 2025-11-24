import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '@/stores/user';
import axios from 'axios';

// Mock do axios
vi.mock('axios');

const API_URL = import.meta.env.VITE_API_URL;

describe('useUserStore', () => {
  let userStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    userStore = useUserStore();
    vi.clearAllMocks();
  });

  it('should initialize with an empty users object', () => {
    expect(userStore.users).toEqual({});
  });

  it('fetchUserById should fetch user data if not in store', async () => {
    const userId = 1;
    const mockUserData = { id: userId, name: 'Test User' };
    axios.get.mockResolvedValue({ data: mockUserData });

    const result = await userStore.fetchUserById(userId);

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/User/${userId}`);
    expect(userStore.users[userId]).toEqual(mockUserData);
    expect(result).toEqual(mockUserData);
  });

  it('fetchUserById should return user data from store if already fetched', async () => {
    const userId = 1;
    const existingUserData = { id: userId, name: 'Existing User' };
    userStore.users[userId] = existingUserData;

    const result = await userStore.fetchUserById(userId);

    expect(axios.get).not.toHaveBeenCalled(); // Não deve chamar a API novamente
    expect(result).toEqual(existingUserData);
  });

  it('fetchUserById should handle errors', async () => {
    const userId = 99;
    const error = new Error('Network Error');
    axios.get.mockRejectedValue(error);
    console.error = vi.fn(); // Mock console.error

    const result = await userStore.fetchUserById(userId);

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/User/${userId}`);
    expect(userStore.users[userId]).toBeUndefined(); // Usuário não deve ser adicionado
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      `Erro ao buscar usuário com ID ${userId}:`,
      error
    );
  });
});