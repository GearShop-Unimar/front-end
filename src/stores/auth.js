import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification"; // Importa o serviço de notificações (toasts)

// Define a URL base da API
const API_BASE_URL = import.meta.env.VITE_API_URL;
// Define o endpoint específico para o login
const AUTH_API_URL = `${API_BASE_URL}/Auth/login`;

// Cria e exporta o store Pinia
export const useAuthStore = defineStore("auth", () => {
  // --- Estado Reativo (State) ---

  // Token de autenticação, inicializado a partir do localStorage
  const token = ref(localStorage.getItem("token"));
  // Objeto do usuário, inicializado a partir do localStorage
  const user = ref(JSON.parse(localStorage.getItem("user")));

  // Instância do roteador para navegação programática
  const router = useRouter();
  // Instância do serviço de notificação para exibir mensagens
  const toast = useToast();

  // --- Propriedades Calculadas (Getters) ---

  // Verifica se o usuário está autenticado (se existe um token)
  const isAuthenticated = computed(() => !!token.value);

  // --- Ações (Actions) ---

  // Envia credenciais para a API, recebe e armazena token e dados do usuário
  async function login(credentials) {
    try {
      // Faz a requisição POST para a API de login
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

      // Armazena o token no estado e no localStorage
      token.value = data.token;
      localStorage.setItem("token", data.token);

      // Armazena os dados do usuário no estado e no localStorage
      const userData = data.user;
      user.value = userData;
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success(`Bem-vindo, ${userData.name}!`); // Exibe notificação de sucesso
      router.push("/"); // Redireciona o usuário para a página inicial
    } catch (error) {
      console.error("Erro no login:", error);
      // Limpa o estado e o localStorage em caso de falha
      token.value = null;
      user.value = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error;
    }
  }

  // Limpa o estado de autenticação e redireciona para a tela de login
  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  // Envia uma requisição PATCH para a API para atualizar os dados do perfil
  async function updateUserProfile(updatedData) {
    const userId = user.value?.id;

    if (!token.value || !userId) {
      toast.error("Você não está autenticado ou seu ID não foi encontrado.");
      throw new Error("Não autenticado ou ID de usuário ausente");
    }

    try {
      // Faz a requisição PATCH para o endpoint do usuário
      const response = await fetch(`${API_BASE_URL}/User/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`, // Envia o token de autenticação
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        // Tenta extrair mensagem de erro do corpo da resposta
        let errorMsg = "Falha ao atualizar perfil";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          console.error(e);
        }
        throw new Error(errorMsg);
      }

      const updatedUser = await response.json();

      // Atualiza o estado e o localStorage com os novos dados do usuário
      user.value = updatedUser;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error(error.message);
      throw error;
    }
  }

  // Retorna o estado, getters e actions que serão públicos
  return { token, user, isAuthenticated, login, logout, updateUserProfile };
});
