import api from "@/services/apiService";

export async function fetchConversationsFromBackend() {
  try {
    const response = await api.get("/messages");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    return [];
  }
}

export async function fetchMessagesFromBackend(conversationId) {
  try {
    const response = await api.get(`/messages/conversation/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return [];
  }
}

export async function sendMessageToBackend(conversationId, text) {
  try {
    const body = { text };
    const response = await api.post(
      `/messages/conversation/${conversationId}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return null;
  }
}

export default {
  fetchConversationsFromBackend,
  fetchMessagesFromBackend,
  sendMessageToBackend,
};
