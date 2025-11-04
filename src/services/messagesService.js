// Serviço de mensagens com MOCK, preparado para backend
// Endpoints sugeridos futuramente:
// - GET /messages/conversations
// - GET /messages/:conversationId
// - POST /messages/:conversationId (body: { text })

import api from "@/services/apiService";

// Usuários mock
const users = {
  1: { id: 1, name: "Você", avatar: "https://i.pravatar.cc/40?img=1" },
  2: { id: 2, name: "Vendedor Carlos", avatar: "https://i.pravatar.cc/40?img=12" },
  3: { id: 3, name: "Compradora Ana", avatar: "https://i.pravatar.cc/40?img=5" },
  4: { id: 4, name: "Loja TurboParts", avatar: "https://i.pravatar.cc/40?img=22" },
};

// Conversas mock
let conversations = [
  {
    id: "conv-1",
    participants: [1, 2],
    lastMessage: "Tenho a bomba de combustível pronta para envio!",
    lastTimestamp: Date.now() - 1000 * 60 * 5,
    unread: 1,
  },
  {
    id: "conv-2",
    participants: [1, 3],
    lastMessage: "Conseguiu ver as fotos das pastilhas?",
    lastTimestamp: Date.now() - 1000 * 60 * 45,
    unread: 0,
  },
  {
    id: "conv-3",
    participants: [1, 4],
    lastMessage: "Promoção em filtros até sexta!",
    lastTimestamp: Date.now() - 1000 * 60 * 60 * 4,
    unread: 0,
  },
];

// Mensagens mock por conversa
const conversationMessages = {
  "conv-1": [
    { id: "m1", senderId: 2, text: "Olá! Vi seu interesse na bomba.", timestamp: Date.now() - 1000 * 60 * 30 },
    { id: "m2", senderId: 1, text: "Qual o tempo de entrega para SP capital?", timestamp: Date.now() - 1000 * 60 * 20 },
    { id: "m3", senderId: 2, text: "1 a 3 dias úteis via expresso.", timestamp: Date.now() - 1000 * 60 * 10 },
  ],
  "conv-2": [
    { id: "m1", senderId: 3, text: "Enviei as fotos agora há pouco.", timestamp: Date.now() - 1000 * 60 * 50 },
  ],
  "conv-3": [
    { id: "m1", senderId: 4, text: "Temos combo de filtros com 15% off.", timestamp: Date.now() - 1000 * 60 * 240 },
  ],
};

export function getMockConversations(currentUserId = 1) {
  return conversations
    .filter((c) => c.participants.includes(currentUserId))
    .sort((a, b) => b.lastTimestamp - a.lastTimestamp)
    .map((c) => ({
      ...c,
      otherUser: users[c.participants.find((id) => id !== currentUserId)],
    }));
}

export function getMockMessages(conversationId) {
  return (conversationMessages[conversationId] || []).slice(-100);
}

export function sendMockMessage(conversationId, senderId, text) {
  const msg = {
    id: Math.random().toString(36).slice(2),
    senderId,
    text,
    timestamp: Date.now(),
  };
  if (!conversationMessages[conversationId]) conversationMessages[conversationId] = [];
  conversationMessages[conversationId].push(msg);

  // Atualiza resumo da conversa
  conversations = conversations.map((c) =>
    c.id === conversationId ? { ...c, lastMessage: text, lastTimestamp: msg.timestamp, unread: 0 } : c
  );
  return msg;
}

// Integração futura com backend
export async function fetchConversationsFromBackend() {
  // return (await api.get("/messages/conversations")).data;
  return getMockConversations();
}

export async function fetchMessagesFromBackend(conversationId) {
  // return (await api.get(`/messages/${conversationId}`)).data;
  return getMockMessages(conversationId);
}

export async function sendMessageToBackend(conversationId, text, senderId = 1) {
  // return (await api.post(`/messages/${conversationId}`, { text })).data;
  return sendMockMessage(conversationId, senderId, text);
}

export default {
  fetchConversationsFromBackend,
  fetchMessagesFromBackend,
  sendMessageToBackend,
};


