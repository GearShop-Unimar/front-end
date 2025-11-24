import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth";

const routerMock = { push: vi.fn() };
const toastMock = { success: vi.fn(), error: vi.fn() };
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("vue-router", () => ({
  useRouter: vi.fn(() => routerMock),
}));

vi.mock("vue-toastification", () => ({
  useToast: vi.fn(() => toastMock),
}));

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5282/api";
const AUTH_API_URL = `${API_BASE_URL}/Auth/login`;

global.fetch = vi.fn();

describe("useAuthStore", () => {
  let authStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
    fetch.mockReset();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should initialize with no token and user", () => {
    authStore = useAuthStore();
    expect(authStore.token).toBeNull();
    expect(authStore.user).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
  });

  it("should set token and user from localStorage if available", () => {
    const mockUser = { id: 1, name: "Test User" };
    localStorage.setItem("token", "initial-token");
    localStorage.setItem("user", JSON.stringify(mockUser));

    authStore = useAuthStore();

    expect(authStore.token).toBe("initial-token");
    expect(authStore.user).toEqual(mockUser);
    expect(authStore.isAuthenticated).toBe(true);
  });

  describe("login", () => {
    const credentials = { email: "test@example.com", password: "password123" };
    const mockLoginResponse = {
      token: "new-fake-token",
      user: { id: 2, name: "Logged In User" },
    };

    beforeEach(() => {
      authStore = useAuthStore();
    });

    it("should successfully log in a user", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockLoginResponse),
      });

      await authStore.login(credentials);

      expect(fetch).toHaveBeenCalledWith(AUTH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      expect(authStore.token).toBe(mockLoginResponse.token);
      expect(authStore.user).toEqual(mockLoginResponse.user);
      expect(authStore.isAuthenticated).toBe(true);
      expect(localStorage.getItem("token")).toBe(mockLoginResponse.token);
      expect(localStorage.getItem("user")).toBe(
        JSON.stringify(mockLoginResponse.user)
      );
      expect(toastMock.success).toHaveBeenCalledWith(
        `Bem-vindo, ${mockLoginResponse.user.name}!`
      );
      expect(routerMock.push).toHaveBeenCalledWith("/");
    });

    it("should throw an error for failed authentication", async () => {
      localStorage.setItem("token", "token-to-be-removed");
      authStore.token = "token-to-be-removed";
      authStore.user = { id: "temp" };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: "Credenciais inválidas" }),
      });

      await expect(authStore.login(credentials)).rejects.toThrow(
        "Falha na autenticação"
      );

      expect(authStore.token).toBeNull();
      expect(authStore.isAuthenticated).toBe(false);
      expect(localStorage.getItem("token")).toBeNull();
    });

    it("should throw an error for invalid API response", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: { id: 2 } }),
      });

      await expect(authStore.login(credentials)).rejects.toThrow(
        "Resposta da API inválida."
      );
      expect(authStore.token).toBeNull();
      expect(authStore.isAuthenticated).toBe(false);
      expect(localStorage.getItem("token")).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    beforeEach(() => {
      authStore = useAuthStore();
      authStore.token = "some-token";
      authStore.user = { id: 1, name: "Test" };
      localStorage.setItem("token", "some-token");
      localStorage.setItem("user", JSON.stringify({ id: 1, name: "Test" }));
    });

    it("should clear token and user and redirect to login", () => {
      authStore.logout();

      expect(authStore.token).toBeNull();
      expect(authStore.user).toBeNull();
      expect(authStore.isAuthenticated).toBe(false);
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
      expect(routerMock.push).toHaveBeenCalledWith("/login");
    });
  });

  describe("updateUserProfile", () => {
    const userId = 1;
    const updatedData = { name: "Updated User", email: "updated@example.com" };

    beforeEach(() => {
      authStore = useAuthStore();
      authStore.token = "valid-token";
      authStore.user = { id: userId, name: "Old Name" };
      localStorage.setItem("token", "valid-token");
      localStorage.setItem("user", JSON.stringify(authStore.user));
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ...authStore.user, ...updatedData }),
      });
    });

    it("should update user profile successfully", async () => {
      await authStore.updateUserProfile(updatedData);

      expect(authStore.user.name).toBe("Updated User");
      expect(localStorage.getItem("user")).toContain("Updated User");
      expect(toastMock.success).toHaveBeenCalledWith(
        "Perfil atualizado com sucesso!"
      );
    });

    it("should throw an error if not authenticated", async () => {
      authStore.token = null;
      localStorage.removeItem("token");

      await expect(authStore.updateUserProfile(updatedData)).rejects.toThrow(
        "Não autenticado ou ID de usuário ausente"
      );
      expect(toastMock.error).toHaveBeenCalledWith(
        "Você não está autenticado ou seu ID não foi encontrado."
      );
      expect(fetch).not.toHaveBeenCalled();
    });

    it("should throw an error if API update fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: "Validation failed" }),
      });

      await expect(authStore.updateUserProfile(updatedData)).rejects.toThrow(
        "Validation failed"
      );
      expect(toastMock.error).toHaveBeenCalledWith("Validation failed");
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle API error without specific message", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      });

      await expect(authStore.updateUserProfile(updatedData)).rejects.toThrow(
        "Falha ao atualizar perfil"
      );
      expect(toastMock.error).toHaveBeenCalledWith("Falha ao atualizar perfil");
    });
  });
});
