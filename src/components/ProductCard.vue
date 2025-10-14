<template>
  <div class="produto-card" @click="irParaProduto(produto.id)">
    <div class="card-content">
      <div class="imagem-container">
        <img
          v-if="produto.mainImageUrl"
          :src="produto.mainImageUrl"
          :alt="produto.nome"
          class="produto-imagem"
        />
        <div v-else class="sem-imagem">
          <span>📷 Sem imagem</span>
        </div>
      </div>
      <div class="produto-info">
        <h3>{{ produto.nome }}</h3>
        <span class="badge-vendedor">{{
          produto.vendedor || "Vendedor desconhecido"
        }}</span>
        <p class="preco">R$ {{ produto.preco.toFixed(2) }}</p>
        <p class="estado">{{ produto.estado }}</p>
        <p class="descricao">{{ produto.descricao }}</p>
        <button class="btn-carrinho" @click.stop="adicionarAoCarrinho">
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const props = defineProps({
  produto: Object,
});
const router = useRouter();
const irParaProduto = (id) => {
  router.push(`/produto/${id}`);
};

const adicionarAoCarrinho = () => {
  // Aqui você pode implementar a lógica para adicionar ao carrinho
  alert(`Produto "${props.produto.nome}" adicionado ao carrinho!`);
};
</script>

<style scoped>
.produto-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  position: relative;
  cursor: pointer;
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
.badge-vendedor {
  display: inline-block;
  background-color: #ff6600;
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  margin: 0.5rem 0;
  font-weight: bold;
}
.btn-carrinho {
  background-color: #ff6600;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  margin-top: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}
.btn-carrinho:hover {
  background-color: #e65c00;
}
</style>
