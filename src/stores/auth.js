import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const AUTH_API_URL = `${API_BASE_URL}/Auth/login`;

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token"));
  const user = ref(JSON.parse(localStorage.getItem("user")));
  const router = useRouter();
  const toast = useToast();

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials) {
    try {
      const response = await fetch(AUTH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Falha na autenticação");
      }

      const data = await response.json();

      if (!data.token || !data.user) {
        throw new Error("Resposta da API inválida.");
      }

      token.value = data.token;
      localStorage.setItem("token", data.token);

      const userData = data.user;
      user.value = userData;
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success(`Bem-vindo, ${userData.name}!`);
      router.push("/");
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return { token, user, isAuthenticated, login, logout };
});
