<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal">
      <h2>Seu Carrinho</h2>

      <div v-if="cartItems.length === 0">
        <p>Seu carrinho está vazio 🛒</p>
      </div>

      <div v-else>
        <ul class="cart-list">
          <li v-for="(item, index) in cartItems" :key="index">
            <strong>{{ item.nome }}</strong> — R$ {{ item.preco.toFixed(2) }}
          </li>
        </ul>
        <hr />
        <p><strong>Total:</strong> R$ {{ total.toFixed(2) }}</p>
        <button @click="checkout">Finalizar Compra</button>
      </div>

      <button class="close-btn" @click="close">Fechar</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  isOpen: Boolean,
  cartItems: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close"]);

const close = () => emit("close");

const total = computed(() =>
  props.cartItems.reduce((sum, item) => sum + item.preco, 0)
);

const checkout = () => {
  alert("Compra finalizada! 😄");
  emit("close");
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.cart-list {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.close-btn {
  margin-top: 15px;
  background: #ccc;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
}

button {
  background: #ff6600;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
}
</style>
