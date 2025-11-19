import { defineStore } from "pinia";
import cartService from "../services/cartService";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [], // Lista de itens do backend
    loading: false,
    isOpen: false, // Controla se o modal está aberto ou fechado
  }),

  getters: {
    // Calcula o total automaticamente
    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        // Nota: O backend retorna item.product.price e item.quantity
        return total + item.product.price * item.quantity;
      }, 0);
    },
    // Quantidade total de itens (para o ícone do carrinho)
    itemsCount: (state) => {
      return state.items.reduce((count, item) => count + item.quantity, 0);
    },
  },

  actions: {
    toggleCart() {
      this.isOpen = !this.isOpen;
    },

    async fetchCart() {
      this.loading = true;
      try {
        const response = await cartService.getCart();
        // O backend retorna um objeto Cart que tem uma lista 'items'
        this.items = response.data.items || [];
      } catch (error) {
        console.error("Erro ao buscar carrinho:", error);
      } finally {
        this.loading = false;
      }
    },

    async addToCart(productId, quantity = 1) {
      try {
        await cartService.addItem(productId, quantity);
        // Depois de adicionar, recarregamos o carrinho para atualizar a lista
        await this.fetchCart();
        this.isOpen = true; // Abre o carrinho automaticamente ao comprar
      } catch (error) {
        console.error("Erro ao adicionar item:", error);
        alert("Erro ao adicionar ao carrinho.");
      }
    },

    async removeItem(itemId) {
      try {
        await cartService.removeItem(itemId);
        // Remove localmente para ser mais rápido ou recarrega tudo
        this.items = this.items.filter((i) => i.id !== itemId);
      } catch (error) {
        console.error("Erro ao remover item:", error);
      }
    },
  },
});
