import { defineStore } from "pinia";
import cartService from "../services/cartService"; // Importa o serviço de API para o carrinho

// Cria e exporta o store Pinia para o carrinho de compras
export const useCartStore = defineStore("cart", {
  // --- Estado Reativo (State) ---
  state: () => ({
    items: [], // Array contendo os itens atuais no carrinho
    loading: false, // Indicador de que uma operação assíncrona está em andamento
    isOpen: false, // Estado que controla se o carrinho está visível ou oculto (UI)
  }),

  // --- Propriedades Calculadas (Getters) ---
  getters: {
    // Calcula o número total de itens no carrinho
    itemsCount: (state) => state.items.reduce((c, i) => c + i.quantity, 0),

    // Calcula o preço total de todos os itens no carrinho
    totalPrice: (state) =>
      state.items.reduce((t, i) => t + i.product.price * i.quantity, 0),
  },

  // --- Ações (Actions) ---
  actions: {
    // Alterna o estado de visibilidade do carrinho
    toggleCart() {
      this.isOpen = !this.isOpen;
    },

    // Busca o conteúdo atualizado do carrinho na API
    async fetchCart() {
      this.loading = true;
      try {
        const response = await cartService.getCart();
        this.items = response.data.items || []; // Atualiza o estado com os itens recebidos
      } catch (error) {
        console.error("Erro ao buscar carrinho", error);
      } finally {
        this.loading = false;
      }
    },

    // Adiciona um produto ao carrinho na API e atualiza o estado
    async addToCart(productId, quantity = 1) {
      this.loading = true;
      try {
        await cartService.addItem(productId, quantity); // Adiciona na API

        this.isOpen = true; // Abre o carrinho após adicionar o item

        await this.fetchCart(); // Recarrega o carrinho para refletir a mudança
      } catch (error) {
        console.error("Erro no Store ao adicionar:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Remove um item do carrinho na API e atualiza o estado local
    async removeItem(itemId) {
      try {
        await cartService.removeItem(itemId); // Remove na API
        // Filtra o item localmente para atualizar a UI rapidamente
        this.items = this.items.filter((i) => i.id !== itemId);
      } catch (error) {
        console.error("Erro ao remover:", error);
      }
    },

    // Remove todos os itens do carrinho um por um
    async clearCart() {
      try {
        // Itera sobre os itens e chama removeItem para cada um
        for (const item of [...this.items]) {
          // Usa spread para iterar sobre uma cópia segura
          await this.removeItem(item.id);
        }
      } catch (error) {
        console.error("Erro ao limpar o carrinho:", error);
      }
    },
  },
});
