<template>
  <div class="pagamento-page">
    <div class="pagamento-card">
      <div class="header-pagamento">
        <h2>Pagamento Seguro 🔒</h2>
        <div class="selo-seguranca">
            <span class="secure-text">Compra 100% Segura</span>
        </div>
      </div>

      <p class="total">Total a pagar: <strong>R$ {{ total.toFixed(2).replace('.', ',') }}</strong></p>

      <form @submit.prevent="processarPagamento" class="form-pagamento">
        
        <div class="form-group">
          <label for="nomeCartao">Nome no cartão</label>
          <input v-model="nomeCartao" id="nomeCartao" type="text" placeholder="Nome completo" required />
        </div>

        <div class="form-group">
          <label for="numeroCartao">Número do cartão</label>
          <div class="input-com-bandeira">
              <input v-model="numeroCartao" id="numeroCartao" type="tel" inputmode="numeric" placeholder="xxxx xxxx xxxx xxxx" maxlength="19"
                @input="formatarCartao" required />
              <img v-if="bandeiraCartao" :src="bandeiraCartao" alt="Bandeira do Cartão" class="bandeira-cartao-input">
          </div>
        </div>

        <div class="linha">
          <div class="form-group metade">
            <label for="mesValidade">Mês</label>
            <input v-model="mesValidade" id="mesValidade" type="text" placeholder="MM" maxlength="2" inputmode="numeric" @input="formatarMes" required />
          </div>
          <div class="form-group metade">
            <label for="anoValidade">Ano</label>
            <input v-model="anoValidade" id="anoValidade" type="text" placeholder="AA" maxlength="2" inputmode="numeric" @input="formatarAno" required />
          </div>
          <div class="form-group metade">
            <label for="cvv">CVV 
                <span class="tooltip-cvv" title="Código de segurança, geralmente 3 dígitos no verso do cartão.">?</span>
            </label>
            <input v-model="cvv" id="cvv" type="text" placeholder="123" maxlength="4" inputmode="numeric" required />
          </div>
        </div>

        <div class="form-group">
          <label for="cpfTitular">CPF do titular (igual ao nome no cartão)</label>
          <input v-model="cpfTitular" id="cpfTitular" type="text" placeholder="000.000.000-00" maxlength="14"
            @input="formatarCPF" required />
        </div>

        <p v-if="erro" class="erro">{{ erro }}</p>

        <button type="submit" :disabled="loading || !formularioValido">
          {{ loading ? 'Processando...' : 'Pagar Agora' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// Mocado os produtos do carrinho
const produtos = ref([
  { nome: 'Produto 1', preco: 50 },
  { nome: 'Produto 2', preco: 30 },
]);

const total = computed(() => produtos.value.reduce((acc, p) => acc + p.preco, 0));

const nomeCartao = ref('')
const numeroCartao = ref('')
const mesValidade = ref('') 
const anoValidade = ref('') 
const cvv = ref('')
const cpfTitular = ref('')
const erro = ref('')
const loading = ref(false)
const router = useRouter()

const bandeiraCartao = computed(() => {
    const num = numeroCartao.value.replace(/\s/g, '')
    if (num.length >= 4) {
        if (num.startsWith('4')) return 'https://img.icons8.com/color/48/visa.png'
        if (num.startsWith('5')) return 'https://img.icons8.com/color/48/mastercard.png' 
    }
    return null
})


const formatarCartao = () => {
  let num = numeroCartao.value.replace(/\D/g, '').slice(0, 16)
  numeroCartao.value = num.replace(/(.{4})/g, '$1 ').trim()
}

const formatarMes = () => {
    mesValidade.value = mesValidade.value.replace(/\D/g, '').slice(0, 2)
}

const formatarAno = () => {
    anoValidade.value = anoValidade.value.replace(/\D/g, '').slice(0, 2)
}

const formatarCPF = () => {
  let cpf = cpfTitular.value.replace(/\D/g, '').slice(0, 11);
  if (cpf.length > 9) {
      cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  } else if (cpf.length > 6) {
      cpf = cpf.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
  } else if (cpf.length > 3) {
      cpf = cpf.replace(/^(\d{3})(\d{1,3})$/, '$1.$2');
  }
  cpfTitular.value = cpf;
}


const validarNumeroCartao = (num) => /^\d{16}$/.test(num.replace(/\s/g, ''))
const validarCVV = (cvv) => /^\d{3,4}$/.test(cvv) 
const validarCPF = (cpf) => /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(cpf)

const validarValidade = (mes, ano) => {
    if (!/^\d{2}$/.test(mes) || !/^\d{2}$/.test(ano)) return false;
    
    const mesNum = parseInt(mes);
    const anoNum = parseInt('20' + ano); 

    if (mesNum < 1 || mesNum > 12) return false;

    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const mesAtual = dataAtual.getMonth() + 1; 

    if (anoNum < anoAtual) return false;
    if (anoNum === anoAtual && mesNum < mesAtual) return false;

    return true;
}

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

const processarPagamento = async () => {
  erro.value = ''

  if (!formularioValido.value) { 
      erro.value = 'Preencha todos os campos corretamente.'; 
      return 
  }
  
  if (!validarValidade(mesValidade.value, anoValidade.value)) { 
      erro.value = 'Validade do cartão expirada ou inválida.'; 
      return 
  }

  loading.value = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push('/sucesso')
  } catch (e) {
    erro.value = 'Erro ao processar pagamento. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

.pagamento-page {
  display: flex;
  justify-content: center;
  align-items: center; 
  padding: 50px 20px;
  background-color: #f0f2f5; 
  min-height: 100vh;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; 
}

.pagamento-card {
  background-color: #fff;
  padding: 30px 40px;
  border-radius: 12px; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); 
  width: 400px; 
  max-width: 100%;
}

.header-pagamento {
    text-align: center;
    margin-bottom: 20px;
}

h2 {
  font-size: 24px;
  margin-bottom: 5px;
  color: #1a1a1a;
  font-weight: 600;
}

.selo-seguranca {
    background-color: #e6f7ff; 
    color: #096dd9;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 500;
    display: inline-block;
}

.total {
  text-align: center;
  font-size: 22px;
  margin-bottom: 25px;
  color: #1a1a1a;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.total strong {
    color: #007bff; 
    font-weight: 700;
}

.form-pagamento .form-group {
  margin-bottom: 18px; 
  position: relative; 
}

.form-pagamento label {
  font-weight: 500; 
  margin-bottom: 6px;
  color: #333;
  font-size: 14px;
  display: block; 
}

.form-pagamento input {
  width: 100%; 
  box-sizing: border-box; 
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: #fafafa;
}

.form-pagamento input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
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
    color: #999;
    font-weight: bold;
    font-size: 12px;
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 0 5px;
    display: inline-block;
    line-height: 16px;
}

button {
  width: 100%;
  padding: 15px;
  border-radius: 6px;
  background-color: #ff6600; 
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  margin-top: 10px;
}

button:hover:not([disabled]) {
  background-color: #000000;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

button[disabled] {
  background-color: #ccc; 
  cursor: not-allowed;
  color: #999;
}

.erro {
  color: #d9534f; 
  background-color: #fbebeb;
  padding: 8px;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 15px;
  font-size: 14px;
  border: 1px solid #ebccd1;
}
</style>