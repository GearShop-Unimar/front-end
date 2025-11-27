import axios from "axios";
import { useAuthStore } from "@/stores/auth";

// Pega a URL base da API das variáveis de ambiente
export const baseURL = import.meta.env?.VITE_API_URL;

// Cria uma instância do Axios com a URL base configurada
const api = axios.create({
  baseURL,
});

// INTERCEPTOR DE REQUEST
/*
  Antes de enviar qualquer requisição, este interceptor adiciona 
  o token de autenticação (Bearer Token) ao cabeçalho "Authorization", 
  se o token existir no store de autenticação.
*/
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore?.token;

    if (token) {
      // Garante que headers sempre existe
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error) // Repassa erros de requisição
);

// INTERCEPTOR DE RESPONSE
/*
  Processa a resposta da API após a requisição.
  Pode ser usado para tratar erros globais (ex: 401 Unauthorized, 404 Not Found)
  ou para formatar dados de resposta, se necessário.
*/
api.interceptors.response.use(
  (response) => response, // Retorna a resposta com sucesso
  (error) => Promise.reject(error) // Repassa erros de resposta da API
);

export default api; // Exporta a instância configurada do Axios (api)
