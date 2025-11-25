import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export const baseURL = import.meta.env?.VITE_API_URL;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore?.token;

    if (token) {
      // garante que headers sempre existe
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// INTERCEPTOR DE RESPONSE
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
