<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="navbar-container">
      <router-link to="/" class="navbar-logo">
        <span class="logo-gear">Gear</span><span class="logo-shop">Shop</span>
      </router-link>

      <button class="hamburger" @click="toggleMenu" :class="{ open: menuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="nav-menu" :class="{ open: menuOpen }">
        <ul class="nav-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/categoria">Categorias</router-link></li>
          <li><router-link to="/anunciar">Anunciar</router-link></li>
          <li><router-link to="/sobre">Sobre Nós</router-link></li>
          <li><router-link to="/contato">Contato</router-link></li>
        </ul>

        <div class="search-container">
          <form class="search-bar" @submit.prevent="pesquisar">
            <i class="fa fa-search search-icon"></i>
            <input
              type="text"
              v-model="termoBusca"
              placeholder="Buscar peças..."
            />
          </form>
        </div>

        <ul class="auth-links">
          <template v-if="authStore.isAuthenticated">
            <li>
              <router-link
                to="/carrinho"
                class="icon-link"
                aria-label="Carrinho"
              >
                <i class="fa fa-shopping-cart"></i>
              </router-link>
            </li>
            <li>
              <router-link
                to="/meus-produtos"
                class="icon-link"
                aria-label="Minha Conta"
              >
                <i class="fa fa-user-circle"></i>
              </router-link>
            </li>
            <li class="welcome-container">
              <span class="welcome-message"
                >Olá, {{ authStore.user?.name }}!</span
              >
              <button @click="authStore.logout" class="logout-btn">Sair</button>
            </li>
          </template>
          <template v-else>
            <li>
              <router-link to="/login" class="btn btn-secondary"
                >Entrar</router-link
              >
            </li>
            <li>
              <router-link to="/cadastro" class="btn btn-primary"
                >Cadastre-se</router-link
              >
            </li>
          </template>
        </ul>
      </div>
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
const router = useRouter();

const isCartOpen = ref(false);
const termoBusca = ref("");
const menuOpen = ref(false);
const isScrolled = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const openCart = () => {
  isCartOpen.value = true;
};
const closeCart = () => {
  isCartOpen.value = false;
};

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
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
:root {
  --cor-laranja-principal: #ff6600;
  --cor-laranja-hover: #e55b00;
}

.navbar {
  background-color: #000000;
  padding: 0 20px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  height: 80px;
  transition: height 0.4s ease, box-shadow 0.4s ease;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.navbar.navbar-scrolled {
  height: 70px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.navbar-logo {
  text-decoration: none;
  font-size: 1.8rem;
  font-weight: bold;
}

.logo-gear {
  color: #ff6600;
}

.logo-shop {
  color: #ffffff;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-links,
.auth-links {
  color: white;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 25px;
  margin: 0;
  padding: 0;
}

.nav-links li a {
  color: var(--vt-c-text-dark-1);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 4px;
  position: relative;
  transition: color 0.3s ease;
}

.nav-links li a::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--cor-laranja-principal);
  transition: width 0.3s ease;
}

.nav-links li a:hover {
  color: var(--vt-c-text-dark-1);
}

.nav-links li a:hover::after {
  width: 100%;
}

.search-container {
  margin: 0 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 5px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.search-bar:focus-within {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: var(--cor-laranja-principal);
}

.search-icon {
  color: #aaa;
  margin: 0 10px;
}

.search-bar input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--vt-c-text-dark-1);
  padding: 8px;
  width: 180px;
  font-size: 14px;
  transition: width 0.3s ease;
}

.search-bar input::placeholder {
  color: #aaa;
}
.search-bar input:focus {
  width: 250px;
}

.auth-links {
  gap: 15px;
}

.btn {
  padding: 10px 22px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  display: inline-block;
  border: 2px solid transparent;
  font-family: "Rajdhani", sans-serif;
}

.btn-primary {
  background-color: var(--cor-laranja-principal);
  color: white;
}
.btn-primary:hover {
  background-color: var(--cor-laranja-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px hsla(24, 100%, 50%, 0.3);
}

.btn-secondary {
  background-color: transparent;
  color: white;
  border-color: var(--color-border-hover);
}
.btn-secondary:hover {
  background-color: var(--cor-laranja-principal);
  border-color: var(--cor-laranja-principal);
  color: white;
}

.icon-link {
  color: var(--vt-c-text-dark-2);
  font-size: 1.5rem;
  transition: color 0.3s ease, transform 0.3s ease;
}
.icon-link:hover {
  color: var(--cor-laranja-principal);
  transform: scale(1.1);
}

.welcome-container {
  display: flex;
  align-items: center;
  gap: 15px;
}
.welcome-message {
  color: var(--vt-c-text-dark-2);
  white-space: nowrap;
}
.logout-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
  transition: color 0.3s ease;
  font-family: "Rajdhani", sans-serif;
}
.logout-btn:hover {
  color: var(--cor-laranja-principal);
}

.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
}

.hamburger span {
  display: block;
  width: 28px;
  height: 3px;
  margin: 6px 0;
  background-color: var(--vt-c-text-dark-1);
  border-radius: 3px;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.hamburger.open span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
}
.hamburger.open span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

@media (max-width: 1200px) {
  .nav-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 350px;
    height: 100vh;
    background-color: #1f211f;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
    transition: right 0.5s ease-in-out;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
  }

  .nav-menu.open {
    right: 0;
  }

  .nav-links,
  .auth-links {
    flex-direction: column;
    gap: 30px;
  }

  .nav-links li a,
  .auth-links li a {
    font-size: 1.2rem;
  }

  .welcome-container {
    flex-direction: column;
    text-align: center;
  }

  .hamburger {
    display: block;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    width: 100%;
  }
}
</style>
