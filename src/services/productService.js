import api from "./apiService"; // Importa a instância configurada do Axios (apiService)

// Define o endpoint base da API para produtos
const API_URL = "/Product";

// Objeto que agrupa todos os métodos de interação com a API de produtos
const productService = {
  // Função assíncrona para buscar todos os produtos disponíveis
  /*
    Faz uma requisição GET para /Product.
    Esta rota é de acesso público (AllowAnonymous no backend).
  */
  async getAllProducts() {
    try {
      const response = await api.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  },

  // Função assíncrona para buscar um produto específico pelo ID
  /*
    Faz uma requisição GET para /Product/{id}.
    Esta rota também é de acesso público (AllowAnonymous no backend).
  */
  async getProductById(productId) {
    try {
      const response = await api.get(`${API_URL}/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${productId}:`, error);
      throw error;
    }
  },

  // Função assíncrona para criar um novo produto com dados de formulário
  /*
    Requer autenticação. Recebe 'formData' (inclui arquivos).
    Usa 'multipart/form-data' no cabeçalho.
  */
  async createProduct(formData) {
    try {
      const response = await api.post(API_URL, formData, {
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

  // Função assíncrona para atualizar um produto existente
  /*
    Requer autenticação e verifica se o usuário é o vendedor (backend).
    Recebe 'formData' (que pode ter o novo arquivo de imagem).
  */
  async updateProduct(productId, formData) {
    try {
      const response = await api.put(`${API_URL}/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar produto ${productId}:`, error);
      throw error;
    }
  },

  // Função assíncrona para deletar um produto específico
  /*
    Requer autenticação e verifica se o usuário é o vendedor (backend).
    Faz uma requisição DELETE para /Product/{id}.
  */
  async deleteProduct(productId) {
    try {
      // DELETE retorna 204 NoContent em caso de sucesso
      await api.delete(`${API_URL}/${productId}`);
      return true;
    } catch (error) {
      console.error(`Erro ao deletar produto ${productId}:`, error);
      throw error;
    }
  },
};

export default productService; // Exporta o serviço para uso na aplicação
