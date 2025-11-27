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

// --- Dados Estáticos ---
const estadosBrasileiros = [
  // Lista de objetos { sigla: 'UF', nome: 'Estado' } para o <select>
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

// --- Estado do Formulário (Reativo) ---
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
const erro = ref(""); // Mensagem de erro exibida ao usuário
const loading = ref(false); // Indica o estado de envio do formulário
const enderecoBuscado = ref(false); // Indica se o endereço foi preenchido pelo ViaCEP
const passwordVisible = ref(false); // Controla a visibilidade da senha

const router = useRouter(); // Instância para navegação após o cadastro

// --- Lógica de Senha (Computed) ---
// Alterna o tipo do campo de senha (text/password)
const passwordFieldType = computed(() =>
  passwordVisible.value ? "text" : "password"
);
// Alterna o ícone de visibilidade (olho aberto/fechado)
const passwordIconClass = computed(() =>
  passwordVisible.value ? "fa fa-eye-slash" : "fa fa-eye"
);
// Alterna o estado de visibilidade da senha
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

// --- Funções Utilitárias e Máscaras ---
// Remove todos os caracteres não numéricos de uma string
const onlyNumbers = (str) => str.replace(/\D/g, "");

// Aplica a máscara de CPF (000.000.000-00)
const maskCPF = () => {
  let val = onlyNumbers(cpf.value);
  if (val.length > 11) val = val.substring(0, 11);
  val = val.replace(/(\d{3})(\d)/, "$1.$2");
  val = val.replace(/(\d{3})(\d)/, "$1.$2");
  val = val.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  cpf.value = val;
};

// Aplica a máscara de CEP (00000-000)
const maskCEP = () => {
  let val = onlyNumbers(cep.value);
  if (val.length > 8) val = val.substring(0, 8);
  val = val.replace(/^(\d{5})(\d)/, "$1-$2");
  cep.value = val;
};

// Aplica a máscara de Telefone (XX) XXXXX-XXXX
const maskTelefone = () => {
  let val = onlyNumbers(telefone.value);
  if (val.length > 11) val = val.substring(0, 11);
  val = val.replace(/^(\d{2})(\d)/g, "($1) $2");
  val = val.replace(/(\d{5})(\d)/, "$1-$2");
  telefone.value = val;
};

// Busca o endereço automaticamente usando o CEP (ViaCEP)
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
      // Preenche os campos do endereço e marca como buscado
      cidade.value = data.localidade;
      rua.value = data.logradouro;
      estado.value = data.uf;
      enderecoBuscado.value = true;
      erro.value = "";
    } else {
      // Limpa os campos e permite preenchimento manual
      enderecoBuscado.value = false;
      cidade.value = "";
      rua.value = "";
      erro.value = "CEP não encontrado. Preencha o endereço manualmente.";
    }
  } catch (error) {
    enderecoBuscado.value = false;
    console.error("Erro na busca de CEP:", error);
    erro.value = "Erro de rede ao buscar CEP.";
  }
};

// Funções de Validação
const validarCPF = (cpfStr) => onlyNumbers(cpfStr).length === 11;
const validarCEP = (cepStr) => onlyNumbers(cepStr).length === 8;

// --- Envio do Formulário ---
// Lógica principal de validação e envio dos dados de cadastro
const cadastrar = async () => {
  erro.value = ""; // Limpa erros anteriores

  // 1. Validações locais
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

  loading.value = true; // Ativa o estado de carregamento

  // 2. Limpeza dos dados para envio (apenas números)
  const cepLimpo = onlyNumbers(cep.value);
  const cpfLimpo = onlyNumbers(cpf.value);
  const telefoneLimpo = onlyNumbers(telefone.value);

  // 3. Montagem do payload (dados a serem enviados para o Backend)
  const userData = {
    Name: fullName.value,
    Email: email.value,
    Password: password.value,
    passconfirm: confirmPassword.value, // Nome do campo conforme o DTO do Backend
    PhoneNumber: telefoneLimpo,
    ProfilePicture: "https://example.com/default-profile.png", // Valor padrão
    Cpf: cpfLimpo,
    Estado: estado.value,
    Cidade: cidade.value,
    Cep: cepLimpo,
    Rua: rua.value,
    NumeroCasa: numeroCasa.value,
  };

  try {
    const API_URL = "http://localhost:5282/api/User"; // Endpoint do Backend

    // 4. Envio dos dados via Fetch API (POST)
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      // Sucesso
      alert("Conta criada com sucesso!");
      router.push("/login"); // Redireciona para a tela de login
    } else {
      // Falha (erros de validação ou servidor)
      const errorData = await response.json();

      // Tenta extrair erros de validação do formato ModelState (ASP.NET Core)
      if (errorData.errors) {
        const errorMessages = Object.entries(errorData.errors)
          .map(([key, messages]) => `${key}: ${messages.join("; ")}`)
          .join(" | ");

        erro.value = `Erros de validação: ${errorMessages}`;
      } else {
        // Erro geral do servidor
        erro.value = `Erro ao criar conta. Status: ${
          response.status
        }. Detalhes: ${errorData.title || JSON.stringify(errorData)}`;
      }
    }
  } catch (error) {
    // Erro de rede (falha na comunicação)
    console.error("Erro de conexão ou requisição:", error);
    erro.value = "Erro de rede. Verifique se a API está online.";
  } finally {
    loading.value = false; // Desativa o carregamento
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

.password-field {
  position: relative;
  margin-bottom: 15px;
}

.password-field input {
  margin-bottom: 0;
}

.password-field i {
  position: absolute;
  top: 15px;
  right: 15px;
  color: #888;
  cursor: pointer;
}

@media (max-width: 600px) {
  .cadastro-container {
    max-width: 100%;
    margin: 0;
    padding: 20px;
    border-radius: 0;
    box-shadow: none;
    min-height: 100vh;
  }
}

@media (max-width: 400px) {
  .cadastro-container {
    padding: 15px;
  }
  h2 {
    font-size: 1.8em;
  }
  input,
  select,
  button {
    font-size: 15px;
    padding: 10px;
  }
}
</style>
