<template>
  <div class="meus-produtos-container">
    <h1>Meus Produtos</h1>

    <div class="filtros">
      <select v-model="filtroCategoria" class="filtro-select">
        <option value="">Todas as Categorias</option>
        <option>Motor</option>
        <option>Suspensão</option>
        <option>Cambio</option>
        <option>Freios</option>
        <option>Elétrica</option>
        <option>Carroceria</option>
        <option>Rodas e Pneus</option>
      </select>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Carregando seus produtos...</p>
    </div>

    <div v-else-if="produtosFiltrados.length === 0" class="sem-produtos">
      <div class="icon-placeholder">📭</div>
      <h2>
        <span v-if="filtroCategoria">Nenhum produto encontrado</span>
        <span v-else>Você ainda não tem produtos cadastrados</span>
      </h2>
      <router-link
        to="/anunciar"
        class="btn btn-primary"
        v-if="!filtroCategoria"
      >
        Criar primeiro anúncio
      </router-link>
    </div>

    <div v-else>
      <div class="produtos-grid">
        <div
          v-for="produto in paginatedProducts"
          :key="produto.id"
          class="produto-card"
        >
          <div class="produto-imagem-container">
            <img
              v-if="produto.mainImageUrl"
              :src="produto.mainImageUrl"
              :alt="produto.name"
              class="produto-imagem"
            />
            <div v-else class="sem-imagem">
              <span>📷</span>
            </div>
          </div>

          <div class="produto-info">
            <h3>{{ produto.name }}</h3>
            <p class="categoria">{{ produto.category }}</p>
            <p class="preco">R$ {{ produto.price.toFixed(2) }}</p>
            <p class="estado">{{ produto.condition }}</p>

            <div class="acoes">
              <button
                @click="editarProduto(produto.id)"
                class="btn btn-secondary"
              >
                ✏️ Editar
              </button>
              <button
                @click="confirmarExclusao(produto.id)"
                class="btn btn-excluir"
              >
                🗑️ Excluir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="paginacao-container">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="btn paginacao-btn"
        >
          &lt; Anterior
        </button>
        <span class="pagina-info">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="btn paginacao-btn"
        >
          Próxima &gt;
        </button>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Confirmar exclusão</h3>
        <p>Tem certeza que deseja excluir este produto?</p>
        <div class="modal-botoes">
          <button @click="showModal = false" class="btn btn-cancelar">
            Cancelar
          </button>
          <button @click="excluirProduto" class="btn btn-excluir">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";

const API_URL = import.meta.env.VITE_API_URL;
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const produtos = ref([]);
const loading = ref(true);
const filtroCategoria = ref("");
const showModal = ref(false);
const produtoParaExcluir = ref(null);

const currentPage = ref(1);
const itemsPerPage = 9;

const carregarProdutos = async () => {
  const token = authStore.token;
  const userId = authStore.user?.id;

  if (!token || !userId) {
    toast.error("Você precisa estar logado para ver seus produtos.");
    router.push("/login");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/Product`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar produtos.");
    }

    const todosOsProdutos = await response.json();
    produtos.value = todosOsProdutos.filter((p) => p.sellerId === userId);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    toast.error(error.message || "Erro ao carregar produtos.");
  } finally {
    loading.value = false;
  }
};

const produtosFiltrados = computed(() => {
  if (!filtroCategoria.value) return produtos.value;
  return produtos.value.filter(
    (p) => p.category?.toLowerCase() === filtroCategoria.value.toLowerCase()
  );
});

const totalPages = computed(() => {
  return Math.ceil(produtosFiltrados.value.length / itemsPerPage);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return produtosFiltrados.value.slice(start, end);
});

watch(filtroCategoria, () => {
  currentPage.value = 1;
});

const editarProduto = (id) => {
  router.push(`/editar-produto/${id}`);
};

const confirmarExclusao = (id) => {
  produtoParaExcluir.value = id;
  showModal.value = true;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo(0, 0);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo(0, 0);
  }
};

const excluirProduto = async () => {
  const token = authStore.token;
  if (!token) {
    toast.error("Sua sessão expirou. Faça login novamente.");
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/Product/${produtoParaExcluir.value}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao excluir o produto.");
    }

    await carregarProdutos();

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }

    toast.success("Produto excluído com sucesso!");
    showModal.value = false;
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    toast.error(error.message || "Erro ao excluir produto.");
  }
};

onMounted(carregarProdutos);
</script>

<style scoped>
.meus-produtos-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 80px);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-heading);
  font-size: 2.4rem;
  font-weight: 700;
}

.filtros {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.filtro-select {
  padding: 12px 18px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  font-size: 1.5rem;
  background-color: var(--color-card-background);
  color: var(--color-text);
  font-family: "Rajdhani", sans-serif;
  transition: all 0.3s;
}

.filtro-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px hsla(24, 100%, 50%, 0.15);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-text);
}

.spinner {
  border: 5px solid var(--color-border);
  border-top: 5px solid var(--color-primary);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.sem-produtos {
  text-align: center;
  padding: 3rem;
  background-color: var(--color-card-background);
  border-radius: 10px;
  margin: 2rem 0;
  box-shadow: 0 4px 12px var(--color-card-shadow);
}

.sem-produtos h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.icon-placeholder {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

.produtos-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 600px) {
  .produtos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .produtos-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.produto-card {
  background: var(--color-card-background);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px var(--color-card-shadow);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.produto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px var(--color-card-shadow);
}

.produto-imagem-container {
  height: 200px;
  background-color: var(--color-background-mute);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.produto-imagem {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sem-imagem {
  font-size: 3rem;
  color: var(--color-text);
  opacity: 0.5;
}

.produto-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.produto-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.8rem;
  color: var(--color-heading);
  font-weight: 600;
}

.categoria {
  display: inline-block;
  background-color: var(--color-background-mute);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 1.2rem;
  margin: 0.5rem 0;
  color: var(--color-text);
  align-self: flex-start;
}

.preco {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primary);
  margin: 0.5rem 0;
}

.estado {
  color: var(--color-text);
  font-size: 1.4rem;
  margin: 0.5rem 0;
  opacity: 0.8;
}

.acoes {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  margin-top: auto;
}

.btn {
  width: 100%;
  border: 2px solid var(--color-primary);
  padding: 10px;
  font-size: 1.4rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}
.btn-primary:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

.btn-secondary {
  flex: 1;
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.btn-secondary:hover {
  background-color: var(--color-primary);
  color: white;
}

.btn-excluir {
  flex: 1;
  background-color: #f44336;
  color: white;
  border: 2px solid #f44336;
}
.btn-excluir:hover {
  background-color: #d32f2f;
  border-color: #d32f2f;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: var(--color-card-background);
  padding: 2.5rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal h3 {
  margin-top: 0;
  color: var(--color-heading);
  font-size: 2rem;
}

.modal p {
  color: var(--color-text);
  font-size: 1.6rem;
}

.modal-botoes {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.btn-cancelar {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  background-color: var(--color-background-mute);
  color: var(--color-text);
}
.btn-cancelar:hover {
  background-color: var(--color-border);
}

.paginacao-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.5rem;
  gap: 1rem;
}
.pagina-info {
  color: var(--color-text);
  font-weight: 600;
  font-size: 1.4rem;
  margin: 0 0.5rem;
}
.paginacao-btn {
  width: auto;
  flex: 0 1 140px;
  padding: 10px 14px;
  font-size: 1.3rem;
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.paginacao-btn:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: white;
}
.paginacao-btn:disabled {
  background-color: var(--color-border);
  border-color: var(--color-border);
  color: var(--color-text-light);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Ajustes de Responsividade */

@media (max-width: 768px) {
  .meus-produtos-container {
    padding: 30px 15px;
  }
  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  .filtro-select {
    padding: 10px 14px;
    font-size: 1.3rem;
  }
  .produto-imagem-container {
    height: 150px;
  }
  .produto-info {
    padding: 1rem;
  }
  .produto-info h3 {
    font-size: 1.6rem;
  }
  .preco {
    font-size: 1.8rem;
  }
  .categoria,
  .estado {
    font-size: 1.1rem;
  }
  .btn {
    font-size: 1.3rem;
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .meus-produtos-container {
    padding: 20px 10px;
  }
  .filtro-select {
    width: 100%;
    max-width: 300px;
  }
  .produto-imagem-container {
    height: 120px;
  }
  .produto-info h3 {
    font-size: 1.4rem;
  }
  .preco {
    font-size: 1.6rem;
  }
  .acoes {
    flex-direction: column;
    gap: 8px;
  }
  .paginacao-container {
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .paginacao-btn {
    flex-grow: 1;
    max-width: 45%;
    font-size: 1.1rem;
  }
  .pagina-info {
    font-size: 1.2rem;
    order: -1;
    width: 100%;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  .modal {
    padding: 1.5rem;
  }
  .modal h3 {
    font-size: 1.5rem;
  }
  .modal p {
    font-size: 1.3rem;
  }
  .modal-botoes {
    gap: 0.75rem;
  }
}
</style>
