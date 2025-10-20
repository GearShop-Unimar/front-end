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
            >
              Todas
            </li>
            <li
              v-for="cat in categoriasDisponiveis"
              :key="cat"
              :class="{ ativo: filtroCategoria === cat }"
              @click="filtroCategoria = cat"
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
            />
            <span>-</span>
            <input
              type="number"
              v-model.number="filtroPrecoMax"
              placeholder="Máx"
            />
          </div>
        </div>

        <div class="filtro-grupo">
          <h4>Avaliação</h4>
          <div class="filtro-avaliacao">
            <span
              v-for="estrela in 5"
              :key="estrela"
              @click="filtroAvaliacao = estrela"
              class="estrela"
            >
              {{ estrela <= filtroAvaliacao ? "★" : "☆" }}
            </span>
            <button
              v-if="filtroAvaliacao > 0"
              @click="filtroAvaliacao = 0"
              class="limpar-avaliacao"
            >
              Limpar
            </button>
          </div>
        </div>
      </aside>

      <main class="conteudo-principal">
        <section class="secao-destaque">
          <h2 class="titulo-secao">Destaques Perto de Você</h2>
          <div class="produtos-grid">
            <ProductCard
              v-for="produto in produtosPertoDeVoce"
              :key="produto.id"
              :produto="produto"
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
            >
              Próxima
            </button>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import ProductCard from "@/components/ProductCard.vue";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/Product`;

export default {
  components: { ProductCard },
  setup() {
    const produtos = ref([]);
    const produtosPertoDeVoce = ref([]);
    const produtosDestaquePlataforma = ref([]);
    const paginaAtual = ref(1);
    const itensPorPagina = ref(8);

    const filtroCategoria = ref("");
    const filtroPrecoMin = ref(null);
    const filtroPrecoMax = ref(null);
    const filtroAvaliacao = ref(0);
    const categoriasDisponiveis = ref([]);

    const carregarProdutos = async () => {
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
          rating: Math.floor(Math.random() * 5) + 1,
        }));

        produtosPertoDeVoce.value = produtos.value.slice(0, 4);
        produtosDestaquePlataforma.value = produtos.value.slice(4, 8);
        categoriasDisponiveis.value = [
          ...new Set(produtos.value.map((p) => p.category)),
        ];
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        alert("Erro ao carregar produtos. Verifique o servidor!");
      }
    };

    const produtosFiltrados = computed(() => {
      return produtos.value.filter((produto) => {
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
          correspondeCategoria &&
          correspondePrecoMin &&
          correspondePrecoMax &&
          correspondeAvaliacao
        );
      });
    });

    const totalPaginas = computed(() => {
      return Math.ceil(produtosFiltrados.value.length / itensPorPagina.value);
    });

    const produtosDaPagina = computed(() => {
      const inicio = (paginaAtual.value - 1) * itensPorPagina.value;
      const fim = inicio + itensPorPagina.value;
      return produtosFiltrados.value.slice(inicio, fim);
    });

    const paginaAnterior = () => {
      if (paginaAtual.value > 1) {
        paginaAtual.value--;
      }
    };

    const proximaPagina = () => {
      if (paginaAtual.value < totalPaginas.value) {
        paginaAtual.value++;
      }
    };

    watch(
      [filtroCategoria, filtroPrecoMin, filtroPrecoMax, filtroAvaliacao],
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
    };
  },
};
</script>

<style scoped>
.pagina-produtos {
  padding: 40px 20px;
  max-width: 1800px;
  margin: auto;
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
.estrela {
  font-size: 1.5rem;
  cursor: pointer;
  color: #ffc107;
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
@media (max-width: 1200px) {
  .produtos-grid {
    grid-template-columns: repeat(3, 1fr);
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
}
@media (max-width: 600px) {
  .produtos-grid {
    grid-template-columns: 1fr;
  }
}
</style>
