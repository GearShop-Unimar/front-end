<template>
  <nav class="navbar" :class="{ 'navbar-hidden': isHidden }">
    <div class="navbar-container">
      <button class="hamburger" @click="toggleMenu">
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>

      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/categoria">Categorias</router-link></li>
        <li><router-link to="/anunciar">Anunciar</router-link></li>
        <li><router-link to="/sobre">Sobre Nós</router-link></li>
        <li><router-link to="/contato">Contato</router-link></li>
      </ul>

      <div class="search-container">
        <form class="search-bar" @submit.prevent="pesquisar">
          <input
            type="text"
            v-model="termoBusca"
            placeholder="Buscar peças..."
          />
          <button type="submit">Buscar</button>
        </form>
      </div>

      <ul class="auth-links">
        <template v-if="authStore.isAuthenticated">
          <li>
            <router-link to="/carrinho" class="cart-link">
              <i class="fa fa-shopping-cart cart-icon"></i>
            </router-link>
          </li>
          <li>
            <span class="welcome-message"
              >Bem vindo, {{ authStore.user?.name }}!</span
            >
          </li>
          <li>
            <router-link to="/meus-produtos" class="account-link">
              <i class="fa fa-user-circle account-icon"></i>
            </router-link>
          </li>
          <li>
            <button @click="authStore.logout" class="logout-btn">Sair</button>
          </li>
        </template>

        <template v-else>
          <li><router-link to="/login">Entrar</router-link></li>
          <li><router-link to="/cadastro">Cadastre-se</router-link></li>
        </template>
      </ul>
    </div>
  </nav>
  <Carrinho :isOpen="isCartOpen" @close="closeCart" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import Carrinho from "@/components/Carrinho.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const isCartOpen = ref(false);
const termoBusca = ref("");
const menuOpen = ref(false);
const isHidden = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const openCart = () => {
  isCartOpen.value = true;
};

const closeCart = () => {
  isCartOpen.value = false;
};

const router = useRouter();
const pesquisar = () => {
  if (termoBusca.value.trim()) {
    router.push({
      name: "Categoria",
      query: { busca: termoBusca.value.trim() },
    });
    termoBusca.value = "";
  }
};

const handleScroll = () => {
  isHidden.value = window.scrollY > 100;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
/* ... todos os seus outros estilos ... */

.cart-icon {
  font-size: 24px;
  color: white;
  transition: color 0.3s ease;
}

.cart-icon:hover {
  color: #ff6600;
}

.account-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.account-icon:hover {
  color: #ff6600;
}

/* Estilo para a mensagem de boas-vindas */
.welcome-message {
  color: #ff6600;
  font-weight: bold;
  margin: 0 15px; /* Adiciona espaçamento */
  white-space: nowrap; /* Impede que o nome quebre a linha */
}

/* ... mantenha todos os seus outros estilos aqui ... */
.hamburger span {
  display: block;
  width: 25px;
  height: 3px;
  margin: 5px auto;
  background-color: white;
  transition: all 0.3s ease;
}

.hamburger span.open {
  background-color: #ff6600;
}

.navbar {
  background-color: #1a1a1a;
  padding: 0;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  width: 100%;
}

.nav-links,
.auth-links {
  list-style: none;
  display: flex;
  gap: 30px;
  margin: 0;
  padding: 0;
  margin-left: auto;
  margin-right: 100px;
  align-items: center;
}

.nav-links li,
.auth-links li {
  display: flex;
  align-items: center;
}

.nav-links li a,
.auth-links li a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}

.nav-links li a:hover,
.auth-links li a:hover {
  color: #ff6600;
}

.account-icon {
  font-size: 24px;
  color: white;
}

.logout-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  padding-left: 10px;
}

.logout-btn:hover {
  text-decoration: underline;
}

.navbar-hidden {
  transform: translateY(-100%);
  transition: transform 0.5s ease-in-out;
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #1a1a1a;
  border-radius: 25px;
  padding: 5px 15px;
  border: 1px solid #444;
}

.search-bar input {
  background: transparent;
  border: none;
  outline: none;
  color: white;
  padding: 8px 12px;
  width: 200px;
  font-size: 14px;
  font-family: "Rajdhani", sans-serif;
}

.search-bar button {
  background-color: #ff6600;
  border: none;
  color: white;
  padding: 8px 14px;
  margin-left: 10px;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-bar button:hover {
  background-color: #e55b00;
}
</style>
