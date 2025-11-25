<template>
  <div>
    <h2>Sucesso!</h2>
    <p>Pagamento realizado com sucesso.</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useCartStore } from "@/stores/cart";

const cartStore = useCartStore();

onMounted(() => {
  if (cartStore.items.length > 0) {
    cartStore.clearCart();
  }
});
</script>
