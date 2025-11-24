<template>
  <div class="pagina-produtos">
    <div class="layout-container">
      <aside class="sidebar">
        <h3 class="sidebar-titulo">Filtros</h3>

        <div class="filtro-grupo">
          <h4>Categoria</h4>
          <ul class="lista-categorias">
            <li
              :class="{ ativo: filtroCategoria === '' }"
              @click="filtroCategoria = ''"
              tabindex="0"
              @keydown.enter="filtroCategoria = ''"
              role="button"
              aria-label="Todas as categorias"
            >
              Todas
            </li>
            <li
              v-for="cat in categoriasDisponiveis"
              :key="cat"
              :class="{ ativo: filtroCategoria === cat }"
              @click="filtroCategoria = cat"
              tabindex="0"
              @keydown.enter="filtroCategoria = cat"
              role="button"
              :aria-label="'Filtrar por ' + cat"
            >
              {{ cat }}
            </li>
          </ul>
        </div>

        <div class="filtro-grupo">
          <h4>Preço</h4>
          <div class="filtro-preco-inputs">
            <input
              type="number"
              v-model.number="filtroPrecoMin"
              placeholder="Mín"
              aria-label="Preço mínimo"
            />
            <span>-</span>
            <input
              type="number"
              v-model.number="filtroPrecoMax"
              placeholder="Máx"
              aria-label="Preço máximo"
            />
          </div>
        </div>

        <div class="filtro-grupo">
          <h4>Avaliação</h4>
          <div class="filtro-avaliacao">
            <button
              v-for="estrela in 5"
              :key="estrela"
              @click="filtroAvaliacao = estrela"
              class="estrela-btn"
              :class="{ ativo: estrela <= filtroAvaliacao }"
              :aria-label="'Filtrar por ' + estrela + ' estrelas ou mais'"
            >
              {{ estrela <= filtroAvaliacao ? "★" : "☆" }}
            </button>
            <button
              v-if="filtroAvaliacao > 0"
              @click="filtroAvaliacao = 0"
              class="limpar-avaliacao"
              aria-label="Limpar filtro de avaliação"
            >
              Limpar
            </button>
          </div>
        </div>
      </aside>

      <main class="conteudo-principal">
        <div v-if="loading" class="skeleton-container">
          <div class="skeleton-section">
            <div class="skeleton-title"></div>
            <div class="produtos-grid">
              <div v-for="n in 4" :key="n" class="skeleton-card"></div>
            </div>
          </div>
          <div class="skeleton-section">
            <div class="skeleton-title"></div>
            <div class="produtos-grid">
              <div v-for="n in 8" :key="n" class="skeleton-card"></div>
            </div>
          </div>
        </div>

        <div v-else>
          <section class="secao-destaque">
            <h2 class="titulo-secao">Destaques Perto de Você</h2>
            <div class="produtos-grid">
              <ProductCard
                v-for="produto in produtosPertoDeVoce"
                :key="produto.id"
                :produto="produto"
                @delete="funcaoQueRemoveDoBackend"
              />
            </div>
          </section>

          <section class="secao-destaque">
            <h2 class="titulo-secao">Destaques da Plataforma</h2>
            <div class="produtos-grid">
              <ProductCard
                v-for="produto in produtosDestaquePlataforma"
                :key="produto.id"
                :produto="produto"
                @delete="funcaoQueRemoveDoBackend"
              />
            </div>
          </section>

          <section class="secao-principal">
            <h2 class="titulo-secao">Todos os Produtos</h2>

            <div class="produtos-grid">
              <ProductCard
                v-for="produto in produtosDaPagina"
                :key="produto.id"
                :produto="produto"
                @delete="funcaoQueRemoveDoBackend"
              />
            </div>

            <p v-if="produtosFiltrados.length === 0" class="sem-resultados">
              Nenhum produto encontrado com os filtros aplicados.
            </p>

            <div v-if="totalPaginas > 1" class="paginacao-container">
              <button
                @click="paginaAnterior"
                :disabled="paginaAtual === 1"
                class="pagina-btn"
                aria-label="Página anterior"
              >
                Anterior
              </button>
              <span class="pagina-info">
                Página {{ paginaAtual }} de {{ totalPaginas }}
              </span>
              <button
                @click="proximaPagina"
                :disabled="paginaAtual === totalPaginas"
                class="pagina-btn"
                aria-label="Próxima página"
              >
                Próxima
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import ProductCard from "@/components/ProductCard.vue";
import { useToast } from "vue-toastification";
import { useProductStore } from "@/stores/product";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/Product`;

export default {
  components: { ProductCard },
  setup() {
    const produtos = ref([]);
    const produtosPertoDeVoceRef = ref([]);

    const paginaAtual = ref(1);
    const itensPorPagina = ref(8);
    const loading = ref(true);
    const toast = useToast();
    const productStore = useProductStore();

    const filtroCategoria = ref("");
    const filtroPrecoMin = ref(null);
    const filtroPrecoMax = ref(null);
    const filtroAvaliacao = ref(0);
    const categoriasDisponiveis = ref([]);

    const carregarProdutos = async () => {
      loading.value = true;
      try {
        const response = await axios.get(API_URL);
        const data = response.data;

        produtos.value = data.map((item) => ({
          id: item.id,
          name: item.name || "Sem nome",
          description: item.description || "",
          price: item.price || 0,
          category: item.category || "Geral",
          mainImageUrl:
            item.mainImageUrl ||
            "https://via.placeholder.com/250x250?text=Sem+Imagem",
          sellerId: item.sellerId,
          rating: item.averageRating || 0,
          state: item.state || "Novo",
        }));

        // Gera "Perto de Você" aleatoriamente para simular descoberta
        // Fazemos uma cópia e embaralhamos
        const shuffled = [...produtos.value].sort(() => 0.5 - Math.random());
        produtosPertoDeVoceRef.value = shuffled.slice(0, 4);

        categoriasDisponiveis.value = [
          ...new Set(produtos.value.map((p) => p.category)),
        ];
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        toast.error("Não foi possível carregar os produtos.");
      } finally {
        loading.value = false;
      }
    };

    const funcaoQueRemoveDoBackend = async (idProduto) => {
      if (!confirm("Tem certeza que deseja apagar este produto?")) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.warning("Você precisa estar logado.");
          return;
        }

        await axios.delete(`${API_URL}/${idProduto}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Remove de TODAS as listas locais
        produtos.value = produtos.value.filter((p) => p.id !== idProduto);
        produtosPertoDeVoceRef.value = produtosPertoDeVoceRef.value.filter(
          (p) => p.id !== idProduto
        );

        toast.success("Produto removido com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar:", error);
        toast.error("Erro ao deletar produto. Verifique se você é o dono.");
      }
    };

    // Retorna a ref aleatória que criamos no carregamento
    const produtosPertoDeVoce = computed(() => {
      return produtosPertoDeVoceRef.value;
    });

    // Filtra os Top 4 Melhores Avaliados (Rating)
    const produtosDestaquePlataforma = computed(() => {
      // Cria cópia para não mudar a ordem da lista principal
      const sorted = [...produtos.value].sort((a, b) => b.rating - a.rating);
      return sorted.slice(0, 4);
    });

    const produtosFiltrados = computed(() => {
      return produtos.value.filter((produto) => {
        const termo = productStore.termoBuscaGlobal.toLowerCase();
        const correspondeBusca = termo
          ? produto.name.toLowerCase().includes(termo) ||
            produto.description.toLowerCase().includes(termo)
          : true;

        const correspondeCategoria = filtroCategoria.value
          ? produto.category === filtroCategoria.value
          : true;
        const correspondePrecoMin = filtroPrecoMin.value
          ? produto.price >= filtroPrecoMin.value
          : true;
        const correspondePrecoMax = filtroPrecoMax.value
          ? produto.price <= filtroPrecoMax.value
          : true;
        const correspondeAvaliacao = filtroAvaliacao.value
          ? produto.rating >= filtroAvaliacao.value
          : true;
        return (
          correspondeBusca &&
          correspondeCategoria &&
          correspondePrecoMin &&
          correspondePrecoMax &&
          correspondeAvaliacao
        );
      });
    });

    const totalPaginas = computed(() =>
      Math.ceil(produtosFiltrados.value.length / itensPorPagina.value)
    );

    const produtosDaPagina = computed(() => {
      const inicio = (paginaAtual.value - 1) * itensPorPagina.value;
      const fim = inicio + itensPorPagina.value;
      return produtosFiltrados.value.slice(inicio, fim);
    });

    const paginaAnterior = () => {
      if (paginaAtual.value > 1) paginaAtual.value--;
    };
    const proximaPagina = () => {
      if (paginaAtual.value < totalPaginas.value) paginaAtual.value++;
    };

    watch(
      [
        filtroCategoria,
        filtroPrecoMin,
        filtroPrecoMax,
        filtroAvaliacao,
        () => productStore.termoBuscaGlobal,
      ],
      () => {
        paginaAtual.value = 1;
      }
    );

    onMounted(carregarProdutos);

    return {
      produtosPertoDeVoce,
      produtosDestaquePlataforma,
      produtosFiltrados,
      produtosDaPagina,
      paginaAtual,
      totalPaginas,
      paginaAnterior,
      proximaPagina,
      filtroCategoria,
      filtroPrecoMin,
      filtroPrecoMax,
      filtroAvaliacao,
      categoriasDisponiveis,
      loading,
      funcaoQueRemoveDoBackend,
    };
  },
};
</script>

<style scoped>
.pagina-produtos {
  padding: 40px 20px;
  max-width: 1800px;
  margin: auto;
  min-height: 100vh;
}

.estrela-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 1.5rem;
  cursor: pointer;
  color: #ccc;
}
.estrela-btn.ativo {
  color: #ffc107;
}

.skeleton-section {
  margin-bottom: 60px;
}
.skeleton-title {
  height: 40px;
  width: 300px;
  background: #ddd;
  margin-bottom: 25px;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}
.skeleton-card {
  height: 350px;
  background: #eee;
  border-radius: 10px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.6;
  }
}

.layout-container {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
  background-color: var(--color-card-background);
  padding: 20px;
  border-radius: 15px;
  position: sticky;
  top: 120px;
}
.conteudo-principal {
  flex: 1;
}
.secao-destaque {
  margin-bottom: 60px;
}
.secao-principal {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid var(--color-border);
}
.titulo-secao {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--color-primary);
  display: inline-block;
  color: var(--color-heading);
}
.sidebar-titulo {
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--color-border);
  color: var(--color-heading);
}
.filtro-grupo {
  margin-bottom: 25px;
}
.filtro-grupo h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--color-heading);
}
.lista-categorias {
  list-style: none;
  padding: 0;
  margin: 0;
}
.lista-categorias li {
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s;
  color: var(--color-text);
}
.lista-categorias li:hover {
  background-color: var(--color-background-mute);
}
.lista-categorias li.ativo {
  background-color: var(--color-primary);
  color: white;
  font-weight: bold;
}
.filtro-preco-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}
.filtro-preco-inputs input {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  color: var(--color-text);
}
.filtro-avaliacao {
  display: flex;
  align-items: center;
  gap: 5px;
}
.limpar-avaliacao {
  margin-left: 10px;
  border: none;
  background-color: var(--color-background-mute);
  color: var(--color-text);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}
.produtos-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}
.sem-resultados {
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-text);
  margin-top: 50px;
}
.paginacao-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  gap: 15px;
}
.pagina-btn {
  padding: 10px 20px;
  border: 1px solid var(--color-border);
  background-color: var(--color-card-background);
  color: var(--color-text);
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.pagina-btn:hover:not(:disabled) {
  background-color: var(--color-background-mute);
}
.pagina-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pagina-info {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
}

@media (max-width: 1400px) {
  .produtos-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 1200px) {
  .produtos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 992px) {
  .layout-container {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    position: static;
    margin-bottom: 30px;
  }
  .produtos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .sidebar-titulo,
  .filtro-grupo h4 {
    font-size: 1.4rem;
  }
  .lista-categorias li {
    font-size: 1rem;
  }
}
@media (max-width: 600px) {
  .pagina-produtos {
    padding: 20px 10px;
  }
  .produtos-grid {
    grid-template-columns: 1fr;
  }
  .sidebar {
    padding: 15px;
  }
  .filtro-preco-inputs {
    flex-direction: column;
    gap: 5px;
  }
  .filtro-preco-inputs input {
    width: 100%;
  }
  .paginacao-container {
    flex-wrap: wrap;
    gap: 10px;
  }
  .pagina-btn {
    flex-grow: 1;
    font-size: 0.95rem;
    padding: 8px 15px;
  }
  .pagina-info {
    width: 100%;
    text-align: center;
  }
  .titulo-secao {
    font-size: 1.6rem;
  }
}
</style>
