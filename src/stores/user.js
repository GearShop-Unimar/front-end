import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios"; // Usando axios para chamadas HTTP

// Define a URL base da API
const API_URL = import.meta.env.VITE_API_URL;

// Cria e exporta o store Pinia para gerenciar dados de usuários
export const useUserStore = defineStore("user", () => {
  // --- Estado Reativo (State) ---

  // Objeto de cache para armazenar dados de usuários por ID (ex: {1: {...}, 2: {...}})
  const users = ref({});

  // --- Ações (Actions) ---

  // Função assíncrona para buscar um usuário pelo ID (com lógica de cache)
  async function fetchUserById(userId) {
    // 1. Verifica se o usuário já está no cache
    if (users.value[userId]) {
      return users.value[userId]; // Retorna o dado em cache
    }

    // 2. Busca o usuário do backend
    try {
      const response = await axios.get(`${API_URL}/User/${userId}`);
      const userData = response.data; // Dados recebidos da API

      users.value[userId] = userData; // Armazena os dados no cache
      return userData;
    } catch (error) {
      console.error(`Erro ao buscar usuário com ID ${userId}:`, error);
      return null; // Retorna nulo em caso de falha na busca
    }
  }

  // --- Exportação ---

  return {
    users, // Estado do cache de usuários
    fetchUserById, // Ação para buscar ou recuperar usuário do cache
  };
});
