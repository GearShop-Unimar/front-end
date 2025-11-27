<!-- Template principal do componente de carrinho -->
<template>
  <div
    v-if="cartStore.isOpen"
    class="cart-overlay"
    @click="cartStore.toggleCart"
  ></div>

  <div class="cart-sidebar" :class="{ open: cartStore.isOpen }">
    <div class="cart-header">
      <h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path
            d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
          ></path>
        </svg>
        Meu Carrinho
      </h2>
      <button @click="cartStore.toggleCart" class="close-btn">&times;</button>
    </div>

    <div class="cart-content">
      <div v-if="cartStore.loading" class="loading-msg">Carregando...</div>

      <div v-else-if="cartStore.items.length === 0" class="empty-msg">
        <p>Seu carrinho está vazio.</p>
        <button class="btn-explore" @click="cartStore.toggleCart">
          Explorar Produtos
        </button>
      </div>

      <div v-else class="cart-items">
        <div
          v-for="item in cartStore.items"
          :key="item.id"
          class="cart-item"
          @click="goToProduct(item.product?.id)"
        >
          <div class="item-info">
            <h4>{{ item.product?.name }}</h4>
            <p class="qtd-control">Qtd: {{ item.quantity }}</p>
          </div>
          <div class="item-actions">
            <span class="item-price">
              R$ {{ (item.product?.price * item.quantity).toFixed(2) }}
            </span>

            <button
              class="remove-btn"
              @click.stop="cartStore.removeItem(item.id)"
              aria-label="Remover item"
              title="Remover item"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="cart-footer" v-if="cartStore.items.length > 0">
      <button class="btn-clear-all" @click="confirmarLimpeza">
        Esvaziar Carrinho
      </button>

      <div class="total-row">
        <span>Total:</span>
        <span>R$ {{ cartStore.totalPrice.toFixed(2) }}</span>
      </div>

      <button class="checkout-btn" @click="irParaPagamento">
        Finalizar Compra
      </button>
    </div>
  </div>
</template>

<!-- Lógica do componente -->
<script setup>
// Importações
import { useCartStore } from "@/stores/cart";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const router = useRouter();

// Redireciona para a página de pagamento e fecha o carrinho
const irParaPagamento = () => {
  cartStore.toggleCart();
  router.push("/pagamento");
};

// Confirma e esvazia todos os itens do carrinho
const confirmarLimpeza = () => {
  if (confirm("Tem certeza que deseja esvaziar o carrinho?")) {
    cartStore.items.forEach((item) => cartStore.removeItem(item.id));
  }
};

// Navega para a página de detalhes do produto e fecha o carrinho
const goToProduct = (productId) => {
  if (!productId) return;
  cartStore.toggleCart();
  router.push(`/produto/${productId}`);
};
</script>

<!-- Estilos específicos do componente -->
<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

.cart-sidebar {
  position: fixed;
  top: 0;
  left: auto;
  right: -400px;
  width: 350px;
  height: 100%;
  background: var(--color-card-background, #1a1a1a);
  color: var(--color-text, #fff);
  z-index: 999;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.5);
}

.cart-sidebar.open {
  right: 0;
}

.cart-header {
  padding: 20px;
  border-bottom: 1px solid var(--color-border, #333);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-header h2 {
  font-size: 1.2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--color-border, #333);
  cursor: pointer; /* Adicionado para indicar que o item é clicável */
  transition: background-color 0.2s;
}

.cart-item:hover {
  background-color: var(--color-background-mute); /* Feedback visual */
}

.item-info h4 {
  margin: 0 0 5px 0;
  font-size: 1rem;
}
.item-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #888;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.item-price {
  display: block;
  font-weight: bold;
  color: var(--color-primary);
}

.remove-btn {
  background: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #e74c3c;
  color: #FFFFFF; /* Cor ajustada para melhor contraste */
}

.cart-footer {
  padding: 20px;
  border-top: 1px solid var(--color-border, #333);
  background: var(--color-background-mute, #222);
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.checkout-btn {
  width: 100%;
  background: var(--color-primary);
  color: #fff;
  border: none;
  padding: 15px;
  cursor: pointer;
  font-weight: bold;
  border-radius: 5px;
  font-size: 1rem;
}

.btn-clear-all {
  background: transparent;
  border: none;
  color: #888;
  text-decoration: underline;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 15px;
  width: 100%;
  text-align: right;
}
.btn-clear-all:hover {
  color: #e74c3c;
}

.btn-explore {
  margin-top: 10px;
  background: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.loading-msg,
.empty-msg {
  text-align: center;
  margin-top: 20px;
  opacity: 0.7;
}

@media (max-width: 480px) {
  .cart-sidebar {
    width: 100%;
    right: -100%;
  }
}
</style>
