import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useProductStore = defineStore("product", () => {
  const products = ref({});
  const loading = ref(false);
  const error = ref(null);

  async function fetchProductById(productId) {
    if (products.value[productId]) {
      return products.value[productId];
    }

    try {
      const response = await axios.get(`${API_URL}/Product/${productId}`);
      const productData = response.data;
      products.value[productId] = productData;
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

      // CORREÇÃO PARA O ERRO 415: O Content-Type deve ser undefined.
      // Isso permite que o browser defina 'multipart/form-data' com o boundary correto.
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

  return {
    products,
    loading,
    error,
    fetchProductById,
    addProduct,
  };
});
