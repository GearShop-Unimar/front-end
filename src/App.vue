<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import "./assets/main.css";

const route = useRoute();

const isAuthRoute = computed(() => {
  return route.path === "/login" || route.path === "/cadastro";
});
</script>

<template>
  <div id="app">
    <Navbar v-if="!isAuthRoute" />

    <router-view />

    <Footer v-if="!isAuthRoute" />
  </div>
</template>
