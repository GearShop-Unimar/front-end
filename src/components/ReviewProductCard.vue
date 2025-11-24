<template>
  <div class="review-card">
    <button class="btn-remove" @click.stop="emitRemove" aria-label="Remover item">
      <i class="fa fa-times"></i>
    </button>

      <div class="review-content">
        <div class="thumb">
          <img v-if="item.imagem" :src="item.imagem" :alt="item.nome" @error="onImageError" />
          <div v-else class="thumb-fallback">
            <i class="fa fa-image"></i>
          </div>
        </div>

        <div class="info">
          <h3 class="nome">{{ item.nome }}</h3>
          <p class="descricao" v-if="item.descricao">{{ item.descricao }}</p>
          <div class="meta">
            <span class="preco">R$ {{ formattedPrice }}</span>
            <span class="qtd">Qtd: {{ item.quantidade }}</span>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['remove']);

const formattedPrice = computed(() => {
  const value = Number(props.item.preco || 0);
  return value.toFixed(2);
});

const emitRemove = () => {
  emit('remove', props.item.id);
};

const onImageError = (ev) => {
  ev.target.style.display = 'none';
};
</script>

<style scoped>
.review-card {
  background: var(--color-card-background);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  align-items: center;
  position: relative;
  box-shadow: 0 4px 8px var(--color-card-shadow);
}
.btn-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 30px;
  height: 30px;
  border: none;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.review-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.thumb {
  width: 100%;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-mute);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: hidden;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.thumb-fallback {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 1.2rem;
}
.info {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 12px 6px 6px 6px;
}
.nome {
  margin: 0 0 6px 0;
  font-size: 1rem;
  color: var(--color-heading);
  font-weight: 700;
}
.descricao {
  margin: 0 0 8px 0;
  color: var(--color-text);
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.meta {
  margin-top: 8px;
  display: flex;
  gap: 12px;
  align-items: center;
}
.preco {
  color: var(--color-primary);
  font-weight: 700;
}
.qtd {
  color: var(--color-text);
}

@media (max-width: 768px) {
  .thumb { width: 80px; height: 80px; }
}

</style>
