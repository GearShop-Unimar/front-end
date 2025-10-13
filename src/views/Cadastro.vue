<template>
  <div class="cadastro-container">
    <h2>Crie sua Conta</h2>
    <form @submit.prevent="cadastrar">
      <input v-model="fullName" type="text" placeholder="Nome completo" required />
      <input v-model="cpf" type="text" placeholder="CPF (somente números)" required maxlength="11" />
      <input v-model="telefone" type="tel" placeholder="Telefone" required />

      <select v-model="estado" required>
        <option value="" disabled selected>Selecione o Estado</option>
        <option value="AC">Acre (AC)</option>
        <option value="AL">Alagoas (AL)</option>
        <option value="AP">Amapá (AP)</option>
        <option value="AM">Amazonas (AM)</option>
        <option value="BA">Bahia (BA)</option>
        <option value="CE">Ceará (CE)</option>
        <option value="DF">Distrito Federal (DF)</option>
        <option value="ES">Espírito Santo (ES)</option>
        <option value="GO">Goiás (GO)</option>
        <option value="MA">Maranhão (MA)</option>
        <option value="MT">Mato Grosso (MT)</option>
        <option value="MS">Mato Grosso do Sul (MS)</option>
        <option value="MG">Minas Gerais (MG)</option>
        <option value="PA">Pará (PA)</option>
        <option value="PB">Paraíba (PB)</option>
        <option value="PR">Paraná (PR)</option>
        <option value="PE">Pernambuco (PE)</option>
        <option value="PI">Piauí (PI)</option>
        <option value="RJ">Rio de Janeiro (RJ)</option>
        <option value="RN">Rio Grande do Norte (RN)</option>
        <option value="RS">Rio Grande do Sul (RS)</option>
        <option value="RO">Rondônia (RO)</option>
        <option value="RR">Roraima (RR)</option>
        <option value="SC">Santa Catarina (SC)</option>
        <option value="SP">São Paulo (SP)</option>
        <option value="SE">Sergipe (SE)</option>
        <option value="TO">Tocantins (TO)</option>
      </select>

      <input v-model="cidade" type="text" placeholder="Cidade" required />
      <input v-model="cep" type="text" placeholder="CEP" required maxlength="8" />
      <input v-model="rua" type="text" placeholder="Rua" required />
      <input v-model="numeroCasa" type="text" placeholder="Número da casa" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Senha (mínimo 6 caracteres)" required />
      <input v-model="confirmPassword" type="password" placeholder="Confirme sua senha" required />

      <p v-if="erro" class="erro">{{ erro }}</p>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Enviando...' : 'Cadastrar' }}
      </button>

      <p class="link">
        Já tem uma conta? <router-link class="to-login" to="/login">Faça login</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const fullName = ref('')
const cpf = ref('')
const telefone = ref('')
const estado = ref('')
const cidade = ref('')
const cep = ref('')
const rua = ref('')
const numeroCasa = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const erro = ref('')
const loading = ref(false)

const router = useRouter()

const validarCPF = (cpfStr) => /^\d{11}$/.test(cpfStr)
const validarCEP = (cepStr) => /^\d{8}$/.test(cepStr)

const cadastrar = async () => {
  erro.value = ''

  if (!validarCPF(cpf.value)) {
    erro.value = 'CPF inválido. Informe 11 números.'
    return
  }

  if (!validarCEP(cep.value)) {
    erro.value = 'CEP inválido. Informe 8 números.'
    return
  }

  if (!email.value.includes('@')) {
    erro.value = 'Digite um e-mail válido.'
    return
  }

  if (password.value.length < 6) {
    erro.value = 'A senha deve ter pelo menos 6 caracteres.'
    return
  }

  if (password.value !== confirmPassword.value) {
    erro.value = 'As senhas não coincidem.'
    return
  }

  loading.value = true

  try {

    alert('Conta criada com sucesso!')
    router.push('/login')
  } catch (error) {
    console.error('Erro ao cadastrar:', error)
    erro.value = 'Erro ao criar conta. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.cadastro-container {
  max-width: 500px;
  margin: 100px auto;
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #222;
}

input, select {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
}

button {
  width: 100%;
  background-color: #ff6600;
  color: #fff;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #000000;
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.link {
  font-size: 14px;
  text-align: center;
  margin-top: 15px;
  color: #000000;
}

.to-login {
  text-decoration: none;
}

.erro {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
}
</style>
