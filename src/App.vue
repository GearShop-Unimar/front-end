<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import { useThemeStore } from "@/stores/theme";
import "./assets/main.css";

const route = useRoute();
const themeStore = useThemeStore();

const isAuthRoute = computed(() => {
  return route.path === "/login" || route.path === "/cadastro";
});

onMounted(() => {
  themeStore.initTheme();
});
</script>

<template>
  <div id="app">
    <Navbar v-if="!isAuthRoute" />
    <router-view />
    <Footer v-if="!isAuthRoute" />
  </div>
</template>

<style scoped>
#app {
  overflow-x: hidden;
  overflow-y: unset;
}
</style>
