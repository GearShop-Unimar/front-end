<template>
  <div v-if="produto" class="pagina-produto">
    <div class="produto-container">
      <div class="imagem-container">
        <img
          v-if="produto.mainImageUrl"
          :src="produto.mainImageUrl"
          :alt="produto.name"
          class="imagem-principal"
        />
        <div v-else class="sem-imagem">
          <span>📷 Sem imagem</span>
        </div>
      </div>

      <div class="detalhes-produto">
        <span class="categoria-produto">{{ produto.category }}</span>
        <h1 class="titulo-produto">{{ produto.name }}</h1>
        <p class="preco-produto">R$ {{ produto.price.toFixed(2) }}</p>

        <div class="descricao-produto">
          <h3>Descrição</h3>
          <p>{{ produto.description }}</p>
        </div>

        <div class="vendedor-info-bloco">
          <h3>Vendedor</h3>
          <div class="vendedor-info">
            <i class="bi bi-person-circle"></i>
            <div>
              <p class="vendedor-nome">{{ vendedorName }}</p>
            </div>
          </div>
        </div>

        <div class="botoes-acao-container">
          <button @click="adicionarAoCarrinho" class="btn-carrinho">
            🛒 Adicionar ao Carrinho
          </button>
          <button @click="comprarAgora" class="btn-comprar">
            Comprar Agora
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="mostrarPopup" class="popup-overlay">
    <div class="popup-content">
      <p>✅ Produto adicionado ao carrinho!</p>
      <div class="modal-botoes">
        <button @click="continuarComprando" class="btn-continuar">
          Continuar comprando
        </button>
        <button @click="irParaCarrinho" class="btn-ir-carrinho">
          Ir para o Carrinho
        </button>
      </div>
    </div>
  </div>

  <div v-else-if="!produto" class="carregando">
    <p>Carregando produto...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const produto = ref(null);
const mostrarPopup = ref(false);
const API_URL = `${import.meta.env.VITE_API_URL}/Product`;

const carregarProduto = async () => {
  try {
    const produtoId = route.params.id;
    const response = await axios.get(`${API_URL}/${produtoId}`);
    produto.value = response.data;

    if (produto.value && produto.value.sellerId) {
      userStore.fetchUserById(produto.value.sellerId);
    }
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
    router.push("/produtos");
  }
};

const vendedorName = computed(() => {
  if (!produto.value?.sellerId) return "Vendedor desconhecido";
  const seller = userStore.users[produto.value.sellerId];
  return seller ? seller.name : "Carregando vendedor...";
});

const adicionarAoCarrinho = () => {
  mostrarPopup.value = true;
};

const comprarAgora = () => {
  router.push("/pagamento");
};

const continuarComprando = () => {
  mostrarPopup.value = false;
};

const irParaCarrinho = () => {
  mostrarPopup.value = false;
  router.push("/carrinho");
};

onMounted(carregarProduto);
</script>

<style scoped>
.pagina-produto {
  padding: 60px 20px;
  background-color: var(--color-background-soft);
  min-height: 80vh;
}

.produto-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--color-card-background);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 30px var(--color-card-shadow);
}

.imagem-container {
  width: 100%;
  height: 500px;
  background-color: var(--color-background-mute);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.imagem-principal {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sem-imagem {
  color: var(--color-text);
  opacity: 0.7;
}

.detalhes-produto {
  display: flex;
  flex-direction: column;
}

.categoria-produto {
  background-color: var(--color-background-mute);
  color: var(--color-text);
  align-self: flex-start;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 15px;
}

.titulo-produto {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 10px 0;
}

.preco-produto {
  font-size: 2rem;
  color: var(--color-primary);
  font-weight: bold;
  margin-bottom: 20px;
}

.descricao-produto {
  margin-top: 20px;
  margin-bottom: 20px;
}

.descricao-produto h3 {
  font-size: 1.2rem;
  color: var(--color-heading);
  margin-bottom: 10px;
}

.descricao-produto p {
  color: var(--color-text);
  line-height: 1.7;
}

.vendedor-info-bloco {
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
}

.vendedor-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.vendedor-info i {
  font-size: 2.2rem;
  color: var(--color-primary);
}

.vendedor-nome {
  font-weight: bold;
  color: var(--color-heading);
}

.botoes-acao-container {
  display: flex;
  gap: 15px;
  margin-top: auto;
}

.btn-comprar,
.btn-carrinho {
  width: 100%;
  border: 2px solid var(--color-primary);
  padding: 18px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-comprar {
  background-color: var(--color-primary);
  color: white;
}
.btn-comprar:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px hsla(24, 100%, 50%, 0.3);
}

.btn-carrinho {
  background-color: transparent;
  color: var(--color-primary);
}
.btn-carrinho:hover {
  background-color: var(--color-primary);
  color: white;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: var(--color-card-background);
  color: var(--color-heading);
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.popup-content p {
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: bold;
}

.modal-botoes {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-continuar,
.btn-ir-carrinho {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}

.btn-continuar {
  background-color: var(--color-background-mute);
  color: var(--color-text);
}

.btn-continuar:hover {
  background-color: var(--color-border);
}

.btn-ir-carrinho {
  background-color: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.btn-ir-carrinho:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.carregando {
  text-align: center;
  padding: 100px;
  font-size: 1.5rem;
  color: var(--color-text);
}

@media (max-width: 992px) {
  .produto-container {
    grid-template-columns: 1fr;
  }
  .imagem-container {
    height: 350px;
  }
}
</style>
