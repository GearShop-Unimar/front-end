<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import MessagesWidget from "@/components/MessagesWidget.vue";
import { useThemeStore } from "@/stores/theme";
import "./assets/main.css";

const route = useRoute();
const themeStore = useThemeStore();

// Esta computed esconde a Navbar nas rotas de auth
const isAuthRoute = computed(() => {
  return route.path === "/login" || route.path === "/cadastro";
});

const esconderFooter = computed(() => {
  return (
    route.path === "/login" ||
    route.path === "/cadastro" ||
    route.path === "/meus-produtos"
  );
});

onMounted(() => {
  themeStore.initTheme();
});
</script>

<template>
  <div id="app">
    <Navbar v-if="!isAuthRoute" />
    <router-view />
<<<<<<< HEAD
    <Footer v-if="!esconderFooter" />
=======
    <Footer v-if="!isAuthRoute" />
    <!-- Widget de mensagens flutuante -->
    <MessagesWidget />
>>>>>>> 68f3d045b69c76b0779604d1520c1d4c2a5759ef
  </div>
</template>

<style scoped>
#app {
  overflow-x: hidden;
  overflow-y: unset;
}
</style>
