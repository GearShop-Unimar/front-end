import { vi } from "vitest";

// Simula a função window.matchMedia, que não existe no jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Depreciado, mas bom ter
    removeListener: vi.fn(), // Depreciado, mas bom ter
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
