import api from "./apiService"; // Importa a instância configurada do Axios (apiService)

// Define o endpoint base da API para pedidos
const API_URL = "/orders";

// Objeto principal que contém os métodos de serviço para a gestão de pedidos
const orderService = {
  // Função assíncrona para buscar a lista de pedidos do usuário
  /*
    Faz uma requisição GET para o endpoint /orders.
    Retorna a lista de pedidos.
  */
  async getOrders() {
    try {
      const response = await api.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      throw error;
    }
  },

  // Função assíncrona para buscar um pedido específico por ID
  /*
    Faz uma requisição GET para /orders/{orderId}.
    Retorna os detalhes do pedido, incluindo itens.
  */
  async getOrderById(orderId) {
    try {
      const response = await api.get(`${API_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar pedido ${orderId}:`, error);
      throw error;
    }
  },

  // Função assíncrona para criar um novo pedido na API
  /*
    Recebe os dados do pedido (UserId, Items, PaymentType, Notes).
    Faz uma requisição POST para /orders com o corpo (body) no formato CreateOrderDto.
  */
  async createOrder(orderData) {
    try {
      const response = await api.post(API_URL, orderData);
      return response.data; // Retorna o pedido recém-criado
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      throw error;
    }
  },

  // Função assíncrona para atualizar um pedido existente (ex: status ou notas)
  /*
    Recebe o ID do pedido e um objeto com as alterações (UpdateOrderDto).
    Faz uma requisição PUT para /orders/{orderId}.
  */
  async updateOrder(orderId, updateData) {
    try {
      const response = await api.put(`${API_URL}/${orderId}`, updateData);
      return response.data; // Retorna o pedido atualizado
    } catch (error) {
      console.error(`Erro ao atualizar pedido ${orderId}:`, error);
      throw error;
    }
  },
};

export default orderService; // Exporta o serviço para uso na aplicação
