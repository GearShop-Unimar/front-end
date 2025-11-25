import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/services/apiService";
import premiumService from "@/services/premiumService";

vi.mock("@/services/apiService", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    defaults: {
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:5282/api",
    },
  },
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5282/api",
}));

describe("premiumService", () => {
  const expectedRelativeBasePath = "/premiumaccount";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getDetails should fetch premium account details", async () => {
    const mockDetails = { status: "active", expiry: "2025-12-31" };
    api.get.mockResolvedValue({ data: mockDetails });

    const result = await premiumService.getStatus();

    expect(api.get).toHaveBeenCalledWith(`${expectedRelativeBasePath}/status`);
    expect(result).toEqual(mockDetails);
  });

  it("getStatus should fetch premium account status", async () => {
    const mockStatus = { isActive: true };
    api.get.mockResolvedValue({ data: mockStatus });

    const result = await premiumService.getStatus();

    expect(api.get).toHaveBeenCalledWith(`${expectedRelativeBasePath}/status`);
    expect(result).toEqual(mockStatus);
  });

  it("activate should activate premium account with duration", async () => {
    const durationDays = 30;
    const mockResponse = { message: "Account activated" };
    api.post.mockResolvedValue({ data: mockResponse });

    const result = await premiumService.activate(durationDays);

    expect(api.post).toHaveBeenCalledWith(
      `${expectedRelativeBasePath}/activate`,
      { durationDays }
    );
    expect(result).toEqual(mockResponse);
  });

  it("cancel should cancel premium account", async () => {
    const mockResponse = { message: "Account cancelled" };
    api.post.mockResolvedValue({ data: mockResponse });

    const result = await premiumService.cancel();

    expect(api.post).toHaveBeenCalledWith(`${expectedRelativeBasePath}/cancel`);
    expect(result).toEqual(mockResponse);
  });

  it("should handle errors in getDetails", async () => {
    const error = new Error("Failed to get status");
    api.get.mockRejectedValue(error);

    await expect(premiumService.getStatus()).rejects.toThrow(
      "Failed to get status"
    );
  });

  it("should handle errors in getStatus", async () => {
    const error = new Error("Failed to get status");
    api.get.mockRejectedValue(error);

    await expect(premiumService.getStatus()).rejects.toThrow(
      "Failed to get status"
    );
  });

  it("should handle errors in activate", async () => {
    const durationDays = 30;
    const error = new Error("Failed to activate");
    api.post.mockRejectedValue(error);

    await expect(premiumService.activate(durationDays)).rejects.toThrow(
      "Failed to activate"
    );
  });

  it("should handle errors in cancel", async () => {
    const error = new Error("Failed to cancel");
    api.post.mockRejectedValue(error);

    await expect(premiumService.cancel()).rejects.toThrow("Failed to cancel");
  });
});
