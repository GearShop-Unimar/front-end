<template>
  <div class="login-container">
    <div class="left-column">
      <h2>
        <span class="gear-logo">Gear</span><span class="shop-logo">Shop</span>
      </h2>
      <p class="slogan">A sua loja de tecnologia favorita!</p>
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

        <p v-if="erro" class="erro-mensagem">{{ erro }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>

        <p class="link">
          Esqueceu a senha? <a href="#">Clique aqui</a><br />
          Ainda não tem uma conta?
          <router-link to="/cadastro">Cadastre-se</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const erro = ref("");
const loading = ref(false);

const login = async () => {
  erro.value = "";
  loading.value = true;
  console.log("Tentativa de Login iniciada via store.");

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });

    console.log("Processo de Login via store finalizado com sucesso.");
  } catch (error) {
    console.error("Erro retornado pelo store:", error.message);
    erro.value = "Credenciais inválidas. Tente novamente.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 1300px;
  width: 90%;
  min-height: 800px;
  height: auto;
  margin: 100px auto;
  padding: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  font-family: "Rajdhani", sans-serif;
  display: flex;
  overflow: hidden;
}

.left-column {
  flex: 1;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  border-right: 1px solid #eee;
  text-align: center;
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
  color: #666;
  margin-top: 10px;
  text-align: center;
}

.right-column h2 {
  display: none;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    max-width: 480px;
    min-height: auto;
    margin: 50px auto;
    padding: 40px;
  }

  .left-column {
    display: none;
  }

  .right-column {
    padding: 0;
  }

  .right-column h2 {
    display: block;
    margin-bottom: 30px;
    text-align: center;
  }
}

.input-group {
  width: 100%;
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #444;
  font-size: 0.95em;
}

h2 {
  font-size: 3rem;
  font-weight: bold;
}

.gear-logo {
  color: #ff6600;
}

.shop-logo {
  color: #000;
}

input {
  width: 100%;
  padding: 14px;
  margin-bottom: 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

button {
  background-color: #000;
  color: #fff;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  margin-top: 10px;
}

button:hover {
  background-color: #333;
}

.link {
  font-size: 14px;
  text-align: center;
  margin-top: 20px;
}

.erro-mensagem {
  color: red;
  font-size: 0.95em;
  text-align: center;
  margin-bottom: 15px;
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
