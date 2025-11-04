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
    <Footer v-if="!esconderFooter" />
  </div>
</template>

<style scoped>
#app {
  overflow-x: hidden;
  overflow-y: unset;
}
</style>
