<template>
  <form @submit.prevent="submitForm" class="form-pagamento">
    <div class="form-group">
      <label for="nomeCartao">Nome no cartão</label>
      <input
        v-model="nomeCartao"
        id="nomeCartao"
        type="text"
        placeholder="Nome completo"
        required
      />
    </div>
    <div class="form-group">
      <label for="numeroCartao">Número do cartão</label>
      <div class="input-com-bandeira">
        <input
          v-model="numeroCartao"
          id="numeroCartao"
          type="tel"
          inputmode="numeric"
          placeholder="xxxx xxxx xxxx xxxx"
          maxlength="19"
          @input="formatarCartao"
          required
        />
        <img
          v-if="bandeiraCartao"
          :src="bandeiraCartao"
          alt="Bandeira do Cartão"
          class="bandeira-cartao-input"
        />
      </div>
    </div>
    <div class="linha">
      <div class="form-group metade">
        <label for="mesValidade">Mês</label>
        <input
          v-model="mesValidade"
          id="mesValidade"
          type="text"
          placeholder="MM"
          maxlength="2"
          inputmode="numeric"
          @input="formatarMes"
          required
        />
      </div>
      <div class="form-group metade">
        <label for="anoValidade">Ano</label>
        <input
          v-model="anoValidade"
          id="anoValidade"
          type="text"
          placeholder="AA"
          maxlength="2"
          inputmode="numeric"
          @input="formatarAno"
          required
        />
      </div>
      <div class="form-group metade">
        <label for="cvv"
          >CVV
          <span
            class="tooltip-cvv"
            title="Código de segurança de 3 dígitos no verso do cartão."
            >?</span
          ></label
        >
        <input
          v-model="cvv"
          id="cvv"
          type="text"
          placeholder="123"
          maxlength="4"
          inputmode="numeric"
          required
        />
      </div>
    </div>
    <div class="form-group">
      <label for="cpfTitular">CPF do titular</label>
      <input
        v-model="cpfTitular"
        id="cpfTitular"
        type="text"
        placeholder="000.000.000-00"
        maxlength="14"
        @input="formatarCPF"
        required
      />
    </div>
    <p v-if="erro" class="erro">{{ erro }}</p>
    <button type="submit" :disabled="loading || !formularioValido">
      {{ loading ? "Processando..." : "Pagar com Cartão" }}
    </button>
  </form>
</template>

<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["submit"]);

const nomeCartao = ref("");
const numeroCartao = ref("");
const mesValidade = ref("");
const anoValidade = ref("");
const cvv = ref("");
const cpfTitular = ref("");
const erro = ref("");
const loading = ref(false);

const bandeiraCartao = computed(() => {
  const num = numeroCartao.value.replace(/\s/g, "");
  if (num.length >= 4) {
    if (num.startsWith("4")) return "https://img.icons8.com/color/48/visa.png";
    if (num.startsWith("5"))
      return "https://img.icons8.com/color/48/mastercard.png";
  }
  return null;
});

const formatarCartao = () => {
  let num = numeroCartao.value.replace(/\D/g, "").slice(0, 16);
  numeroCartao.value = num.replace(/(.{4})/g, "$1 ").trim();
};

const formatarMes = () => {
  mesValidade.value = mesValidade.value.replace(/\D/g, "").slice(0, 2);
};

const formatarAno = () => {
  anoValidade.value = anoValidade.value.replace(/\D/g, "").slice(0, 2);
};

const formatarCPF = () => {
  let cpf = cpfTitular.value.replace(/\D/g, "").slice(0, 11);
  if (cpf.length > 9) {
    cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  } else if (cpf.length > 6) {
    cpf = cpf.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
  } else if (cpf.length > 3) {
    cpf = cpf.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
  }
  cpfTitular.value = cpf;
};

const validarNumeroCartao = (num) => /^\d{16}$/.test(num.replace(/\s/g, ""));
const validarCVV = (cvv) => /^\d{3,4}$/.test(cvv);
const validarCPF = (cpf) => /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(cpf);

const validarValidade = (mes, ano) => {
  if (!/^\d{2}$/.test(mes) || !/^\d{2}$/.test(ano)) return false;
  const mesNum = parseInt(mes);
  const anoNum = parseInt("20" + ano);
  if (mesNum < 1 || mesNum > 12) return false;
  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();
  const mesAtual = dataAtual.getMonth() + 1;
  if (anoNum < anoAtual) return false;
  if (anoNum === anoAtual && mesNum < mesAtual) return false;
  return true;
};

const formularioValido = computed(() => {
  return (
    nomeCartao.value.length > 0 &&
    validarNumeroCartao(numeroCartao.value) &&
    validarCVV(cvv.value) &&
    validarCPF(cpfTitular.value) &&
    mesValidade.value.length === 2 &&
    anoValidade.value.length === 2
  );
});

const submitForm = () => {
  erro.value = "";
  if (!formularioValido.value) {
    erro.value = "Preencha todos os campos corretamente.";
    return;
  }
  if (!validarValidade(mesValidade.value, anoValidade.value)) {
    erro.value = "Validade do cartão expirada ou inválida.";
    return;
  }
  loading.value = true;
  emit("submit");
};
</script>

<style scoped>
.form-pagamento .form-group {
  margin-bottom: 18px;
  position: relative;
}
.form-pagamento label {
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--color-heading);
  font-size: 14px;
  display: block;
}
.form-pagamento input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: var(--color-background);
  color: var(--color-text);
}
.form-pagamento input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px hsla(24, 100%, 50%, 0.15);
  outline: none;
}
.input-com-bandeira {
  position: relative;
  display: block;
}
.bandeira-cartao-input {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  pointer-events: none;
}
.linha {
  display: flex;
  gap: 15px;
}
.linha .form-group {
  flex: 1;
  min-width: 0;
}
.tooltip-cvv {
  cursor: pointer;
  margin-left: 5px;
  color: var(--color-text);
  font-weight: bold;
  font-size: 12px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  padding: 0 5px;
  display: inline-block;
  line-height: 16px;
}
button {
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  background-color: var(--color-primary);
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}
button:hover:not([disabled]) {
  background-color: var(--color-primary-hover);
}
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.erro {
  color: #d9534f;
  background-color: #fbebeb;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 15px;
  font-size: 14px;
  border: 1px solid #ebccd1;
}
</style>
