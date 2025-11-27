<template>
  <div v-if="modelValue" class="modal-overlay" role="dialog" aria-modal="true">
    <div class="modal-card">
      <h3>Pagamento - Plano Fidelidade</h3>
      <p>
        Valor: <strong class="price">R$ {{ priceDisplay }} / mês</strong>
      </p>

      <div class="modal-body">
        <label class="field">
          <span>Método de pagamento</span>
          <select v-model="paymentMethod">
            <option value="pix">PIX</option>
            <option value="boleto">Boleto</option>
            <option value="card" disabled>
              Cartão de Crédito (Indisponível)
            </option>
          </select>
        </label>

        <div v-if="paymentMethod === 'card'" class="card-form">
          <p class="warning-message">
            O pagamento com cartão de crédito está temporariamente indisponível
            por questões de segurança. Por favor, utilize PIX ou Boleto.
          </p>
        </div>

        <div v-if="paymentMethod === 'pix'" class="pix-info">
          <p>
            Ao confirmar, será gerado um QR Code / chave PIX para pagamento.
          </p>
        </div>

        <div v-if="paymentMethod === 'boleto'" class="boleto-info">
          <p>Ao confirmar, será gerado um boleto para pagamento.</p>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn" @click="onCancel" :disabled="loading">
          Cancelar
        </button>
        <button class="btn btn-primary" @click="onConfirm" :disabled="loading">
          <span v-if="!loading">Confirmar pagamento</span>
          <span v-else>Processando...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  price: { type: [Number, String], default: 15.99 },
});

const emit = defineEmits(["update:modelValue", "confirmed"]);

const paymentMethod = ref("pix");
const loading = ref(false);

// Declarações adicionadas para resolver os erros no-undef
const cardName = ref("");
const cardNumber = ref("");
const cardExpiry = ref("");
const cardCvv = ref("");

// Formata o preço para exibição
const priceDisplay = computed(() => {
  if (typeof props.price === "number")
    return props.price.toFixed(2).replace(".", ",");
  return String(props.price);
});

// Fecha o modal ao cancelar
const onCancel = () => {
  if (loading.value) return;
  emit("update:modelValue", false);
};

// Processa a confirmação do pagamento
const onConfirm = async () => {
  loading.value = true;
  try {
    emit("confirmed", {
      paymentMethod: paymentMethod.value,
      card: {
        name: cardName.value,
        number: cardNumber.value,
        expiry: cardExpiry.value,
        cvv: cardCvv.value,
      },
    });
    emit("update:modelValue", false);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}
.modal-card {
  background: var(--color-card-background);
  border-radius: 12px;
  padding: 20px;
  width: 420px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  border: 1px solid var(--color-border);
}
.modal-card h3 {
  margin: 0 0 8px;
}
.modal-body {
  margin-top: 12px;
}
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
}
.field {
  display: block;
  margin-bottom: 10px;
}
.field span {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 6px;
}
.field input,
.field select {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-input-bg);
}
.field.small {
  width: 48%;
}
.row {
  display: flex;
  gap: 8px;
}
.price {
  color: #ff8c42;
  font-weight: 700;
}
</style>
