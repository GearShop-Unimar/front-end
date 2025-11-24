<template>
  <div class="produto-card" @click="irParaProduto(produto.id)">
    <button
      v-if="isOwner"
      class="btn-delete"
      @click.stop="confirmarDelete"
      aria-label="Deletar produto"
    >
      <i class="fa fa-trash"></i>
    </button>
    <div class="card-content">
      <div class="imagem-container">
        <img
          v-if="produto.mainImageUrl"
          :src="produto.mainImageUrl"
          :alt="produto.name"
          class="produto-imagem"
          loading="lazy"
          @error="onImageError"
        />
        <div v-else class="sem-imagem">
          <i class="fa fa-image"></i>
          <span>Sem imagem</span>
        </div>
      </div>
      <div class="produto-info">
        <h3>{{ produto.name }}</h3>
        <span class="badge-vendedor">{{ sellerName }}</span>
        <p class="preco">R$ {{ produto.price.toFixed(2) }}</p>

        <div class="avaliacao-estrelas">
          <span
            v-for="i in 5"
            :key="i"
            class="estrela"
            :class="{ 'estrela-preenchida': i <= rating }"
            >★</span
          >
          <span class="numero-avaliacoes">({{ reviewCount }} avaliações)</span>
        </div>
        <p class="estado">{{ produto.state || "" }}</p>

        <button
          class="btn-carrinho"
          @click.stop="adicionarAoCarrinho"
          :disabled="isAdding"
        >
          {{ isAdding ? "Adicionando..." : "Adicionar ao carrinho" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import { useToast } from "vue-toastification";

const props = defineProps({
  produto: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        value.id &&
        value.name &&
        typeof value.price === "number" &&
        value.sellerId
      );
    },
  },
});

const emit = defineEmits(["delete"]);

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const toast = useToast();
const isAdding = ref(false);
const isDeleting = ref(false);

const isOwner = computed(() => {
  if (!authStore.user || !props.produto.sellerId) return false;
  return String(authStore.user.id) === String(props.produto.sellerId);
});

const sellerName = computed(() => {
  if (!props.produto.sellerId) return "Vendedor desconhecido";
  const seller = userStore.users[props.produto.sellerId];
  return seller?.name || "Carregando...";
});

const rating = computed(() => Math.round(props.produto.rating || 0));
const reviewCount = computed(() => props.produto.reviewCount || 0);

const confirmarDelete = async () => {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;

  isDeleting.value = true;
  try {
    emit("delete", props.produto.id);
    toast.success("Produto deletado com sucesso!");
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    toast.error("Erro ao deletar o produto.");
  } finally {
    isDeleting.value = false;
  }
};

const irParaProduto = (id) => {
  router.push(`/produto/${id}`);
};

const adicionarAoCarrinho = async () => {
  if (!authStore.user) {
    router.push("/login");
    return;
  }

  isAdding.value = true;
  try {
    await cartStore.addToCart(props.produto.id, 1);
    // TOAST DE SUCESSO REMOVIDO: A sidebar abre como confirmação visual.
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    if (error.response?.status === 401) {
      router.push("/login");
    } else {
      toast.error("Erro ao adicionar ao carrinho.");
    }
  } finally {
    isAdding.value = false;
  }
};

const onImageError = (event) => {
  event.target.style.display = "none";
  const container = event.target.parentElement;
  if (container) {
    const semImagem = container.querySelector(".sem-imagem");
    if (semImagem) semImagem.style.display = "flex";
  }
};

onMounted(() => {
  if (props.produto.sellerId) {
    userStore.fetchUserById(props.produto.sellerId);
  }
});
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
  display: flex;
  flex-direction: column;
  height: 100%;
}
.produto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px var(--color-card-shadow);
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.btn-delete {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  color: #dc3545;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.btn-delete:hover {
  background-color: #dc3545;
  color: white;
  transform: scale(1.1);
}

.btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  display: flex;
  flex-direction: column;
  align-items: center;
}
.produto-info {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.produto-info h3 {
  margin: 0 0 10px;
  font-size: 1.2rem;
  color: var(--color-heading);
  line-height: 1.4;
  height: 2.8em;
  overflow: hidden;
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
  margin-bottom: auto;
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
  align-self: flex-start;
}
.btn-carrinho {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 16px;
  margin-top: 15px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
  width: 100%;
}
.btn-carrinho:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}
.btn-carrinho:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
    padding: 10px 14px;
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
    margin-top: 10px;
  }
}
</style>
