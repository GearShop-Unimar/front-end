import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const apiURL = import.meta.env.VITE_API_URL;

if (!apiURL) {
  console.error(
    "Atenção: VITE_API_URL não foi encontrada no ficheiro .env. A API não vai funcionar."
  );
}

export const baseURL = apiURL;

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
