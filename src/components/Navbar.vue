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
          <li><router-link to="/posts">Posts</router-link></li>
          <li><router-link to="/produtos">Produtos</router-link></li>
          <li><router-link to="/anunciar">Anunciar</router-link></li>
          <li>
            <router-link to="/fidelidade">Fidelidade</router-link>
          </li>
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
                @click="isCartOpen = true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-shopping-cart"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path
                    d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                  ></path>
                </svg>
              </router-link>
            </li>
            <li>
              <router-link to="/perfil" class="icon-link" aria-label="Perfil">
                <template v-if="userPhoto">
                  <img
                    :src="userPhoto"
                    alt="Foto de perfil"
                    class="profile-photo"
                  />
                </template>
                <template v-else>
                  <i class="fa fa-user-circle"></i>
                </template>
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

          <li>
            <button @click="themeStore.toggleTheme" class="theme-toggle-btn">
              <i v-if="themeStore.isDarkMode" class="bi bi-sun-fill"></i>
              <i v-else class="bi bi-moon-stars-fill"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <Carrinho :isOpen="isCartOpen" @close="closeCart" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import Carrinho from "@/components/Carrinho.vue";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";

const authStore = useAuthStore();
const themeStore = useThemeStore();
const router = useRouter();

// URL base da API
const API_URL = import.meta.env.VITE_API_URL || "";

/**
 * @description Propriedade computada para determinar a URL da foto de perfil do usuário.
 * Usa o campo `Avatar` fornecido pelo backend.
 */
const userPhoto = computed(() => {
  const u = authStore.user;
  if (!u) return null;

  // ✅ CORREÇÃO: Usamos o campo 'Avatar' (ou o campo que contém a URL/URI)
  const avatarUrl = u.Avatar;

  if (avatarUrl) {
    // 1. Se for uma URL completa (começa com http/https)
    if (/^https?:\/\//i.test(avatarUrl)) {
      return avatarUrl;
    }

    // 2. Se for um caminho relativo, anexamos à API_URL
    const baseApi = API_URL.replace(/\/$/, ""); // Garante que não termina em '/'
    const cleanAvatarPath = avatarUrl.replace(/^\//, ""); // Garante que não começa com '/'

    return `${baseApi}/${cleanAvatarPath}`;
  }

  // 3. Fallback: Se não houver 'Avatar', mas houver o ID, tenta um caminho padrão
  if (u.id) {
    // Ex: http://api.gearshop.com/images/user/123
    return `${API_URL.replace(/\/$/, "")}/images/user/${u.id}`;
  }

  return null;
});

const isCartOpen = ref(false);
const termoBusca = ref("");
const menuOpen = ref(false);
const isScrolled = ref(false);

/**
 * @description Alterna o estado do menu hambúrguer.
 */
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

/**
 * @description Fecha o componente do carrinho (se for um modal/sidebar).
 */
const closeCart = () => {
  isCartOpen.value = false;
};

/**
 * @description Redireciona para a página de produtos com o termo de busca.
 */
const pesquisar = () => {
  if (termoBusca.value.trim()) {
    router.push({
      name: "Produtos", // Garanta que este é o nome correto da rota
      query: { busca: termoBusca.value.trim() },
    });
    termoBusca.value = "";
    // Fecha o menu após a busca em mobile
    menuOpen.value = false;
  }
};

/**
 * @description Atualiza o estado de rolagem para aplicar estilos na navbar.
 */
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

/**
 * @description Adiciona o listener de scroll ao montar o componente.
 */
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

/**
 * @description Remove o listener de scroll ao desmontar o componente para evitar vazamento de memória.
 */
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
/* * ESTILOS DE BARRA DE NAVEGAÇÃO
 * Mantidos inalterados do seu código original,
 * pois o foco foi na lógica do JavaScript.
 */
.navbar {
  background-color: var(--color-navbar-background);
  padding: 0 20px;
  position: sticky;
  width: 100%;
  top: 0;
  z-index: 1000;
  height: 80px;
  transition: height 0.4s ease, box-shadow 0.4s ease, background-color 0.3s ease;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px var(--color-card-shadow);
}

.navbar.navbar-scrolled {
  height: 70px;
  box-shadow: 0 4px 15px var(--color-card-shadow);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  height: 150px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.navbar-logo {
  text-decoration: none;
  font-size: 2.8rem;
  font-weight: bold;
}

.logo-gear {
  color: var(--color-primary);
}

.logo-shop {
  color: var(--color-heading);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-links,
.auth-links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 25px;
  margin: 0;
  padding: 0;
}

.nav-links li a {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.5rem;
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
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.nav-links li a:hover {
  color: var(--color-heading);
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
  background-color: var(--color-background-mute);
  border-radius: 25px;
  padding: 5px;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.search-bar:focus-within {
  background-color: var(--color-background);
  border-color: var(--color-primary);
}

.search-icon {
  color: var(--color-text);
  opacity: 0.6;
  margin: 0 10px;
}

.search-bar input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text);
  padding: 8px;
  width: 180px;
  font-size: 1.5rem;
  transition: width 0.3s ease;
}

.search-bar input::placeholder {
  color: var(--color-text);
  opacity: 0.7;
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
  font-size: 1.5rem;
  transition: all 0.3s ease;
  display: inline-block;
  border: 2px solid transparent;
  font-family: "Rajdhani", sans-serif;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}
.btn-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px hsla(24, 100%, 50%, 0.3);
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-heading);
  border-color: var(--color-border-hover);
}
.btn-secondary:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.icon-link {
  color: var(--color-text);
  font-size: 1.5rem;
  transition: color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
}
.icon-link:hover {
  color: var(--color-primary);
  transform: scale(1.1);
}

.profile-photo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  display: inline-block;
}

.welcome-container {
  display: flex;
  align-items: center;
  gap: 15px;
}
.welcome-message {
  color: var(--color-text);
  white-space: nowrap;
  font-size: 1.5rem;
}
.logout-btn {
  background: none;
  border: none;
  color: var(--color-text);
  opacity: 0.7;
  cursor: pointer;
  font-size: 1.5rem;
  text-decoration: underline;
  transition: color 0.3s ease;
  font-family: "Rajdhani", sans-serif;
}
.logout-btn:hover {
  color: var(--color-primary);
}

.theme-toggle-btn {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease, transform 0.3s ease;
}

.theme-toggle-btn:hover {
  color: var(--color-primary);
  transform: scale(1.1);
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
  background-color: var(--color-heading);
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
    background-color: var(--color-background-soft);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
    transition: right 0.5s ease-in-out;
    box-shadow: -5px 0 15px var(--color-card-shadow);
  }

  .nav-menu.open {
    right: 0;
  }

  .nav-links,
  .auth-links {
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }

  .nav-links li a,
  .auth-links li a {
    font-size: 1.5rem;
  }

  .welcome-container {
    flex-direction: column;
    text-align: center;
  }

  .hamburger {
    display: block;
  }
}

@media (max-width: 768px) {
  .navbar-logo {
    font-size: 2rem;
  }

  .navbar {
    padding: 0 15px;
  }

  .nav-links li a,
  .auth-links li a,
  .welcome-message,
  .logout-btn,
  .btn {
    font-size: 1.4rem;
  }

  .search-bar input {
    width: 150px;
    font-size: 1.4rem;
  }
  .search-bar input:focus {
    width: 200px;
  }

  .btn {
    padding: 8px 18px;
  }

  .icon-link,
  .theme-toggle-btn {
    font-size: 1.4rem;
  }
  .profile-photo {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 600px) {
  .navbar-logo {
    font-size: 1.8rem;
  }

  .search-container {
    width: 80%;
  }

  .nav-menu.open .search-bar input {
    width: 90%;
    max-width: 250px;
  }
  .nav-menu.open .search-bar input:focus {
    width: 90%;
  }

  .nav-menu {
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    width: 100%;
  }
}
</style>
