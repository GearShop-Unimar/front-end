<template>
  <div class="carrinho-page">
    <div class="carrinho-container">
      <div class="lista-itens">
        <h2>Meu Carrinho</h2>
        <div v-if="carrinho.length === 0" class="carrinho-vazio">
          <p>Seu carrinho está vazio.</p>
          <router-link to="/produtos" class="btn-explorar"
            >Explorar Produtos</router-link
          >
        </div>
        <div v-else class="produtos-grid">
          <div v-for="(item, index) in carrinho" :key="index" class="item-card">
            <img :src="item.imagem" :alt="item.nome" class="item-imagem" />
            <div class="item-info">
              <span class="item-nome">{{ item.nome }}</span>
              <span class="item-preco">R$ {{ item.preco.toFixed(2) }}</span>
            </div>
            <button @click="removerItem(index)" class="btn-remover">×</button>
          </div>
        </div>
      </div>

      <aside class="resumo-carrinho">
        <h2>Resumo do Pedido</h2>
        <div class="detalhes-resumo">
          <div class="linha-resumo">
            <span>Subtotal ({{ carrinho.length }} itens)</span>
            <span>R$ {{ totalCarrinho.toFixed(2) }}</span>
          </div>
          <div class="linha-resumo">
            <span>Frete</span>
            <span>Grátis</span>
          </div>
          <div class="linha-total">
            <span>Total</span>
            <strong>R$ {{ totalCarrinho.toFixed(2) }}</strong>
          </div>
        </div>
        <router-link
          to="/pagamento"
          class="btn-finalizar"
          :class="{ disabled: carrinho.length === 0 }"
        >
          Ir para o Pagamento
        </router-link>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
const carrinho = ref([]);

const totalCarrinho = computed(() => {
  return carrinho.value.reduce((total, item) => total + item.preco, 0);
});

const removerItem = (index) => {
  carrinho.value.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho.value));
};

onMounted(() => {
  const carrinhoSalvo = localStorage.getItem("carrinho");
  if (carrinhoSalvo) {
    carrinho.value = JSON.parse(carrinhoSalvo);
  }
});
</script>

<style scoped>
.carrinho-page {
  padding: 60px 20px;
  background-color: var(--color-background-soft);
  min-height: 80vh;
}

.carrinho-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  align-items: flex-start;
}

.lista-itens,
.resumo-carrinho {
  background-color: var(--color-card-background);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 30px var(--color-card-shadow);
  border: 1px solid var(--color-border);
}

h2 {
  font-size: 1.8rem;
  color: var(--color-heading);
  margin-top: 0;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--color-border);
}

.carrinho-vazio {
  text-align: center;
  padding: 40px 0;
}

.carrinho-vazio p {
  font-size: 1.2rem;
  color: var(--color-text);
  margin-bottom: 20px;
}

.btn-explorar {
  display: inline-block;
  padding: 12px 25px;
  background-color: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-explorar:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

.produtos-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.item-card {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  position: relative;
}

.item-imagem {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 6px;
  margin-right: 20px;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.item-nome {
  font-weight: 600;
  color: var(--color-heading);
}

.item-preco {
  color: var(--color-text);
}

.btn-remover {
  background: none;
  border: none;
  color: var(--color-text);
  opacity: 0.6;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px 10px;
  position: absolute;
  top: 10px;
  right: 10px;
}

.btn-remover:hover {
  color: #ff4d4d;
}

.resumo-carrinho {
  position: sticky;
  top: 120px;
}

.detalhes-resumo {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
}

.linha-resumo,
.linha-total {
  display: flex;
  justify-content: space-between;
  color: var(--color-text);
}

.linha-total {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--color-border);
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-heading);
}

.btn-finalizar {
  display: block;
  width: 100%;
  padding: 16px;
  background-color: var(--color-primary);
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-finalizar:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px hsla(24, 100%, 50%, 0.3);
}

.btn-finalizar.disabled {
  pointer-events: none;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  opacity: 0.6;
}

@media (max-width: 992px) {
  .carrinho-container {
    grid-template-columns: 1fr;
  }
}
</style>
