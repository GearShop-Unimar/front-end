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
          <span> Sem imagem</span>
        </div>
      </div>
      <div class="produto-info">
        <h3>{{ produto.name }}</h3>

        <span class="badge-vendedor">{{ sellerName }}</span>

        <p class="preco">R$ {{ produto.price.toFixed(2) }}</p>

        <div class="avaliacao-estrelas">
          <span
            v-for="star in 5"
            :key="star"
            :class="{ 'estrela-preenchida': star <= produtoRating }"
            class="estrela"
          >
            &#9733;
          </span>
          <span class="numero-avaliacoes" v-if="reviewCount > 0">
            ({{ reviewCount }})
          </span>
          <span class="numero-avaliacoes" v-else> (Sem avaliações) </span>
        </div>
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

const produtoRating = computed(() => {
  return props.produto.averageRating
    ? parseFloat(props.produto.averageRating)
    : 0;
});

const reviewCount = computed(() => {
  return props.produto.reviewCount ? parseInt(props.produto.reviewCount) : 0;
});

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

.avaliacao-estrelas {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.estrela {
  color: var(--color-gray-light);
  font-size: 1.2rem;
  margin-right: 2px;
}
.estrela-preenchida {
  color: gold;
}
.numero-avaliacoes {
  font-size: 0.9rem;
  color: var(--color-text-light);
  margin-left: 5px;
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

@media (max-width: 768px) {
  .produto-info h3 {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }
  .preco {
    font-size: 1.4rem;
  }
  .estrela {
    font-size: 1.1rem;
  }
  .numero-avaliacoes,
  .estado,
  .descricao {
    font-size: 0.85rem;
  }
  .badge-vendedor {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
  }
  .btn-carrinho {
    padding: 7px 14px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .imagem-container {
    height: 160px;
  }
  .produto-info {
    padding: 12px;
  }
  .produto-info h3 {
    font-size: 1rem;
  }
  .preco {
    font-size: 1.3rem;
  }
  .estrela {
    font-size: 1rem;
  }
  .numero-avaliacoes,
  .estado,
  .descricao {
    font-size: 0.8rem;
  }
  .btn-carrinho {
    width: 100%;
    margin-top: 8px;
  }
}
</style>
