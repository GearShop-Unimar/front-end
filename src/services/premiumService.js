import api, { baseURL } from "./apiService"; // Importa a instância configurada do Axios e a URL base

// --- Lógica de Definição do Caminho Base ---

// Função para determinar o caminho base correto para os endpoints Premium
/*
  Garante que o caminho seja sempre '/api/premiumaccount' ou '/premiumaccount',
  dependendo de como a baseURL está configurada no apiService.
*/
const computeBasePath = () => {
  const b = (baseURL ?? api.defaults.baseURL ?? "").replace(/\/+$/, "");
  if (!b) return "/api/premiumaccount";
  // Se a URL base já termina com '/api', evitamos duplicar
  if (b.toLowerCase().endsWith("/api")) return "/premiumaccount";
  return "/api/premiumaccount";
};

const basePath = computeBasePath(); // Define o caminho base a ser usado em todas as chamadas

// --- Métodos de Serviço de Conta Premium ---

export default {
  // Busca o status atual da conta premium do usuário
  async getStatus() {
    const res = await api.get(`${basePath}/status`);
    return res.data;
  },

  // Ativa a conta premium por um número especificado de dias
  async activate(durationDays) {
    const res = await api.post(`${basePath}/activate`, { durationDays });
    return res.data;
  },

  // Cancela a assinatura ou o status premium do usuário
  async cancel() {
    const res = await api.post(`${basePath}/cancel`);
    return res.data;
  },

  // Busca o histórico de pagamentos relacionados à conta premium
  async getPaymentHistory() {
    const res = await api.get(`${basePath}/payment-history`);
    return res.data;
  },
};
