import api from "./apiService";

const productService = {
  async getAllProducts() {
    try {
      const response = await api.get("/Product");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  },

  async createProduct(formData) {
    try {
      const response = await api.post("/Product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  },

  // Adicione outras funções de produto aqui, como getById, update, delete, etc.
};

export default productService;
