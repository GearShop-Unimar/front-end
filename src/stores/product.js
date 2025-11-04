import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useProductStore = defineStore("product", () => {
  const products = ref({});
  const loading = ref(false);
  const error = ref(null);

  async function fetchProductById(productId) {
    if (products.value[productId] && !products.value[productId].reviews) {
      fetchReviewsForProduct(productId);
    } else if (products.value[productId]) {
      return products.value[productId];
    }

    try {
      const response = await axios.get(`${API_URL}/Product/${productId}`);
      const productData = response.data;
      products.value[productId] = productData;

      await fetchReviewsForProduct(productId);

      return productData;
    } catch (err) {
      error.value = "Falha ao buscar produto: " + err.message;
      return null;
    }
  }

  async function addProduct(productPayload) {
    loading.value = true;
    error.value = null;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado. Faça login para continuar.");
      }

      const formData = new FormData();

      if (productPayload.imageFile) {
        formData.append("ImageFile", productPayload.imageFile);
      }

      formData.append("Name", productPayload.name);
      formData.append("Description", productPayload.description);
      formData.append("Price", productPayload.price);
      formData.append("StockQuantity", productPayload.stockQuantity);
      formData.append("Category", productPayload.category);

      const response = await axios.post(`${API_URL}/Product`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": undefined,
        },
      });

      const newProduct = response.data;
      products.value[newProduct.id] = newProduct;

      return newProduct;
    } catch (err) {
      error.value = "Erro ao publicar produto. Verifique sua autenticação.";

      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        error.value = "Acesso negado ou sessão expirada. Faça login novamente.";
      }

      if (err.response && err.response.data && err.response.data.errors) {
        error.value = JSON.stringify(err.response.data.errors);
      }

      throw err;
    } finally {
      loading.value = false;
    }
  }

  // NOVO: Função para buscar as avaliações de um produto
  async function fetchReviewsForProduct(productId) {
    // Evita buscar de novo se já tivermos as avaliações
    if (products.value[productId]?.reviews) {
      return products.value[productId].reviews;
    }

    try {
      // Usamos o endpoint que criámos no back-end
      const response = await axios.get(
        `${API_URL}/review/product/${productId}`
      );
      const reviewsData = response.data;

      // Armazena as avaliações dentro do objeto do produto
      if (products.value[productId]) {
        products.value[productId].reviews = reviewsData;
      }

      return reviewsData;
    } catch (err) {
      // Não define o 'error.value' principal para não bloquear a UI
      // se só as reviews falharem
      console.error("Falha ao buscar avaliações:", err.message);
      return null;
    }
  }

  // NOVO: Função para adicionar uma nova avaliação
  async function addReview(reviewPayload) {
    // reviewPayload deve ser: { productId, rating, comment }
    loading.value = true;
    error.value = null;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado.");
      }

      // Usamos o endpoint POST /api/review
      const response = await axios.post(`${API_URL}/review`, reviewPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newReview = response.data;
      const productId = newReview.productId;

      // Adiciona a nova avaliação no início da lista no estado da store
      if (products.value[productId]) {
        if (!products.value[productId].reviews) {
          products.value[productId].reviews = [];
        }
        // unshift() adiciona no início do array
        products.value[productId].reviews.unshift(newReview);
      }

      return newReview;
    } catch (err) {
      error.value = "Erro ao publicar avaliação.";

      if (err.response?.status === 401 || err.response?.status === 403) {
        error.value = "Acesso negado. Faça login novamente.";
      }
      // Captura o erro "Já avaliaste este produto."
      if (err.response?.data?.message) {
        error.value = err.response.data.message;
      }

      throw err; // Lança o erro para o componente poder tratar
    } finally {
      loading.value = false;
    }
  }

  return {
    products,
    loading,
    error,
    fetchProductById,
    addProduct,
    fetchReviewsForProduct,
    addReview,
  };
});
