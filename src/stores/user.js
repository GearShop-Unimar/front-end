import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const useUserStore = defineStore("user", () => {
  const users = ref({});

  async function fetchUserById(userId) {
    if (users.value[userId]) {
      return users.value[userId];
    }

    try {
      const response = await axios.get(`${API_URL}/User/${userId}`);
      const userData = response.data;

      users.value[userId] = userData;
      return userData;
    } catch (error) {
      console.error(`Erro ao buscar usuário com ID ${userId}:`, error);
      return null;
    }
  }

  return {
    users,
    fetchUserById,
  };
});
