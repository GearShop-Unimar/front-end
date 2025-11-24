import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useProductStore = defineStore("product", () => {
  // STATE
  const products = ref({});
  const loading = ref(false);
  const error = ref(null);
  // Novo estado para a busca global
  const termoBuscaGlobal = ref("");

  // ACTION: Definir busca (Navbar -> Store -> TelaProdutos)
  function setTermoBusca(termo) {
    termoBuscaGlobal.value = termo;
  }
  async function fetchProductById(productId) {
    // Já existe mas sem reviews: busca as reviews e retorna O PRODUTO
    if (products.value[productId] && !products.value[productId].reviews) {
      await fetchReviewsForProduct(productId);
      return products.value[productId]; // 🔥 necessário para o teste passar
    }

    // Já existe com reviews
    else if (products.value[productId]) {
      return products.value[productId];
    }

    // Buscar produto do backend
    try {
      const response = await axios.get(`${API_URL}/Product/${productId}`);
      const productData = response.data;
      products.value[productId] = productData;

      await fetchReviewsForProduct(productId);

      return products.value[productId];
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
      // ✅ CORREÇÃO: Adicionados StockQuantity e CompatibleModel
      formData.append("StockQuantity", productPayload.stockQuantity);
      formData.append("CompatibleModel", productPayload.compatibleModel);

      formData.append("Category", productPayload.category);

      const response = await axios.post(`${API_URL}/Product`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": undefined, // Deixar o navegador definir boundary
        },
      });

      const newProduct = response.data;
      products.value[newProduct.id] = newProduct;

      return newProduct;
    } catch (err) {
      error.value = "Erro ao publicar produto.";

      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        error.value = "Sessão expirada. Faça login novamente.";
      }

      if (err.response && err.response.data && err.response.data.errors) {
        // Tenta pegar o erro específico do backend (ex: "Nome é obrigatório")
        const firstError = Object.values(err.response.data.errors)[0];
        error.value = Array.isArray(firstError)
          ? firstError[0]
          : JSON.stringify(err.response.data.errors);
      }

      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchReviewsForProduct(productId) {
    if (products.value[productId]?.reviews) {
      return products.value[productId].reviews;
    }

    try {
      const response = await axios.get(
        `${API_URL}/review/product/${productId}`
      );
      const reviewsData = response.data;

      if (products.value[productId]) {
        products.value[productId].reviews = reviewsData;
      }

      return reviewsData;
    } catch (err) {
      console.error("Falha ao buscar avaliações:", err.message);
      return null;
    }
  }

  async function addReview(reviewPayload) {
    loading.value = true;
    error.value = null;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado.");
      }

      const response = await axios.post(`${API_URL}/review`, reviewPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newReview = response.data;
      const productId = newReview.productId;

      if (products.value[productId]) {
        if (!products.value[productId].reviews) {
          products.value[productId].reviews = [];
        }
        products.value[productId].reviews.unshift(newReview);
      }

      return newReview;
    } catch (err) {
      error.value = "Erro ao publicar avaliação.";

      if (err.response?.status === 401 || err.response?.status === 403) {
        error.value = "Acesso negado. Faça login novamente.";
      }
      if (err.response?.data?.message) {
        error.value = err.response.data.message;
      }

      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    products,
    loading,
    error,
    termoBuscaGlobal, // Exporta estado
    setTermoBusca, // Exporta action
    fetchProductById,
    addProduct,
    fetchReviewsForProduct,
    addReview,
  };
});
