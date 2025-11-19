<template>
  <div
    v-if="cartStore.isOpen"
    class="carrinho-overlay"
    @click.self="cartStore.toggleCart"
  >
    <div class="carrinho-modal">
      <header class="carrinho-header">
        <h2>
          <i class="fa fa-shopping-cart carrinho-icon"></i>
          Meu Carrinho
        </h2>
        <button @click="cartStore.toggleCart" class="close-btn">&times;</button>
      </header>

      <div v-if="cartStore.loading" class="loading-msg">Carregando...</div>

      <div v-else-if="cartStore.items.length === 0" class="carrinho-vazio">
        Seu carrinho está vazio.
      </div>

      <ul v-else class="carrinho-lista">
        <li
          v-for="item in cartStore.items"
          :key="item.id"
          class="carrinho-item"
        >
          <div class="item-info">
            <span class="item-name">{{ item.product.name }}</span>
            <span class="item-qtd">Qtd: {{ item.quantity }}</span>
          </div>

          <div class="item-actions">
            <span class="item-price"
              >R$ {{ (item.product.price * item.quantity).toFixed(2) }}</span
            >
            <button @click="cartStore.removeItem(item.id)" class="remove-btn">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </li>
      </ul>

      <footer v-if="cartStore.items.length > 0" class="carrinho-footer">
        <div class="total-row">
          <span>Total:</span>
          <strong>R$ {{ cartStore.totalPrice.toFixed(2) }}</strong>
        </div>
        <button class="checkout-btn">Finalizar Compra</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useCartStore } from "../stores/cart"; // Importa a store criada

const cartStore = useCartStore();

// Quando o componente é montado, busca os dados do servidor
onMounted(() => {
  cartStore.fetchCart();
});
</script>

<style scoped>
/* ... Mantenha os seus estilos anteriores ... */

/* Adicionei alguns estilos para o layout novo */
.item-info {
  display: flex;
  flex-direction: column;
}
.item-name {
  font-weight: bold;
}
.item-qtd {
  font-size: 0.85rem;
  color: #888;
}
.item-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.remove-btn {
  background: transparent;
  border: none;
  color: #e74c3c;
  cursor: pointer;
}
.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  margin-bottom: 15px;
  padding: 0 10px;
}
.loading-msg {
  text-align: center;
  padding: 20px;
  color: var(--color-text);
}
</style>
