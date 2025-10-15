<template>
  <div class="cadastro-container">
    <h2>Crie sua Conta</h2>
    <form @submit.prevent="cadastrar">
      <fieldset>
        <legend>Dados Pessoais</legend>
        <input
          v-model="fullName"
          type="text"
          placeholder="Nome completo"
          required
        />
        <input
          v-model="cpf"
          type="text"
          placeholder="CPF (apenas números)"
          @input="maskCPF"
          maxlength="14"
          required
        />
        <input
          v-model="telefone"
          type="tel"
          placeholder="Telefone (XX) XXXXX-XXXX"
          @input="maskTelefone"
          maxlength="15"
          required
        />
      </fieldset>

      <fieldset>
        <legend>Endereço</legend>
        <input
          v-model="cep"
          type="text"
          placeholder="CEP (00000-000)"
          @input="maskCEP"
          @blur="buscarEndereco"
          maxlength="9"
          required
        />

        <select v-model="estado" required>
          <option value="" disabled selected>Selecione o Estado</option>
          <option
            v-for="uf in estadosBrasileiros"
            :key="uf.sigla"
            :value="uf.sigla"
          >
            {{ uf.nome }} ({{ uf.sigla }})
          </option>
        </select>
        <input
          v-model="cidade"
          type="text"
          placeholder="Cidade"
          required
          :disabled="enderecoBuscado"
        />
        <input
          v-model="rua"
          type="text"
          placeholder="Rua / Logradouro"
          required
          :disabled="enderecoBuscado"
        />
        <input
          v-model="numeroCasa"
          type="text"
          placeholder="Número da casa"
          required
        />
      </fieldset>

      <fieldset>
        <legend>Dados de Acesso</legend>
        <input v-model="email" type="email" placeholder="Email" required />

        <div class="password-field">
          <input
            v-model="password"
            :type="passwordFieldType"
            placeholder="Senha (mínimo 6 caracteres)"
            required
          />
          <i :class="passwordIconClass" @click="togglePasswordVisibility"></i>
        </div>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirme sua senha"
          required
        />
      </fieldset>

      <p v-if="erro" class="erro">{{ erro }}</p>

      <button type="submit" :disabled="loading">
        {{ loading ? "Enviando..." : "Cadastrar" }}
      </button>

      <p class="link">
        Já tem uma conta?
        <router-link class="to-login" to="/login">Faça login</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const estadosBrasileiros = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

const fullName = ref("");
const cpf = ref("");
const telefone = ref("");
const estado = ref("");
const cidade = ref("");
const cep = ref("");
const rua = ref("");
const numeroCasa = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const erro = ref("");
const loading = ref(false);
const enderecoBuscado = ref(false);
const passwordVisible = ref(false);

const router = useRouter();

const passwordFieldType = computed(() =>
  passwordVisible.value ? "text" : "password"
);
const passwordIconClass = computed(() =>
  passwordVisible.value ? "fa fa-eye-slash" : "fa fa-eye"
);
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const onlyNumbers = (str) => str.replace(/\D/g, "");

const maskCPF = () => {
  let val = onlyNumbers(cpf.value);
  if (val.length > 11) val = val.substring(0, 11);
  val = val.replace(/(\d{3})(\d)/, "$1.$2");
  val = val.replace(/(\d{3})(\d)/, "$1.$2");
  val = val.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  cpf.value = val;
};

const maskCEP = () => {
  let val = onlyNumbers(cep.value);
  if (val.length > 8) val = val.substring(0, 8);
  val = val.replace(/^(\d{5})(\d)/, "$1-$2");
  cep.value = val;
};

const maskTelefone = () => {
  let val = onlyNumbers(telefone.value);
  if (val.length > 11) val = val.substring(0, 11);
  val = val.replace(/^(\d{2})(\d)/g, "($1) $2");
  val = val.replace(/(\d{5})(\d)/, "$1-$2");
  telefone.value = val;
};

const buscarEndereco = async () => {
  const cepLimpo = onlyNumbers(cep.value);
  if (cepLimpo.length !== 8) {
    enderecoBuscado.value = false;
    return;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (!data.erro) {
      cidade.value = data.localidade;
      rua.value = data.logradouro;
      estado.value = data.uf;
      enderecoBuscado.value = true;
    } else {
      enderecoBuscado.value = false;
      cidade.value = "";
      rua.value = "";
      erro.value = "CEP não encontrado. Preencha o endereço manualmente.";
    }
  } catch (error) {
    enderecoBuscado.value = false;
    console.error("Erro na busca de CEP:", error);
  }
};

const validarCPF = (cpfStr) => onlyNumbers(cpfStr).length === 11;
const validarCEP = (cepStr) => onlyNumbers(cepStr).length === 8;

const cadastrar = async () => {
  erro.value = "";

  if (!validarCPF(cpf.value)) {
    erro.value = "CPF inválido. O campo deve ter 11 números.";
    return;
  }

  if (!validarCEP(cep.value)) {
    erro.value = "CEP inválido. O campo deve ter 8 números.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    erro.value = "As senhas não coincidem.";
    return;
  }

  loading.value = true;

  const cepLimpo = onlyNumbers(cep.value);
  const cpfLimpo = onlyNumbers(cpf.value);
  const telefoneLimpo = onlyNumbers(telefone.value);

  const userData = {
    Name: fullName.value,
    Email: email.value,
    Password: password.value,
    passconfirm: confirmPassword.value,
    PhoneNumber: telefoneLimpo,
    ProfilePicture: "https://example.com/default-profile.png",
    Cpf: cpfLimpo,
    Estado: estado.value,
    Cidade: cidade.value,
    Cep: cepLimpo,
    Rua: rua.value,
    NumeroCasa: numeroCasa.value,
  };

  console.log("Iniciando cadastro...");
  console.log("Dados a serem enviados:", userData);

  try {
    const API_URL = "http://localhost:5282/api/User";

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("Resposta da API recebida. Status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Cadastro realizado com sucesso! Dados do usuário:", data);
      alert("Conta criada com sucesso!");
      router.push("/login");
    } else {
      const errorData = await response.json();
      console.error("Erro ao cadastrar. Detalhes do Erro:", errorData);

      if (errorData.errors) {
        const errorMessages = Object.entries(errorData.errors)
          .map(([key, messages]) => `${key}: ${messages.join("; ")}`)
          .join(" | ");

        erro.value = `Erros de validação: ${errorMessages}`;
      } else {
        erro.value = `Erro ao criar conta. Status: ${
          response.status
        }. Detalhes: ${errorData.title || JSON.stringify(errorData)}`;
      }
    }
  } catch (error) {
    console.error("Erro de conexão ou requisição (fetch error):", error);
    erro.value = "Erro de rede. Verifique se a API está online.";
  } finally {
    loading.value = false;
    console.log("Processo de cadastro finalizado.");
  }
};
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
  font-family: "Arial", sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #222;
}

input,
select {
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

/* Estilos Adicionais para as Melhorias */

fieldset {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
}

legend {
  font-weight: bold;
  color: #ff6600;
  padding: 0 10px;
  font-size: 1.1em;
}

/* Campo de Senha com Ícone */
.password-field {
  position: relative;
  margin-bottom: 15px;
}

.password-field input {
  /* Garante que o input preencha o div pai */
  margin-bottom: 0;
}

.password-field i {
  position: absolute;
  top: 15px;
  right: 15px;
  color: #888;
  cursor: pointer;
}
</style>
