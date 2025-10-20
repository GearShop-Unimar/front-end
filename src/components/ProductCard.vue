<template>
  <div class="produto-card" @click="irParaProduto(produto.id)">
    <div class="card-content">
      <div class="imagem-container">
        <img
          v-if="produto.mainImageUrl"
          :src="produto.mainImageUrl"
          :alt="produto.name"
          class="produto-imagem"
        />
        <div v-else class="sem-imagem">
          <span>📷 Sem imagem</span>
        </div>
      </div>
      <div class="produto-info">
        <h3>{{ produto.name }}</h3>

        <span class="badge-vendedor">{{ sellerName }}</span>

        <p class="preco">R$ {{ produto.price.toFixed(2) }}</p>
        <p class="estado">{{ produto.state || "" }}</p>
        <p class="descricao">{{ produto.description }}</p>
        <button class="btn-carrinho" @click.stop="adicionarAoCarrinho">
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useToast } from "vue-toastification";

const props = defineProps({
  produto: Object,
});

const router = useRouter();
const userStore = useUserStore();
const toast = useToast();

onMounted(() => {
  if (props.produto.sellerId) {
    userStore.fetchUserById(props.produto.sellerId);
  }
});

const sellerName = computed(() => {
  if (!props.produto.sellerId) {
    return "Vendedor desconhecido";
  }
  const seller = userStore.users[props.produto.sellerId];
  return seller ? seller.name : "Vendedor...";
});

const irParaProduto = (id) => {
  router.push(`/produto/${id}`);
};

const adicionarAoCarrinho = () => {
  toast.success(`"${props.produto.name}" adicionado ao carrinho!`);
};
</script>

<style scoped>
.produto-card {
  background: var(--color-card-background);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px var(--color-card-shadow);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  cursor: pointer;
}
.produto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px var(--color-card-shadow);
}
.imagem-container {
  height: 200px;
  width: 100%;
  background-color: var(--color-background-mute);
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
  color: var(--color-text);
  opacity: 0.7;
  font-size: 1rem;
}
.produto-info {
  padding: 15px;
}
.produto-info h3 {
  margin: 0 0 10px;
  font-size: 1.25rem;
  color: var(--color-heading);
}
.preco {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
  margin: 0.5rem 0;
}
.estado {
  color: var(--color-text);
  font-size: 0.9rem;
}
.descricao {
  color: var(--color-text);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.badge-vendedor {
  display: inline-block;
  background-color: var(--color-primary);
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  margin: 0.5rem 0;
  font-weight: bold;
}
.btn-carrinho {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  margin-top: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}
.btn-carrinho:hover {
  background-color: var(--color-primary-hover);
}
</style>
