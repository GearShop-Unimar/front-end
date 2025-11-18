<template>
  <div class="pagamento-page">
    <div class="pagamento-card">
      <div class="stepper">
        <div
          class="step"
          :class="{ active: currentStep >= 1, completed: currentStep > 1 }"
        >
          <div class="step-number">1</div>
          <div class="step-label">Revisão</div>
        </div>
        <div class="step-line" :class="{ completed: currentStep > 1 }"></div>
        <div
          class="step"
          :class="{ active: currentStep >= 2, completed: currentStep > 2 }"
        >
          <div class="step-number">2</div>
          <div class="step-label">Pagamento</div>
        </div>
        <div class="step-line" :class="{ completed: currentStep > 2 }"></div>
        <div
          class="step"
          :class="{ active: currentStep >= 3, completed: currentStep > 3 }"
        >
          <div class="step-number">3</div>
          <div class="step-label">Confirmação</div>
        </div>
      </div>

      <div v-if="currentStep === 1" class="step-content">
        <h2>Revise seus Produtos</h2>
        <div class="produtos-revisao-grid">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="produto-revisao-item"
          >
            <img :src="item.imagem" :alt="item.nome" />
            <div class="info">
              <span class="nome">{{ item.nome }}</span>
              <span class="preco">R$ {{ item.preco.toFixed(2) }}</span>
            </div>
            <button @click="removerItem(item.id)" class="btn-remover">×</button>
          </div>
        </div>
        <div class="total-container">
          <span>Total:</span>
          <strong>R$ {{ total.toFixed(2) }}</strong>
        </div>
        <div class="navigation-buttons">
          <button @click="goToNextStep" :disabled="cartItems.length === 0">
            Confirmar e Continuar
          </button>
        </div>
      </div>

      <div v-if="currentStep === 2" class="step-content">
        <h2>Escolha a Forma de Pagamento</h2>
        <div class="payment-methods">
          <div class="method" @click="selectPaymentMethod('credit')">
            💳 Cartão de Crédito
          </div>
          <div class="method" @click="selectPaymentMethod('pix')">✨ PIX</div>
          <div class="method" @click="selectPaymentMethod('boleto')">
            📄 Boleto
          </div>
        </div>
        <div class="navigation-buttons">
          <button @click="goToPreviousStep" class="btn-secondary">
            Voltar
          </button>
        </div>
      </div>

      <div v-if="currentStep === 3" class="step-content">
        <div v-if="paymentMethod === 'credit'">
          <h2>Detalhes do Cartão</h2>
          <CreditCardForm @submit="handlePayment" />
        </div>
        <div v-if="paymentMethod === 'pix'" class="payment-details">
          <h2>Pague com PIX</h2>
          <p>Use o QR Code abaixo para pagar:</p>
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example"
            alt="QR Code PIX"
            class="qr-code"
          />
          <button @click="handlePayment">Confirmar Pagamento PIX</button>
        </div>
        <div v-if="paymentMethod === 'boleto'" class="payment-details">
          <h2>Pagamento com Boleto</h2>
          <p>Clique no botão para gerar seu boleto.</p>
          <button @click="handlePayment">Gerar Boleto</button>
        </div>
        <div class="navigation-buttons">
          <button @click="goToPreviousStep" class="btn-secondary">
            Voltar
          </button>
        </div>
      </div>

      <div v-if="currentStep === 4" class="step-content success-step">
        <h2>🎉 Pagamento Realizado!</h2>
        <p>
          Obrigado por comprar na GearShop! Seu pedido foi confirmado e em breve
          será preparado para envio.
        </p>
        <div class="navigation-buttons">
          <router-link to="/produtos" class="btn-primary"
            >Continuar Comprando</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import CreditCardForm from "@/components/CreditCardForm.vue";

const currentStep = ref(1);
const paymentMethod = ref(null);

const cartItems = ref([
  {
    id: 1,
    nome: "Amortecedor Dianteiro",
    preco: 450.0,
    imagem:
      "https://http2.mlstatic.com/D_NQ_NP_960144-MLB70451878345_072023-O.webp",
  },
  {
    id: 2,
    nome: "Lâmpada de Farol H4",
    preco: 65.9,
    imagem:
      "https://d15p9s482i31ww.cloudfront.net/images/produtos/64193NL-1.png",
  },
  {
    id: 3,
    nome: "Jogo de Tapetes Carpete",
    preco: 129.99,
    imagem:
      "https://http2.mlstatic.com/D_NQ_NP_864272-MLB47915729792_102021-O.webp",
  },
]);

const total = computed(() =>
  cartItems.value.reduce((acc, item) => acc + item.preco, 0)
);

const removerItem = (id) => {
  cartItems.value = cartItems.value.filter((item) => item.id !== id);
};

const goToNextStep = () => {
  if (currentStep.value < 4) currentStep.value++;
};

const goToPreviousStep = () => {
  if (currentStep.value > 1) {
    if (currentStep.value === 3) {
      paymentMethod.value = null;
    }
    currentStep.value--;
  }
};

const selectPaymentMethod = (method) => {
  paymentMethod.value = method;
  goToNextStep();
};

const handlePayment = async () => {
  console.log("Processando pagamento...");
  await new Promise((resolve) => setTimeout(resolve, 1500));
  currentStep.value = 4;
};
</script>

<style scoped>
.pagamento-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 50px 20px;
  background-color: var(--color-background-soft);
  min-height: 100vh;
}
.pagamento-card {
  background-color: var(--color-card-background);
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px var(--color-card-shadow);
  width: 700px;
  max-width: 100%;
  border: 1px solid var(--color-border);
}
.stepper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.step {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: var(--color-text);
  opacity: 0.5;
  flex: 0 1 auto;
  text-align: center;
}
.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s ease;
}
.step-label {
  margin-top: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}
.step.active .step-number {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: white;
}
.step.active {
  opacity: 1;
}
.step.completed .step-number {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: white;
}
.step-line {
  flex-grow: 1;
  height: 2px;
  background-color: var(--color-border);
  margin: 0 10px;
  margin-bottom: 25px;
  transition: background-color 0.3s ease;
}
.step-line.completed {
  background-color: var(--color-primary);
}
.step-content h2 {
  text-align: center;
  color: var(--color-heading);
  margin-bottom: 25px;
}
.produtos-revisao-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
}
.produto-revisao-item {
  display: flex;
  align-items: center;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px;
  position: relative;
}
.produto-revisao-item img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin-right: 10px;
}
.produto-revisao-item .info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.produto-revisao-item .nome {
  font-weight: 600;
  color: var(--color-heading);
  font-size: 0.9rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.produto-revisao-item .preco {
  color: var(--color-text);
  font-size: 0.9rem;
}
.btn-remover {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  font-size: 1.2rem;
}
.total-container {
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
  color: var(--color-heading);
}
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.method {
  padding: 20px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  color: var(--color-heading);
}
.method:hover {
  border-color: var(--color-primary);
  background-color: var(--color-background-mute);
}
.navigation-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}
.navigation-buttons button,
.navigation-buttons a {
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-decoration: none;
  font-size: 1rem;
}
.btn-secondary {
  background-color: var(--color-background-mute);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.btn-secondary:hover {
  background-color: var(--color-border);
}
button {
  background-color: var(--color-primary);
  color: white;
}
button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.payment-details {
  text-align: center;
}
.qr-code {
  margin: 20px auto;
  display: block;
  max-width: 100%;
  height: auto;
}
.success-step {
  text-align: center;
  padding: 40px 0;
}
.success-step h2 {
  font-size: 2rem;
  color: var(--color-primary);
}
.success-step p {
  font-size: 1.1rem;
  color: var(--color-text);
  margin-bottom: 30px;
}

/* RESPONSIVIDADE */

@media (max-width: 768px) {
  .pagamento-page {
    padding: 30px 10px;
    align-items: stretch;
  }
  .pagamento-card {
    padding: 20px;
  }
  .stepper {
    margin-bottom: 20px;
    padding: 0 5px;
  }
  .step-number {
    width: 25px;
    height: 25px;
    font-size: 0.9rem;
  }
  .step-label {
    font-size: 0.8rem;
    margin-top: 5px;
  }
  .step-line {
    margin-bottom: 20px;
  }
  .step-content h2 {
    font-size: 1.5rem;
  }
  .produtos-revisao-grid {
    grid-template-columns: 1fr;
    max-height: 250px;
  }
  .produto-revisao-item {
    padding: 8px;
  }
  .total-container {
    font-size: 1.3rem;
  }
  .method {
    padding: 15px;
  }
  .navigation-buttons button,
  .navigation-buttons a {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  .success-step h2 {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .pagamento-card {
    padding: 15px;
  }
  .stepper {
    flex-wrap: nowrap;
    overflow-x: auto;
    justify-content: initial;
    padding-bottom: 10px;
  }
  .step {
    min-width: 80px;
  }
  .step-line {
    margin: 0 5px;
  }
  .produto-revisao-item .nome {
    white-space: initial;
    max-width: 100%;
    text-overflow: clip;
    word-break: break-word;
  }
}
</style>
