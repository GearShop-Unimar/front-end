<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import MessagesWidget from "@/components/MessagesWidget.vue";
import Carrinho from "@/components/Carrinho.vue";
import { useThemeStore } from "@/stores/theme";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import "./assets/main.css";

const route = useRoute();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const cartStore = useCartStore();

const isAuthRoute = computed(() => {
  return route.path === "/login" || route.path === "/cadastro";
});

const esconderFooter = computed(() => {
  return (
    route.path === "/login" ||
    route.path === "/cadastro" ||
    route.path === "/produtos" ||
    route.path === "/meus-produtos" ||
    route.path === "/fidelidade"
  );
});

onMounted(async () => {
  themeStore.initTheme();

  if (authStore.isAuthenticated) {
    await cartStore.fetchCart();
  }
});
</script>
<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
  />
  <div id="app">
    <Navbar v-if="!isAuthRoute" />

    <router-view />

    <Footer v-if="!esconderFooter" />

    <MessagesWidget />

    <Carrinho />
  </div>
</template>

<style scoped>
#app {
  overflow-x: hidden;
  min-height: 100vh;
  position: relative;
}
</style>
