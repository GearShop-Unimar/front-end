import { defineStore } from "pinia";
import cartService from "../services/cartService";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    loading: false,
    isOpen: false,
  }),

  getters: {
    itemsCount: (state) => state.items.reduce((c, i) => c + i.quantity, 0),
    totalPrice: (state) =>
      state.items.reduce((t, i) => t + i.product.price * i.quantity, 0),
  },

  actions: {
    toggleCart() {
      this.isOpen = !this.isOpen;
    },

    async fetchCart() {
      this.loading = true;
      try {
        const response = await cartService.getCart();
        this.items = response.data.items || [];
      } catch (error) {
        console.error("Erro ao buscar carrinho", error);
      } finally {
        this.loading = false;
      }
    },

    async addToCart(productId, quantity = 1) {
      this.loading = true;
      try {
        await cartService.addItem(productId, quantity);

        this.isOpen = true;

        await this.fetchCart();
      } catch (error) {
        console.error("Erro no Store ao adicionar:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeItem(itemId) {
      try {
        await cartService.removeItem(itemId);
        this.items = this.items.filter((i) => i.id !== itemId);
      } catch (error) {
        console.error("Erro ao remover:", error);
      }
    },

    async clearCart() {
      try {
        // Itera sobre uma cópia dos itens para evitar problemas de modificação durante a iteração
        for (const item of this.items) {
          await this.removeItem(item.id);
        }
      } catch (error) {
        console.error("Erro ao limpar o carrinho:", error);
      }
    },
  },
});
