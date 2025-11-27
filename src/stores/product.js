import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios"; // Usando axios para chamadas HTTP

// Define a URL base da API
const API_URL = import.meta.env.VITE_API_URL;

// Cria e exporta o store Pinia para o gerenciamento de produtos e avaliações
export const useProductStore = defineStore("product", () => {
  // --- Estado Reativo (State) ---
  const products = ref({}); // Objeto de cache para armazenar produtos por ID (ex: {1: {...}, 2: {...}})
  const loading = ref(false); // Indicador de que uma operação assíncrona está em andamento
  const error = ref(null); // Armazena mensagens de erro de operações
  // Estado para armazenar o termo de busca global digitado pelo usuário
  const termoBuscaGlobal = ref("");

  // --- Ações (Actions) ---

  // Define o termo de busca global, usado para comunicação entre componentes (Navbar -> Store -> TelaProdutos)
  function setTermoBusca(termo) {
    termoBuscaGlobal.value = termo;
  }

  // Busca um produto pelo ID (com lógica de cache) e busca suas avaliações
  async function fetchProductById(productId) {
    // 1. Já existe, mas sem reviews: busca reviews e retorna o produto em cache
    if (products.value[productId] && !products.value[productId].reviews) {
      await fetchReviewsForProduct(productId);
      return products.value[productId];
    }

    // 2. Já existe com reviews: retorna o produto em cache
    else if (products.value[productId]) {
      return products.value[productId];
    }

    // 3. Buscar produto do backend
    try {
      const response = await axios.get(`${API_URL}/Product/${productId}`);
      const productData = response.data;
      products.value[productId] = productData; // Adiciona ao cache

      await fetchReviewsForProduct(productId); // Busca e anexa as reviews

      return products.value[productId];
    } catch (err) {
      error.value = "Falha ao buscar produto: " + err.message;
      return null;
    }
  }

  // Adiciona um novo produto através de um formulário multipart
  async function addProduct(productPayload) {
    loading.value = true;
    error.value = null;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Usuário não autenticado. Faça login para continuar.");
      }

      const formData = new FormData();
      // Anexa todos os campos do produto, incluindo o arquivo de imagem
      if (productPayload.imageFile) {
        formData.append("ImageFile", productPayload.imageFile);
      }
      formData.append("Name", productPayload.name);
      formData.append("Description", productPayload.description);
      formData.append("Price", productPayload.price);
      formData.append("StockQuantity", productPayload.stockQuantity);
      formData.append("CompatibleModel", productPayload.compatibleModel);
      formData.append("Category", productPayload.category);

      // Envio POST com token e cabeçalho 'multipart/form-data' (Content-Type: undefined)
      const response = await axios.post(`${API_URL}/Product`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": undefined,
        },
      });

      const newProduct = response.data;
      products.value[newProduct.id] = newProduct; // Adiciona o novo produto ao cache

      return newProduct;
    } catch (err) {
      error.value = "Erro ao publicar produto.";

      // Lógica para extrair mensagens de erro específicas da API
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        error.value = "Sessão expirada. Faça login novamente.";
      }
      if (err.response && err.response.data && err.response.data.errors) {
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

  // Busca as avaliações de um produto na API e anexa ao objeto do produto em cache
  async function fetchReviewsForProduct(productId) {
    // Retorna reviews se já estiverem em cache
    if (products.value[productId]?.reviews) {
      return products.value[productId].reviews;
    }

    try {
      const response = await axios.get(
        `${API_URL}/review/product/${productId}`
      );
      const reviewsData = response.data;

      // Anexa os dados das avaliações ao produto no cache
      if (products.value[productId]) {
        products.value[productId].reviews = reviewsData;
      }

      return reviewsData;
    } catch (err) {
      console.error("Falha ao buscar avaliações:", err.message);
      return null;
    }
  }

  // Adiciona uma nova avaliação a um produto
  async function addReview(reviewPayload) {
    loading.value = true;
    error.value = null;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado.");
      }

      // Envio POST para a API de avaliação
      const response = await axios.post(`${API_URL}/review`, reviewPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newReview = response.data;
      const productId = newReview.productId;

      // Adiciona a nova review ao topo da lista de reviews do produto em cache (se existir)
      if (products.value[productId]) {
        if (!products.value[productId].reviews) {
          products.value[productId].reviews = [];
        }
        products.value[productId].reviews.unshift(newReview);
      }

      return newReview;
    } catch (err) {
      error.value = "Erro ao publicar avaliação.";

      // Lógica para tratamento de erros de autenticação ou mensagens da API
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

  // --- Exportação ---

  return {
    products,
    loading,
    error,
    termoBuscaGlobal, // Estado de busca global
    setTermoBusca, // Ação para definir o termo de busca
    fetchProductById,
    addProduct,
    fetchReviewsForProduct,
    addReview,
  };
});
