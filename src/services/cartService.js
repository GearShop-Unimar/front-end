import axios from "axios";

// Define a URL base da API, usando a variável de ambiente ou um valor padrão (fallback)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5282/api";
// Define o endpoint específico para o serviço de Carrinho
const API_URL = `${BASE_URL}/cart`;

// Função utilitária para gerar os cabeçalhos de autenticação
/*
  Busca o token do localStorage e o formata no cabeçalho "Authorization" 
  como Bearer Token, essencial para rotas protegidas.
*/
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Objeto principal que contém todos os métodos para interagir com o carrinho
const cartService = {
  // Busca o conteúdo atual do carrinho do usuário na API
  getCart: () => {
    return axios.get(API_URL, getAuthHeaders());
  },

  // Adiciona um produto com uma quantidade específica ao carrinho
  addItem: (productId, quantity) => {
    const payload = {
      productId: productId,
      quantity: quantity,
    };
    return axios.post(`${API_URL}/add`, payload, getAuthHeaders());
  },

  // Remove um item específico (pelo seu ID no carrinho) do carrinho
  removeItem: (itemId) => {
    return axios.delete(`${API_URL}/item/${itemId}`, getAuthHeaders());
  },
};

export default cartService; // Exporta o serviço para ser usado em toda a aplicação
