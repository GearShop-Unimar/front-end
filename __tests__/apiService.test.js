import { vi, describe, it, expect, beforeEach } from "vitest";

let mockToken = "fake-token";

const mockAxiosInstance = {
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

vi.mock("@/stores/auth", () => ({
  useAuthStore: vi.fn(() => ({
    token: mockToken,
  })),
}));

vi.doMock("axios", () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
  },
}));

const EXPECTED_BASE_URL = "http://localhost:5282/api";

describe("apiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockToken = "fake-token";
  });

  async function importApiService() {
    vi.resetModules();
    return await import("@/services/apiService");
  }

  it("deve criar instância do axios com baseURL correta", async () => {
    const axiosMocked = (await import("axios")).default;

    await importApiService();

    expect(axiosMocked.create).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: EXPECTED_BASE_URL })
    );
  });

  it("deve registrar interceptors", async () => {
    await importApiService();
    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
  });

  it("deve adicionar Authorization quando token existir", async () => {
    await importApiService();
    const requestInterceptor =
      mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    const config = requestInterceptor({ headers: {} });
    expect(config.headers.Authorization).toBe("Bearer fake-token");
  });

  it("deve funcionar mesmo sem headers no config", async () => {
    mockToken = "zz123";
    await importApiService();
    const requestInterceptor =
      mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    const config = requestInterceptor({});
    expect(config.headers.Authorization).toBe("Bearer zz123");
  });

  it("deve repassar erros do response interceptor", async () => {
    await importApiService();
    const errorInterceptor =
      mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
    const err = new Error("API Error");
    await expect(errorInterceptor(err)).rejects.toThrow("API Error");
  });

  it("não deve adicionar Authorization quando token não existir", async () => {
    mockToken = undefined;
    await importApiService();
    const requestInterceptor =
      mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    const config = requestInterceptor({ headers: {} });
    expect(config.headers.Authorization).toBeUndefined();
  });
});
