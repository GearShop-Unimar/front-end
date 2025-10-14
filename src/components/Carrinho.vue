<template>
  <div v-if="isOpen" class="carrinho-overlay" @click.self="fecharCarrinho">
    <div class="carrinho-modal">
      <header class="carrinho-header">
        <h2>
          <i class="fa fa-shopping-cart carrinho-icon"></i>
          Meu Carrinho
        </h2>
        <button @click="fecharCarrinho" class="close-btn">&times;</button>
      </header>

      <div v-if="itens.length === 0" class="carrinho-vazio">
        Seu carrinho está vazio.
      </div>
      <ul v-else class="carrinho-lista">
        <li v-for="item in itens" :key="item.id" class="carrinho-item">
          <span>{{ item.nome }}</span>
          <span>R$ {{ item.preco.toFixed(2) }}</span>
        </li>
      </ul>

      <footer v-if="itens.length > 0" class="carrinho-footer">
        <button class="checkout-btn">Finalizar Compra</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const fecharCarrinho = () => {
  emit("close");
};

const itens = ref([]);
</script>

<style scoped>
.carrinho-overlay {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1500;
  display: flex;
  justify-content: flex-end;
}

.carrinho-modal {
  width: 100%;
  max-width: 400px;
  background: #fff;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 100%;
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
}

.carrinho-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.carrinho-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #333;
  line-height: 1;
}

.carrinho-icon {
  color: #ff6600;
  margin-right: 10px;
  font-size: 1.5rem;
}
.carrinho-vazio {
  color: #888;
  font-size: 1.1rem;
  margin-top: 20px;
}
.carrinho-lista {
  list-style: none;
  padding: 0;
  margin-top: 20px;
  flex-grow: 1;
  overflow-y: auto;
}
.carrinho-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.carrinho-footer {
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  background-color: #ff6600;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background-color: #e55b00;
}
</style>
