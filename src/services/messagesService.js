import api from "@/services/apiService"; // Importa a instância configurada do Axios (apiService)

// Função assíncrona para buscar todas as conversas do usuário na API
export async function fetchConversationsFromBackend() {
  try {
    const response = await api.get("/messages");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    return []; // Retorna um array vazio em caso de erro
  }
}

// Função assíncrona para buscar as mensagens de uma conversa específica
export async function fetchMessagesFromBackend(conversationId) {
  try {
    const response = await api.get(`/messages/conversation/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return []; // Retorna um array vazio em caso de erro
  }
}

// Função assíncrona para enviar uma nova mensagem para uma conversa
export async function sendMessageToBackend(conversationId, text) {
  try {
    const body = { text };
    const response = await api.post(
      `/messages/conversation/${conversationId}`,
      body
    );
    return response.data; // Retorna a mensagem enviada (ou a resposta da API)
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return null; // Retorna nulo em caso de erro
  }
}

// Exporta todas as funções de serviço de mensagens/conversas
export default {
  fetchConversationsFromBackend,
  fetchMessagesFromBackend,
  sendMessageToBackend,
};
