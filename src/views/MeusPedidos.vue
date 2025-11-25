<template>
  <div class="orders-page">
    <header class="page-header">
      <div>
        <p class="breadcrumb">
          <router-link to="/perfil">Minha conta</router-link>
          <span>/</span>
          <span>Meus Pedidos</span>
        </p>
        <h1>Meus Pedidos</h1>
        <p class="subtitle">
          Acompanhe o status dos seus pedidos, visualize detalhes e gerencie suas compras.
        </p>
      </div>
    </header>

    <section v-if="loading" class="state-card loading">
      <div class="spinner"></div>
      <p>Carregando seus pedidos...</p>
    </section>

    <section v-else-if="error" class="state-card error">
      <h2>Não foi possível carregar seus pedidos</h2>
      <p>{{ error }}</p>
      <button @click="loadOrders" class="btn btn-primary">
        Tentar novamente
      </button>
    </section>

    <section v-else-if="orders.length === 0" class="state-card empty">
      <h2>Você ainda não fez nenhum pedido</h2>
      <p>Que tal explorar nossos produtos e fazer sua primeira compra?</p>
      <button class="btn btn-primary" @click="goToProducts">
        Explorar Produtos
      </button>
    </section>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card card">
        <div class="order-header">
          <h3 class="order-id">Pedido #{{ order.id }}</h3>
          <span :class="getOrderStatusClass(order.status)" class="status-badge">{{ order.status }}</span>
        </div>
        <div class="order-meta">
          <p><strong>Data:</strong> {{ formatDate(order.date) }}</p>
          <p><strong>Total:</strong> {{ formatCurrency(order.total) }}</p>
        </div>
        <div class="order-items">
          <h4>Itens do Pedido:</h4>
          <ul>
            <li v-for="item in order.items" :key="item.productId">
              {{ item.name }} ({{ item.quantity }}x) - {{ formatCurrency(item.price) }}
            </li>
          </ul>
        </div>
        <div class="order-actions">
          <button class="btn btn-secondary" @click="viewOrderDetails(order.id)">
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import orderService from "@/services/orderService";

const router = useRouter();
const toast = useToast();

const loading = ref(true);
const error = ref("");
const orders = ref([]);

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return currencyFormatter.format(0);
  }
  return currencyFormatter.format(Number(value));
};

const formatDate = (value, fallback = "—") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getOrderStatusClass = (status) => {
  switch (status) {
    case "Concluído":
      return "status-approved";
    case "Pendente":
      return "status-pending";
    case "Cancelado":
      return "status-cancelled";
    default:
      return "status-unknown";
  }
};

const loadOrders = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await orderService.getOrders();
    orders.value = response.data;
  } catch (err) {
    console.error("Erro ao carregar pedidos:", err);
    error.value = err.message || "Ocorreu um erro ao carregar os pedidos.";
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

const goToProducts = () => {
  router.push("/telaprodutos"); // Assumindo que a rota para produtos é '/telaprodutos'
};

const viewOrderDetails = (orderId) => {
  toast.info(`Funcionalidade de detalhes do pedido ${orderId} ainda não implementada.`);
  // router.push(`/pedidos/${orderId}`); // Rota para detalhes do pedido (a ser criada)
};

onMounted(() => {
  loadOrders();
});
</script>

<style scoped>
.orders-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 100px;
  min-height: calc(100vh - 80px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2.6rem;
  color: var(--color-heading);
  margin: 10px 0 8px;
}

.subtitle {
  font-size: 1.6rem;
  color: var(--color-text);
  opacity: 0.8;
  max-width: 620px;
  margin: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  color: var(--color-text);
  opacity: 0.7;
}

.breadcrumb a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
}

.breadcrumb span:last-child {
  color: var(--color-text);
}

.state-card {
  background-color: var(--color-card-background);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  padding: 40px;
  text-align: center;
  box-shadow: 0 8px 24px var(--color-card-shadow);
}

.state-card h2 {
  margin-top: 0;
  font-size: 2rem;
  color: var(--color-heading);
}

.state-card p {
  font-size: 1.5rem;
  color: var(--color-text);
  opacity: 0.8;
  max-width: 520px;
  margin: 12px auto 0;
}

.state-card.error p {
  color: #b91c1c;
  opacity: 1;
}

.state-card.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.state-card.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  animation: spin 1s linear infinite;
}

.btn {
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-family: "Rajdhani", sans-serif;
}

.btn-primary {
  background-color: var(--color-primary);
  color: #fff;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border-color: var(--color-border);
}

.btn-secondary:hover {
  background-color: var(--color-background-mute);
  transform: translateY(-2px);
}

.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.order-card {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-id {
  margin: 0;
  font-size: 1.8rem;
  color: var(--color-heading);
}

.status-badge {
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
}

.status-approved {
  background-color: #dcfce7; /* green-100 */
  color: #15803d; /* green-700 */
}

.status-pending {
  background-color: #fef3c7; /* yellow-100 */
  color: #a16207; /* yellow-700 */
}

.status-cancelled {
  background-color: #fee2e2; /* red-100 */
  color: #b91c1c; /* red-700 */
}

.status-unknown {
  background-color: #e0e7ff; /* indigo-100 */
  color: #4f46e5; /* indigo-700 */
}

.order-meta p {
  margin: 5px 0;
  font-size: 1.3rem;
  color: var(--color-text);
}

.order-items h4 {
  margin: 0 0 10px 0;
  font-size: 1.4rem;
  color: var(--color-heading);
}

.order-items ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-items li {
  font-size: 1.3rem;
  color: var(--color-text);
  margin-bottom: 5px;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Reutilizando estilos de Fidelidade.vue */
.card {
  background-color: var(--color-card-background);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px var(--color-card-shadow);
  border: 1px solid var(--color-border);
}
</style>