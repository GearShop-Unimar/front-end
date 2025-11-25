<template>
  <div class="login-container">
    <div class="left-column">
      <img src="@/assets/img/Logo.png" alt="Logo GearShop" class="logo-image" />
    </div>

    <div class="right-column">
      <form @submit.prevent="login">
        <h2 class="mobile-logo">
          <span class="gear-logo">Gear</span><span class="shop-logo">Shop</span>
        </h2>

        <div class="input-group">
          <label for="email">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Seu email"
            required
          />
        </div>

        <div class="input-group">
          <label for="password">Senha</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Sua senha"
            required
          />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>

        <p class="link">
          Esqueceu a senha? <a href="#">Clique aqui</a><br />
          <router-link to="/cadastro" class="btn-cadastrar"
            >Cadastre-se</router-link
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";

const authStore = useAuthStore();
const toast = useToast();

const email = ref("");
const password = ref("");
const loading = ref(false);

const login = async () => {
  loading.value = true;
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    toast.error("Credenciais inválidas. Tente novamente.");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 1300px;
  width: 100%;
  min-height: 850px;
  margin: 100px auto;
  background: var(--color-card-background);
  box-shadow: 0 8px 30px var(--color-card-shadow);
  display: flex;
  overflow: hidden;
}

.left-column {
  flex: 1;
  background: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;
}

.logo-image {
  width: 450px; /* Ajuste o tamanho conforme necessário */
  height: auto;
  margin-bottom: 20px; /* Espaçamento entre a imagem e o título */
}

.right-column {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.slogan {
  font-size: 1.2rem;
  color: var(--color-text);
  margin-top: 10px;
  text-align: center;
}

.right-column h2 {
  display: none;
}

.mobile-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.mobile-logo .logo-image {
  width: 100px;
  margin-right: 10px;
  margin-bottom: 0;
}

.input-group label {
  display: block;
  margin-top: 15px;
  margin-bottom: 5px;
  font-weight: 600;
  color: var(--color-heading);
  font-size: 0.95em;
}

h2 {
  font-size: 3rem;
  font-weight: bold;
}

.gear-logo {
  color: var(--color-primary);
}

.shop-logo {
  color: var(--color-heading);
}

input {
  box-sizing: border-box;
  border-radius: 12px;
  width: 100%;
  padding: 14px;
  margin-bottom: 0;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 16px;
  border: 1px solid var(--color-border);
}

input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px hsla(24, 100%, 50%, 0.15);
}

form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

button {
  background-color: var(--color-primary);
  color: #fff;
  padding: 14px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 25px;
  border-radius: 15px;
  border: none;
}

button:hover:not([disabled]) {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

.link {
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
  color: var(--color-text);
}

.link a {
  color: var(--color-primary);
  text-decoration: none;
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cadastrar {
  display: block;
  background-color: transparent;
  color: var(--color-primary);
  padding: 14px;
  text-decoration: none;
  margin-top: 10px;
  font-weight: bold;
  border-radius: 15px;
  transition: all 0.2s ease;
}

.btn-cadastrar:hover {
  background-color: var(--color-primary);
  color: #fff;
}

@media (max-width: 900px) {
  .login-container {
    min-height: 650px;
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    max-width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    box-shadow: none;
  }
  .left-column {
    display: none;
  }
  .right-column {
    padding: 40px 20px;
    flex: none;
    width: 100%;
  }
  .right-column h2 {
    display: none; /* Oculta o h2 principal no mobile */
  }
  .mobile-logo {
    display: flex; /* Exibe a div do logo mobile */
  }
}

@media (max-width: 480px) {
  .right-column {
    padding: 20px 10px;
  }
  .right-column h2 {
    font-size: 2.5rem;
  }
  .link,
  .input-group label {
    font-size: 16px;
  }
}
</style>
