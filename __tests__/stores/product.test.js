import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useProductStore } from "@/stores/product";
import axios from "axios";

vi.mock("axios");

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

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5282/api";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

describe("useProductStore", () => {
  let productStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    productStore = useProductStore();
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should initialize with empty state", () => {
    expect(productStore.products).toEqual({});
    expect(productStore.loading).toBe(false);
    expect(productStore.error).toBeNull();
    expect(productStore.termoBuscaGlobal).toBe("");
  });

  it("setTermoBusca should update termoBuscaGlobal", () => {
    const searchTerm = "test search";
    productStore.setTermoBusca(searchTerm);
    expect(productStore.termoBuscaGlobal).toBe(searchTerm);
  });

  describe("fetchProductById", () => {
    const productId = 1;
    const mockProduct = { id: productId, name: "Product 1", price: 100 };
    const mockReviews = [{ id: 1, rating: 5, comment: "Great!" }];

    it("should fetch product and its reviews if not already in store", async () => {
      axios.get
        .mockResolvedValueOnce({ data: mockProduct })
        .mockResolvedValueOnce({ data: mockReviews });

      const result = await productStore.fetchProductById(productId);

      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/Product/${productId}`);
      expect(axios.get).toHaveBeenCalledWith(
        `${API_URL}/review/product/${productId}`
      );
      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(productStore.products[productId]).toEqual({
        ...mockProduct,
        reviews: mockReviews,
      });
      expect(result).toEqual({ ...mockProduct, reviews: mockReviews });
    });

    it("should return product from store if already fetched", async () => {
      productStore.products[productId] = {
        ...mockProduct,
        reviews: mockReviews,
      };

      const result = await productStore.fetchProductById(productId);

      expect(axios.get).not.toHaveBeenCalled();
      expect(result).toEqual({ ...mockProduct, reviews: mockReviews });
    });

    it("should only fetch reviews if product exists but reviews are missing", async () => {
      productStore.products[productId] = { ...mockProduct, reviews: undefined };

      // CORREÇÃO: Usamos mockImplementationOnce para retornar o mockReviews
      // APENAS para a URL de reviews, forçando o teste a passar se apenas uma chamada ocorrer.
      axios.get.mockImplementationOnce((url) => {
        if (url === `${API_URL}/review/product/${productId}`) {
          return Promise.resolve({ data: mockReviews });
        }
        // Se a store tentar buscar o produto (o que não deveria), isso gerará um erro no teste.
        return Promise.resolve({ data: {} });
      });

      const result = await productStore.fetchProductById(productId);

      // A store deve chamar axios.get APENAS UMA VEZ (para as reviews)
      expect(axios.get).toHaveBeenCalledWith(
        `${API_URL}/review/product/${productId}`
      );
      expect(axios.get).toHaveBeenCalledTimes(1); // AGORA DEVE PASSAR!
      expect(productStore.products[productId].reviews).toEqual(mockReviews);
      expect(result.reviews).toEqual(mockReviews);
    });

    it("should handle fetch product errors", async () => {
      const error = new Error("Network Error");
      axios.get.mockRejectedValue(error);

      const result = await productStore.fetchProductById(productId);

      expect(productStore.error).toBe("Falha ao buscar produto: Network Error");
      expect(result).toBeNull();
    });
  });

  describe("addProduct", () => {
    const productPayload = {
      name: "New Product",
      description: "Desc",
      price: 10,
      stockQuantity: 5,
      compatibleModel: "Model X",
      category: "Electronics",
      imageFile: new File(["dummy content"], "image.jpg", {
        type: "image/jpeg",
      }),
    };
    const mockNewProduct = { ...productPayload, id: 2, imageFile: undefined };

    beforeEach(() => {
      localStorage.setItem("token", "valid-token");
      axios.post.mockResolvedValue({ data: mockNewProduct });
    });

    it("should add a new product successfully", async () => {
      const result = await productStore.addProduct(productPayload);

      expect(productStore.loading).toBe(false);
      expect(productStore.products[mockNewProduct.id]).toEqual(mockNewProduct);
      expect(result).toEqual(mockNewProduct);
      expect(axios.post).toHaveBeenCalled();
      const formDataArg = axios.post.mock.calls[0][1];
      expect(formDataArg).toBeInstanceOf(FormData);
      expect(formDataArg.get("Name")).toBe(productPayload.name);
      expect(formDataArg.get("ImageFile")).toBe(productPayload.imageFile);
    });

    it("should throw error if not authenticated", async () => {
      localStorage.removeItem("token");

      await expect(productStore.addProduct(productPayload)).rejects.toThrow(
        "Usuário não autenticado. Faça login para continuar."
      );
      expect(productStore.loading).toBe(false);
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("should handle 401/403 errors correctly", async () => {
      axios.post.mockRejectedValue({ response: { status: 401 } });

      await expect(productStore.addProduct(productPayload)).rejects.toThrow();
      expect(productStore.error).toBe("Sessão expirada. Faça login novamente.");
    });

    it("should handle backend validation errors", async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 400,
          data: { errors: { Name: ["Name is required"] } },
        },
      });

      await expect(productStore.addProduct(productPayload)).rejects.toThrow();
      expect(productStore.error).toBe("Name is required");
    });

    it("should handle generic add product error", async () => {
      axios.post.mockRejectedValue(new Error("Something went wrong"));

      await expect(productStore.addProduct(productPayload)).rejects.toThrow();
      expect(productStore.error).toBe("Erro ao publicar produto.");
    });
  });

  describe("fetchReviewsForProduct", () => {
    const productId = 1;
    const mockReviews = [{ id: 1, rating: 5, comment: "Great!" }];

    it("should fetch reviews for a product", async () => {
      axios.get.mockResolvedValueOnce({ data: mockReviews });
      productStore.products[productId] = { id: productId };

      const result = await productStore.fetchReviewsForProduct(productId);

      expect(axios.get).toHaveBeenCalledWith(
        `${API_URL}/review/product/${productId}`
      );
      expect(productStore.products[productId].reviews).toEqual(mockReviews);
      expect(result).toEqual(mockReviews);
    });

    it("should return reviews from store if already fetched", async () => {
      productStore.products[productId] = {
        id: productId,
        reviews: mockReviews,
      };

      const result = await productStore.fetchReviewsForProduct(productId);

      expect(axios.get).not.toHaveBeenCalled();
      expect(result).toEqual(mockReviews);
    });

    it("should handle fetch reviews errors", async () => {
      axios.get.mockRejectedValue(new Error("Review Fetch Error"));
      productStore.products[productId] = { id: productId };

      const result = await productStore.fetchReviewsForProduct(productId);

      expect(productStore.products[productId].reviews).toBeUndefined();
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Falha ao buscar avaliações:",
        "Review Fetch Error"
      );
    });
  });

  describe("addReview", () => {
    const reviewPayload = { productId: 1, rating: 4, comment: "Good product." };
    const mockNewReview = { ...reviewPayload, id: 10, userId: 1 };

    beforeEach(() => {
      localStorage.setItem("token", "valid-token");
      axios.post.mockResolvedValue({ data: mockNewReview });
      productStore.products[reviewPayload.productId] = {
        id: reviewPayload.productId,
        reviews: [],
      };
    });

    it("should add a new review successfully", async () => {
      const result = await productStore.addReview(reviewPayload);

      expect(productStore.loading).toBe(false);
      expect(productStore.products[reviewPayload.productId].reviews).toEqual([
        mockNewReview,
      ]);
      expect(result).toEqual(mockNewReview);
      expect(axios.post).toHaveBeenCalledWith(
        `${API_URL}/review`,
        reviewPayload,
        { headers: { Authorization: `Bearer valid-token` } }
      );
    });

    it("should create reviews array if none exists", async () => {
      productStore.products[reviewPayload.productId] = {
        id: reviewPayload.productId,
      };

      const result = await productStore.addReview(reviewPayload);

      expect(productStore.products[reviewPayload.productId].reviews).toEqual([
        mockNewReview,
      ]);
      expect(result).toEqual(mockNewReview);
    });

    it("should throw error if not authenticated", async () => {
      localStorage.removeItem("token");

      await expect(productStore.addReview(reviewPayload)).rejects.toThrow(
        "Usuário não autenticado."
      );
      expect(productStore.loading).toBe(false);
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("should handle 401/403 errors correctly", async () => {
      axios.post.mockRejectedValue({ response: { status: 401 } });

      await expect(productStore.addReview(reviewPayload)).rejects.toThrow();
      expect(productStore.error).toBe("Acesso negado. Faça login novamente.");
    });

    it("should handle backend error messages", async () => {
      axios.post.mockRejectedValue({
        response: {
          status: 400,
          data: { message: "Review already exists" },
        },
      });

      await expect(productStore.addReview(reviewPayload)).rejects.toThrow();
      expect(productStore.error).toBe("Review already exists");
    });

    it("should handle generic add review error", async () => {
      axios.post.mockRejectedValue(new Error("Something went wrong"));

      await expect(productStore.addReview(reviewPayload)).rejects.toThrow();
      expect(productStore.error).toBe("Erro ao publicar avaliação.");
    });
  });
});
