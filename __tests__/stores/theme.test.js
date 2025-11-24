import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useThemeStore } from '@/stores/theme';

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

describe('useThemeStore', () => {
  let themeStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    // Limpar mocks e localStorage antes de cada teste
    vi.clearAllMocks();
    localStorage.clear();

    // Resetar o document.documentElement.className
    document.documentElement.className = '';

    // Resetar o mock de matchMedia
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false, // Padrão para light theme
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    // Para garantir que o novo mock de matchMedia seja usado, precisamos redefinir a store
    // Pinia pode manter instância, então forçamos nova store removendo do cache
    const pinia = createPinia();
    setActivePinia(pinia);
    themeStore = useThemeStore(pinia);
  });

  it('should initialize with light theme if no preference and no saved theme', () => {
    expect(themeStore.theme).toBe('light');
    expect(themeStore.isDarkMode).toBe(false);
  });

  it('should initialize with dark theme if user prefers dark and no saved theme', () => {
    // Mock matchMedia para preferir dark ANTES de criar a store
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true, // Usuário prefere dark
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    // Forçar nova instância da store para pegar o novo mock
    const pinia = createPinia();
    setActivePinia(pinia);
    themeStore = useThemeStore(pinia);

    expect(themeStore.theme).toBe('dark');
    expect(themeStore.isDarkMode).toBe(true);
  });

  it('should initialize with saved theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    // Forçar nova instância da store para pegar o valor atualizado do localStorage
    const pinia = createPinia();
    setActivePinia(pinia);
    themeStore = useThemeStore(pinia);

    expect(themeStore.theme).toBe('dark');
    expect(themeStore.isDarkMode).toBe(true);
  });

  it('applyTheme should set the correct class on document.documentElement', () => {
    themeStore.theme = 'dark';
    themeStore.applyTheme();
    expect(document.documentElement.className).toBe('dark-theme');

    themeStore.theme = 'light';
    themeStore.applyTheme();
    expect(document.documentElement.className).toBe('');
  });

  it('toggleTheme should switch theme and save to localStorage', () => {
    expect(themeStore.theme).toBe('light');
    themeStore.toggleTheme();
    expect(themeStore.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.className).toBe('dark-theme');

    themeStore.toggleTheme();
    expect(themeStore.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.className).toBe('');
  });

  it('initTheme should apply the current theme', () => {
    themeStore.theme = 'dark';
    themeStore.initTheme();
    expect(document.documentElement.className).toBe('dark-theme');
  });
});