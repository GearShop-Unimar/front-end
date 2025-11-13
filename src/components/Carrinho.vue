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
import { ref } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const fecharCarrinho = () => {
  emit("close");
};

const itens = ref([
  { id: 1, nome: "Placa de Vídeo GTX 3060", preco: 2500.5 },
  { id: 2, nome: "Memória RAM DDR4 16GB", preco: 450.0 },
  { id: 3, nome: "SSD NVMe 1TB", preco: 550.99 },
]);
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
  background: var(--color-background-soft);
  box-shadow: -4px 0 10px var(--color-card-shadow);
  padding: 20px;
  height: 100%;
  transform: translateX(0);
  transition: transform 0.4s ease-out;
  display: flex;
  flex-direction: column;
}

.carrinho-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.carrinho-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-heading);
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--color-text);
  line-height: 1;
  transition: color 0.3s;
}

.close-btn:hover {
  color: var(--color-primary);
}

.carrinho-icon {
  color: var(--color-primary);
  margin-right: 10px;
  font-size: 1.5rem;
}

.carrinho-vazio {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 1.1rem;
  margin-top: 20px;
  flex-grow: 1;
  text-align: center;
  padding-top: 50px;
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
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 1.1rem;
}

.carrinho-footer {
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-weight: bold;
}

.checkout-btn:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .carrinho-modal {
    width: 100%;
    max-width: none;
  }
}
</style>
