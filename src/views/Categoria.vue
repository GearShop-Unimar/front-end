<template>
  <div class="categorias-container">
    <h1>🔍 Produtos à Venda</h1>
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

    <div class="produtos">
      <ProductCard
        v-for="produto in produtosFiltrados"
        :key="produto.id"
        :produto="produto"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import ProductCard from "@/components/ProductCard.vue";

const API_URL = "http://localhost:5282/api/Products";

export default {
  components: { ProductCard },
  setup() {
    const produtos = ref([]);
    const filtroCategoria = ref("");
    const produtosFiltrados = ref([]);
    const route = useRoute();
    const router = useRouter();

    const carregarProdutos = async () => {
      try {
        const response = await axios.get(API_URL);
        const data = response.data;

        produtos.value = data.map((item, idx) => ({
          id: item.id,
          nome: item.name || "Sem nome",
          vendedor: item.seller || `Usuário${idx + 1}`,
          preco: item.price || 0,
          estado: item.state || "Novo",
          descricao: item.description || "",
          mainImageUrl: item.mainImageUrl || null,
        }));

        aplicarFiltro();
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert(`Erro ao carregar produtos. Verifique a API em ${API_URL}`);
      }
    };

    const aplicarFiltro = () => {
      const termo = (route.query.busca || "").toLowerCase().trim();
      let filtrados = produtos.value;

      if (filtroCategoria.value) {
        filtrados = filtrados.filter(
          (p) =>
            p.categoria.toLowerCase() === filtroCategoria.value.toLowerCase()
        );
      }

      if (termo) {
        filtrados = filtrados.filter(
          (p) =>
            p.nome.toLowerCase().includes(termo) ||
            p.descricao.toLowerCase().includes(termo)
        );
      }

      produtosFiltrados.value = filtrados;
    };

    const irParaProduto = (produtoId) => {
      router.push(`/produto/${produtoId}`);
    };

    onMounted(carregarProdutos);
    watch(() => route.query.busca, aplicarFiltro);
    watch(filtroCategoria, aplicarFiltro);

    return {
      produtosFiltrados,
      filtroCategoria,
      irParaProduto,
    };
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  scroll-behavior: smooth;
  height: 100%;
}

.categorias-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Rajdhani", sans-serif;
  padding-top: 80px;
  padding-bottom: 100px;
  flex-grow: 1;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #1a1a1a;
  font-size: 2.2rem;
}

.filtros {
  margin-bottom: 30px;
  text-align: center;
}

.filtro-select {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background-color: #f9f9f9;
  cursor: pointer;
}

.produtos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
}

.produto-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  position: relative;
  cursor: pointer;
}

@media (max-width: 900px) {
  .produtos {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .produtos {
    grid-template-columns: 1fr;
  }
}

.produto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.imagem-container {
  height: 200px;
  width: 100%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.produto-imagem {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sem-imagem {
  color: #999;
  font-size: 1rem;
}

.produto-info {
  padding: 15px;
}

.produto-info h3 {
  margin: 0 0 10px;
  font-size: 1.25rem;
  color: #333;
}

.categoria {
  display: inline-block;
  background-color: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  margin: 0.5rem 0;
  color: #666;
}

.preco {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff6600;
  margin: 0.5rem 0;
}

.estado {
  color: #666;
  font-size: 0.9rem;
}

.descricao {
  color: #444;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal-botoes {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-continuar,
.btn-carrinho {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-continuar {
  background-color: #f0f0f0;
  color: #333;
}

.btn-continuar:hover {
  background-color: #ddd;
}

.btn-carrinho {
  background-color: #ff6600;
  color: white;
}

.btn-carrinho:hover {
  background-color: #e55b00;
}

@media (max-width: 768px) {
  .produtos {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .modal-botoes {
    flex-direction: column;
  }
}
</style>
