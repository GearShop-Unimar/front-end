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

        <div class="avaliacao-input-container">
          <div v-if="minhaAvaliacaoExistente">
            <h3>Sua Avaliação</h3>
            <div class="estrelas-input">
              <span
                v-for="star in 5"
                :key="star"
                :class="{ preenchida: star <= minhaAvaliacaoExistente.rating }"
                class="estrela-input static"
              >
                &#9733;
              </span>
            </div>
          </div>
          <div v-else-if="isAuthenticated">
            <h3>Avalie este produto</h3>
            <div class="estrelas-input">
              <span
                v-for="star in 5"
                :key="star"
                :class="{
                  preenchida: star <= (hoverAvaliacao || minhaAvaliacao),
                  disabled: loadingSubmit,
                }"
                class="estrela-input"
                @mouseover="!loadingSubmit ? setHoverAvaliacao(star) : null"
                @mouseleave="!loadingSubmit ? resetHoverAvaliacao : null"
                @click="!loadingSubmit ? submeterAvaliacao(star) : null"
              >
                &#9733;
              </span>
            </div>
          </div>
          <div v-else>
            <p class="login-para-avaliar">
              <a @click="router.push('/login')">Faça login</a> para avaliar este
              produto.
            </p>
          </div>
        </div>

        <div class="descricao-produto">
          <h3>Descrição</h3>
          <p>{{ produto.description }}</p>
        </div>

        <div class="vendedor-info-bloco">
          <h3>Vendedor</h3>
          <div class="vendedor-info">
            <div class="vendedor-imagem-container">
              <img
                v-if="vendedorImageUrl"
                :src="vendedorImageUrl"
                alt="Foto do Vendedor"
                class="vendedor-imagem"
              />
              <i v-else class="bi bi-person-circle vendedor-icone-fallback"></i>
            </div>
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

    <div class="secao-avaliacoes">
      <h2>Avaliações de Clientes ({{ reviewCount }})</h2>
      <div v-if="reviews.length > 0" class="lista-avaliacoes">
        <div v-for="review in reviews" :key="review.id" class="avaliacao-item">
          <div class="avaliacao-header">
            <span class="avaliacao-autor">{{ review.author.name }}</span>
            <span class="avaliacao-data">{{
              formatarData(review.createdAt)
            }}</span>
          </div>
          <div class="avaliacao-estrelas-media">
            <span
              v-for="star in 5"
              :key="star"
              :class="{ 'estrela-preenchida': star <= review.rating }"
              class="estrela-media"
            >
              &#9733;
            </span>
          </div>
          <p v-if="review.comment" class="avaliacao-comentario">
            {{ review.comment }}
          </p>
        </div>
      </div>
      <div v-else class="sem-avaliacoes">
        <p>
          Este produto ainda não possui avaliações. Seja o primeiro a avaliar!
        </p>
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
import { useUserStore } from "@/stores/user";
import { useProductStore } from "@/stores/product";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const productStore = useProductStore();
const authStore = useAuthStore();
const toast = useToast();

const mostrarPopup = ref(false);
const loadingSubmit = ref(false);
const minhaAvaliacao = ref(0);
const hoverAvaliacao = ref(0);

const carregarProduto = async () => {
  try {
    const produtoId = route.params.id;
    const prod = await productStore.fetchProductById(produtoId);

    if (prod && prod.sellerId) {
      userStore.fetchUserById(prod.sellerId);
    }
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
    toast.error("Produto não encontrado.");
    router.push("/produtos");
  }
};

// --- Computeds ---
const produtoId = computed(() => route.params.id);
const produto = computed(() => productStore.products[produtoId.value]);
const reviews = computed(() => produto.value?.reviews ?? []);
const reviewCount = computed(() => reviews.value.length);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const minhaAvaliacaoExistente = computed(() => {
  if (!isAuthenticated.value || !reviews.value.length) {
    return null;
  }
  return reviews.value.find((r) => r.author.id === authStore.user?.id);
});

// Helper computed para o vendedor
const vendedor = computed(() => {
  if (!produto.value?.sellerId) return null;
  return userStore.users[produto.value.sellerId];
});

// Usa o helper 'vendedor'
const vendedorName = computed(() => {
  if (!vendedor.value) return "Vendedor desconhecido";
  return vendedor.value ? vendedor.value.name : "Carregando vendedor...";
});

// Computed para a imagem do vendedor
const vendedorImageUrl = computed(() => {
  if (
    !vendedor.value ||
    !vendedor.value.profilePictureData ||
    !vendedor.value.profilePictureMimeType
  ) {
    return null; // Sem imagem
  }
  // Constrói a Data URL a partir dos dados Base64
  return `data:${vendedor.value.profilePictureMimeType};base64,${vendedor.value.profilePictureData}`;
});

const adicionarAoCarrinho = () => {
  mostrarPopup.value = true;
};

// ... (resto dos métodos: comprarAgora, continuarComprando, irParaCarrinho, setHoverAvaliacao, resetHoverAvaliacao, submeterAvaliacao, formatarData) ...
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

const setHoverAvaliacao = (rating) => {
  hoverAvaliacao.value = rating;
};

const resetHoverAvaliacao = () => {
  hoverAvaliacao.value = 0;
};

const setMinhaAvaliacao = (rating) => {
  minhaAvaliacao.value = rating;
};

const submeterAvaliacao = async (rating) => {
  setMinhaAvaliacao(rating);
  if (loadingSubmit.value) return;
  loadingSubmit.value = true;

  try {
    const payload = {
      productId: parseInt(produtoId.value),
      rating: rating,
    };
    await productStore.addReview(payload);
    toast.success("Avaliação enviada com sucesso!");
  } catch (error) {
    toast.error(error.message || "Falha ao enviar avaliação.");
    setMinhaAvaliacao(0);
  } finally {
    loadingSubmit.value = false;
  }
};

const formatarData = (dateString) => {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("pt-BR", options);
};
// --- FIM dos outros métodos ---

onMounted(carregarProduto);
</script>

<style scoped>
.pagina-produto {
  padding: 60px 20px;
  background-color: var(--color-background-soft);
  min-height: 80vh;
}

/* ... (estilos .produto-container, .imagem-container, etc. continuam iguais) ... */
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
  margin-bottom: 10px;
}

/* --- ESTILOS ALTERADOS --- */

/* Secção de avaliação sem borda/fundo */
.avaliacao-input-container {
  padding-top: 10px;
  margin-bottom: 20px;
}
.avaliacao-input-container h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: var(--color-heading);
}

.estrelas-input {
  display: flex;
  margin-bottom: 15px;
}
.estrela-input {
  font-size: 2.2rem;
  color: var(--color-border);
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
}
.estrela-input:hover {
  transform: scale(1.2);
}
.estrela-input.preenchida {
  color: gold;
}
.estrela-input.static {
  cursor: default;
}
.estrela-input.static:hover {
  transform: none;
}
.estrela-input.disabled {
  color: var(--color-border-soft);
  cursor: not-allowed;
}
.estrela-input.disabled:hover {
  transform: none;
}

.login-para-avaliar {
  color: var(--color-text-light);
}
.login-para-avaliar a {
  color: var(--color-primary);
  text-decoration: underline;
  cursor: pointer;
}

/* ... (estilos .descricao-produto continuam iguais) ... */
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

/* Bloco do vendedor sem borda/fundo */
.vendedor-info-bloco {
  /* background-color: var(--color-background-soft); */ /* REMOVIDO */
  /* border: 1px solid var(--color-border); */ /* REMOVIDO */
  /* border-radius: 10px; */ /* REMOVIDO */
  /* padding: 15px; */ /* REMOVIDO */
  margin-bottom: 20px;
}

.vendedor-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* Estilos para a imagem do vendedor */
.vendedor-imagem-container {
  width: 40px;
  height: 40px;
  border-radius: 50%; /* Torna redondo */
  overflow: hidden;
  background-color: var(--color-background-mute); /* Fundo para o fallback */
  display: flex;
  align-items: center;
  justify-content: center;
  /* Adiciona uma borda fina se quiser */
  border: 2px solid var(--color-border);
}

.vendedor-imagem {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Garante que a imagem preencha o círculo */
}

.vendedor-icone-fallback {
  font-size: 2.2rem; /* Tamanho do ícone */
  color: var(--color-primary); /* Cor original do ícone */
  /* Ajusta o alinhamento do ícone se necessário */
  line-height: 1;
  margin-top: 2px;
}
/* FIM DOS ESTILOS NOVOS */

.vendedor-nome {
  font-size: 16px;
  font-weight: bold;
  color: var(--color-heading);
}

/* ... (resto dos estilos .botoes-acao-container) ... */
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

/* #############################################
  # INÍCIO - ESTILOS DA LISTA DE AVALIAÇÕES (RE-ADICIONADOS)
  #############################################
*/
.secao-avaliacoes {
  max-width: 1200px;
  margin: 40px auto 0 auto;
  background-color: var(--color-card-background);
  padding: 30px 40px;
  border-radius: 12px;
}
.secao-avaliacoes h2 {
  font-size: 1.8rem;
  color: var(--color-heading);
  margin-top: 0;
  margin-bottom: 25px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 15px;
}
.lista-avaliacoes {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.avaliacao-item {
  border-bottom: 1px solid var(--color-border-soft);
  padding-bottom: 20px;
}
.avaliacao-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.avaliacao-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.avaliacao-autor {
  font-weight: bold;
  color: var(--color-heading);
}
.avaliacao-data {
  font-size: 0.85rem;
  color: var(--color-text-light);
}
.avaliacao-estrelas-media {
  display: flex;
}
.estrela-media {
  color: var(--color-border);
  font-size: 1.1rem;
  margin-right: 2px;
}
.estrela-preenchida {
  color: gold;
}
.avaliacao-comentario {
  color: var(--color-text);
  line-height: 1.6;
  margin-top: 10px;
  white-space: pre-wrap;
}
.sem-avaliacoes {
  color: var(--color-text-light);
  text-align: center;
  padding: 20px;
}

/* #############################################
  # INÍCIO - ESTILOS DO POPUP (RE-ADICIONADOS)
  #############################################
*/
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
