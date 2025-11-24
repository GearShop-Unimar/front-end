<template>
  <div class="loyalty-page">
    <header class="page-header">
      <div>
        <p class="breadcrumb">
          <router-link to="/perfil">Minha conta</router-link>
          <span>/</span>
          <span>Plano de fidelidade</span>
        </p>
        <h1>Plano de Fidelidade</h1>
        <p class="subtitle">
          Acompanhe os detalhes do seu plano, próximos pagamentos e benefícios
          exclusivos.
        </p>
      </div>
    </header>

    <section v-if="loading" class="state-card loading">
      <div class="spinner"></div>
      <p>Carregando informações do seu plano...</p>
    </section>

    <section v-else-if="error" class="state-card error">
      <h2>Não foi possível carregar seu plano de fidelidade</h2>
      <p>{{ error }}</p>
      <button @click="retryLoad" class="btn btn-primary">
        Tentar novamente
      </button>
    </section>

    <section v-else-if="!activeSubscription" class="state-card empty">
      <h2>Você ainda não possui um plano de fidelidade ativo</h2>
      <p>
        Assine o Plano de Fidelidade GearShop e desbloqueie descontos,
        benefícios e suporte prioritário.
      </p>
      <div style="margin: 16px 0; text-align: center">
        <div class="default-price">
          R$ 15,99 <small class="default-price-sub">/mês</small>
        </div>
        <ul class="default-benefits" aria-label="Benefícios do plano">
          <li>Frete grátis para pedidos acima de R$ 100</li>
          <li>Descontos exclusivos em peças selecionadas</li>
          <li>Suporte prioritário 24/7</li>
          <li>Acesso antecipado a promoções e lançamentos</li>
        </ul>
      </div>
      <div
        style="
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
          margin-top: 12px;
        "
      >
        <button class="btn btn-primary" @click="openPaymentModal">
          Aderir ao plano
        </button>
      </div>
    </section>

    <!-- payment modal mounted at the end of template to avoid breaking v-if chain -->

    <div v-else class="content-grid">
      <section class="plan-overview card">
        <div class="plan-header">
          <div>
            <h2>{{ planName }}</h2>
            <p class="plan-id">Assinatura #{{ activeSubscription.id }}</p>
          </div>
          <span
            class="status-badge"
            :class="getSubscriptionStatus(activeSubscription.status).class"
          >
            {{ getSubscriptionStatus(activeSubscription.status).label }}
          </span>
        </div>

        <p class="status-description">
          {{ getSubscriptionStatus(activeSubscription.status).description }}
        </p>

        <div class="plan-metrics">
          <div class="metric">
            <span class="metric-label">Valor mensal</span>
            <span class="metric-value">{{
              formatCurrency(activeSubscription.monthlyAmount)
            }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Próximo pagamento</span>
            <span class="metric-value">
              {{ formattedNextPayment.date }}
            </span>
            <small
              v-if="formattedNextPayment.diff !== null"
              :class="{ late: formattedNextPayment.diff < 0 }"
            >
              {{
                formattedNextPayment.diff < 0
                  ? `${Math.abs(formattedNextPayment.diff)} dia(s) em atraso`
                  : formattedNextPayment.diff === 0
                  ? "Vence hoje"
                  : `em ${formattedNextPayment.diff} dia(s)`
              }}
            </small>
          </div>
          <div class="metric">
            <span class="metric-label">Início do plano</span>
            <span class="metric-value">
              {{ formatDate(activeSubscription.startDate) }}
            </span>
            <small v-if="planDuration">
              {{ planDuration }}
            </small>
          </div>
          <div class="metric">
            <span class="metric-label">Expiração</span>
            <span class="metric-value">
              {{ formattedExpiration }}
            </span>
          </div>
        </div>
      </section>

      <!-- Ações do plano -->
      <section class="plan-actions card">
        <div class="section-header">
          <h2>Gerenciamento do plano</h2>
        </div>
        <div class="actions-row">
          <button class="btn btn-primary" @click="activatePlan">
            {{ !activeSubscription ? "Assinar plano" : "Renovar plano" }}
          </button>
          <button class="btn" @click="goToPayment">
            Atualizar forma de pagamento
          </button>
          <button
            v-if="activeSubscription.status === 1"
            class="btn btn-warning"
            @click="pausePlan"
          >
            Pausar plano
          </button>
          <button
            v-if="activeSubscription.status === 2"
            class="btn btn-success"
            @click="resumePlan"
          >
            Retomar plano
          </button>
          <button class="btn btn-danger" @click="cancelPlan">
            Cancelar plano
          </button>
        </div>
      </section>

      <section class="plan-benefits card">
        <div class="section-header">
          <h2>Benefícios do seu plano</h2>
          <span class="tag">
            Atualizado
            {{
              formatDate(
                activeSubscription.updatedAt || activeSubscription.createdAt
              )
            }}
          </span>
        </div>

        <ul v-if="benefits.length" class="benefits-list">
          <li v-for="benefit in benefits" :key="benefit">
            <i class="bi bi-check-circle-fill"></i>
            <span>{{ benefit }}</span>
          </li>
        </ul>
        <p v-else class="benefits-empty">
          Este plano ainda não possui benefícios listados. Entre em contato com
          o suporte para saber mais.
        </p>
      </section>

      <section class="plan-details card">
        <h2>Detalhes do plano</h2>
        <dl>
          <div class="detail-row">
            <dt>Produto vinculado</dt>
            <dd>
              {{ activeSubscription.product?.name || "Plano personalizado" }}
            </dd>
          </div>
          <div class="detail-row">
            <dt>Status</dt>
            <dd>
              <span
                class="status-badge"
                :class="getSubscriptionStatus(activeSubscription.status).class"
              >
                {{ getSubscriptionStatus(activeSubscription.status).label }}
              </span>
            </dd>
          </div>
          <div class="detail-row">
            <dt>Data da adesão</dt>
            <dd>{{ formatDate(activeSubscription.startDate) }}</dd>
          </div>
          <div class="detail-row">
            <dt>Próxima cobrança</dt>
            <dd>{{ formattedNextPayment.date }}</dd>
          </div>
          <div class="detail-row">
            <dt>Data de expiração</dt>
            <dd>{{ formattedExpiration }}</dd>
          </div>
          <div class="detail-row">
            <dt>Observações</dt>
            <dd>
              {{ activeSubscription.notes || "Sem observações adicionais." }}
            </dd>
          </div>
        </dl>
      </section>

      <section class="payment-history card">
        <h2>Pagamentos recentes</h2>

        <table v-if="recentPayments.length" class="payments-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Valor</th>
              <th>Forma</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in recentPayments" :key="payment.id">
              <td>{{ formatDate(payment.createdAt) }}</td>
              <td>{{ formatCurrency(payment.amount) }}</td>
              <td>{{ getPaymentType(payment.paymentType) }}</td>
              <td>
                <span
                  class="status-badge"
                  :class="getPaymentStatus(payment.status).class"
                >
                  {{ getPaymentStatus(payment.status).label }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="payments-empty">
          <i class="bi bi-receipt"></i>
          <p>
            Nenhum pagamento foi registrado para este plano ainda. Assim que um
            pagamento for efetuado, ele aparecerá aqui.
          </p>
        </div>
      </section>
    </div>
  </div>
  <PaymentModal
    v-model="showPaymentModal"
    :price="15.99"
    @confirmed="onPaymentConfirmed"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import premiumService from "@/services/premiumService";
import PaymentModal from "@/components/PaymentModal.vue";

const API_URL = import.meta.env.VITE_API_URL;

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const loading = ref(true);
const error = ref("");
const subscriptions = ref([]);
const payments = ref([]);
const hasPremium = ref(false);

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

const SUBSCRIPTION_STATUS_MAP = {
  1: {
    label: "Ativa",
    class: "status-active",
    description: "Plano ativo. Aproveite todos os benefícios disponíveis.",
  },
  2: {
    label: "Pausada",
    class: "status-paused",
    description:
      "Plano pausado temporariamente. Regularize sua situação para voltar a aproveitar os benefícios.",
  },
  3: {
    label: "Cancelada",
    class: "status-cancelled",
    description:
      "Plano cancelado. Entre em contato se deseja reativar ou contratar um novo plano.",
  },
  4: {
    label: "Expirada",
    class: "status-expired",
    description:
      "Plano expirado. Renove a assinatura para continuar com os benefícios.",
  },
};

const PAYMENT_STATUS_MAP = {
  1: { label: "Pendente", class: "status-pending" },
  2: { label: "Processando", class: "status-processing" },
  3: { label: "Aprovado", class: "status-approved" },
  4: { label: "Recusado", class: "status-rejected" },
  5: { label: "Cancelado", class: "status-cancelled" },
  6: { label: "Estornado", class: "status-refunded" },
};

const PAYMENT_TYPE_MAP = {
  1: "Cartão de crédito",
  2: "PIX",
  3: "Boleto",
};

const planName = computed(() => {
  if (!activeSubscription.value) return "Plano de fidelidade GearShop";
  return (
    activeSubscription.value.product?.name ||
    activeSubscription.value.notes ||
    "Plano de fidelidade GearShop"
  );
});

const activeSubscription = computed(() => {
  if (!subscriptions.value?.length) return null;
  const active = subscriptions.value.find(
    (subscription) => subscription.status === 1
  );
  return active || subscriptions.value[0];
});

const formattedExpiration = computed(() => {
  const subscription = activeSubscription.value;
  if (!subscription) return "Plano contínuo";
  if (!subscription.endDate) return "Plano contínuo";
  return formatDate(subscription.endDate);
});

const formattedNextPayment = computed(() => {
  const subscription = activeSubscription.value;
  if (!subscription?.nextPaymentDate) {
    return { date: "Ainda não agendado", diff: null };
  }

  const nextDate = new Date(subscription.nextPaymentDate);
  if (Number.isNaN(nextDate.getTime())) {
    return { date: "Data indisponível", diff: null };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  nextDate.setHours(0, 0, 0, 0);

  const diffMs = nextDate.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return {
    date: formatDate(subscription.nextPaymentDate),
    diff: diffDays,
  };
});

const planDuration = computed(() => {
  const subscription = activeSubscription.value;
  if (!subscription?.startDate) return "";

  const start = new Date(subscription.startDate);
  if (Number.isNaN(start.getTime())) return "";

  const today = new Date();
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Recém-ativado";
  if (diffDays === 1) return "1 dia de fidelidade";
  return `${diffDays} dias de fidelidade`;
});

const extractBenefitsFromNotes = (notes) => {
  if (!notes) return [];
  return notes
    .split(/\r?\n|[;•]/)
    .map((item) => item.replace(/^[-•\s]+/, "").trim())
    .filter(Boolean);
};

const benefits = computed(() => {
  const subscription = activeSubscription.value;
  if (!subscription) return [];

  const parsedBenefits = extractBenefitsFromNotes(subscription.notes);
  if (parsedBenefits.length) return parsedBenefits;

  return [
    "Descontos progressivos em peças e serviços selecionados",
    "Suporte prioritário com especialistas em performance automotiva",
    "Envio expresso gratuito para pedidos dentro do plano",
    "Acesso antecipado a lançamentos e promoções exclusivas",
  ];
});

const recentPayments = computed(() => {
  const subscription = activeSubscription.value;
  if (!subscription) return [];
  return payments.value
    .filter((payment) => payment.subscriptionId === subscription.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.processedAt || 0) -
        new Date(a.createdAt || a.processedAt || 0)
    )
    .slice(0, 5);
});

const getSubscriptionStatus = (status) => {
  return (
    SUBSCRIPTION_STATUS_MAP[status] || {
      label: "Desconhecido",
      class: "status-unknown",
      description: "Status não reconhecido.",
    }
  );
};

const getPaymentStatus = (status) => {
  return (
    PAYMENT_STATUS_MAP[status] || {
      label: "Desconhecido",
      class: "status-unknown",
    }
  );
};

const getPaymentType = (type) => {
  return PAYMENT_TYPE_MAP[type] || "Outro";
};

// Dados mockados para desenvolvimento/testes
const getMockLoyaltyData = () => {
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const mockSubscriptions = [
    {
      id: 1,
      userId: 1,
      status: 1, // Ativa
      monthlyAmount: 49.9,
      startDate: new Date(
        now.getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // 30 dias atrás
      endDate: null, // Plano contínuo
      nextPaymentDate: nextMonth.toISOString(),
      createdAt: new Date(
        now.getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date().toISOString(),
      notes:
        "Plano Premium\n• Desconto de 15% em todas as compras\n• Frete grátis para pedidos acima de R$ 100\n• Suporte prioritário 24/7\n• Acesso antecipado a promoções",
      product: {
        id: 1,
        name: "Plano Premium GearShop",
      },
    },
  ];

  const mockPayments = [
    {
      id: 1,
      subscriptionId: 1,
      amount: 49.9,
      status: 3, // Aprovado
      paymentType: 1, // Cartão de crédito
      createdAt: new Date(
        now.getTime() - 15 * 24 * 60 * 60 * 1000
      ).toISOString(), // 15 dias atrás
      processedAt: new Date(
        now.getTime() - 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: 2,
      subscriptionId: 1,
      amount: 49.9,
      status: 3, // Aprovado
      paymentType: 1, // Cartão de crédito
      createdAt: new Date(
        now.getTime() - 45 * 24 * 60 * 60 * 1000
      ).toISOString(), // 45 dias atrás
      processedAt: new Date(
        now.getTime() - 45 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  ];

  return { subscriptions: mockSubscriptions, payments: mockPayments };
};

const loadLoyaltyData = async () => {
  const token = authStore.token;
  const userId = authStore.user?.id;

  if (!token || !userId) {
    error.value = "Você precisa estar autenticado para visualizar seu plano.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = "";

  const isMockMode = localStorage.getItem("mock_mode") === "true";

  if (isMockMode) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockData = getMockLoyaltyData();
      subscriptions.value = mockData.subscriptions;
      payments.value = mockData.payments;
      hasPremium.value = mockData.subscriptions?.length > 0;
      console.log("📦 Modo Mock: Dados de fidelidade mockados carregados");
    } catch (err) {
      console.error("Erro ao carregar dados mockados:", err);
      error.value = "Erro ao carregar dados mockados.";
    } finally {
      loading.value = false;
    }
    return;
  }

  try {
    // Primeiro, consultamos a rota /api/premiumaccount/status que retorna { IsPremium: bool }
    const headers = { Authorization: `Bearer ${token}` };
    try {
      // Use premiumService (axios) to avoid duplicar '/api' quando o baseURL já contém '/api'
      const statusJson = await premiumService.getStatus();
      hasPremium.value = !!statusJson?.IsPremium;
    } catch (sErr) {
      console.warn("Erro ao consultar status do plano de fidelidade:", sErr);
      hasPremium.value = false;
    }

    // Carrega pagamentos (se houver) — endpoint já existente
    let paymentsData = [];
    try {
      const paymentsResponse = await fetch(
        `${API_URL}/Payment/user/${userId}`,
        {
          headers,
        }
      );
      if (paymentsResponse.ok) {
        paymentsData = await paymentsResponse.json();
      } else {
        console.warn("Falha ao carregar pagamentos do plano de fidelidade.");
        paymentsData = [];
      }
    } catch (pErr) {
      console.warn("Erro ao buscar pagamentos:", pErr);
      paymentsData = [];
    }

    const normalizePayment = (p) => {
      const id = p.id ?? p.Id;
      const amount = p.amount ?? p.Amount;
      const status = p.status ?? p.Status;
      const paymentType = p.paymentType ?? p.PaymentType ?? p.paymentTypeId;
      const createdAt = p.createdAt ?? p.CreatedAt;
      const processedAt = p.processedAt ?? p.ProcessedAt;
      const premiumAccountId =
        p.premiumAccountId ??
        p.PremiumAccountId ??
        (p.premiumAccount
          ? p.premiumaccount?.id ?? p.premiumAccount?.Id ?? p.premiumAccount?.id
          : undefined);

      return {
        ...p,
        id,
        amount,
        status,
        paymentType,
        createdAt,
        processedAt,
        subscriptionId: premiumAccountId,
      };
    };

    payments.value = Array.isArray(paymentsData)
      ? paymentsData.map(normalizePayment)
      : [];

    // Se a rota /details não existe, confiamos apenas em hasPremium para saber se o usuário possui plano
    // Criamos uma assinatura mínima quando sabemos que o usuário é premium,
    // já que o endpoint de detalhes foi removido. Isso permite que a UI
    // mostre que o usuário possui o plano mesmo sem todos os dados.
    const minimalSubscription = {
      id: 0, // ID 0 para indicar uma assinatura mínima sem detalhes completos
      userId,
      status: 1, // Assumimos status ativo para um premium
      monthlyAmount: 0,
      startDate: null,
      endDate: null,
      nextPaymentDate: null,
      createdAt: null,
      updatedAt: null,
      notes: "Plano GearShop (Premium Básico)",
      product: { id: 0, name: "Plano de Fidelidade Básico" },
    };
    subscriptions.value = [minimalSubscription];

    // Se o usuário é premium (hasPremium é true) e a assinatura é a mínima (id === 0),
    // redirecionamos para a página do roadmap.
    if (hasPremium.value && minimalSubscription.id === 0) {
      router.push("/fidelidade/roadmap");
      loading.value = false; // Parar o estado de carregamento desta página
      return; // Encerrar a execução de loadLoyaltyData para esta página
    }
  } catch (err) {
    console.error("Erro ao carregar dados de fidelidade:", err);
    if (
      import.meta.env.DEV &&
      (err.message?.includes("Failed to fetch") ||
        err.message?.includes("NetworkError"))
    ) {
      console.warn("⚠️ Erro de rede. Usando dados mockados...");
      const mockData = getMockLoyaltyData();
      subscriptions.value = mockData.subscriptions;
      payments.value = mockData.payments;
      hasPremium.value = mockData.subscriptions?.length > 0;
      toast.info("API não disponível. Exibindo dados de exemplo para testes.");
    } else {
      error.value =
        err?.message ||
        "Ocorreu um erro inesperado ao carregar o plano de fidelidade.";
      toast.error(error.value);
    }
  } finally {
    loading.value = false;
  }
};

const retryLoad = () => {
  loadLoyaltyData();
};

onMounted(() => {
  loadLoyaltyData();
});

// Ações do plano (API real e modo mock)
const withAuthHeaders = () => ({
  Authorization: `Bearer ${authStore.token}`,
  "Content-Type": "application/json",
});

const goToPayment = () => {
  // Encaminha para a tela de pagamento/atualização de método
  window.location.href = "/pagamento";
};

const mutateSubscriptionStatusLocally = (newStatus) => {
  if (!subscriptions.value?.length) return;
  const sub = subscriptions.value.find(
    (s) => s.id === activeSubscription.value.id
  );
  if (sub) {
    sub.status = newStatus;
    sub.updatedAt = new Date().toISOString();
  }
};

const pausePlan = async () => {
  const subId = activeSubscription.value?.id;
  if (!subId) return;
  try {
    // Pause/Resume não implementado no backend atual.
    if (localStorage.getItem("mock_mode") === "true") {
      mutateSubscriptionStatusLocally(2);
      toast.success("Plano pausado (modo teste).");
      return;
    }

    toast.info(
      "Pausar plano não está disponível no servidor atualmente. Peça ao backend para implementar pausa/retomada."
    );
  } catch (e) {
    console.error("Erro ao pausar plano:", e);
    toast.error(e.message || "Erro ao pausar o plano.");
  }
};

const resumePlan = async () => {
  const subId = activeSubscription.value?.id;
  if (!subId) return;

  // Não há endpoint de resume no backend — apenas suporte mock
  if (localStorage.getItem("mock_mode") === "true") {
    mutateSubscriptionStatusLocally(1);
    toast.success("Plano retomado (modo teste).");
    return;
  }

  toast.info(
    "Retomar plano não está disponível no servidor atualmente. Peça ao backend para implementar pausa/retomada."
  );
};

const cancelPlan = async () => {
  const subId = activeSubscription.value?.id;
  if (!subId) return;
  try {
    if (localStorage.getItem("mock_mode") === "true") {
      mutateSubscriptionStatusLocally(3);
      toast.success("Plano cancelado (modo teste).");
      return;
    }

    await premiumService.cancel();
    toast.success("Plano cancelado com sucesso.");
    await loadLoyaltyData();
  } catch (e) {
    console.error(e);
    toast.error(e.message || "Erro ao cancelar o plano.");
  }
};

const activatePlan = async () => {
  const defaultDays = 30;
  const input = window.prompt(
    "Quantos dias deseja ativar/renovar o plano? (dias)",
    String(defaultDays)
  );
  if (!input) return;
  const days = parseInt(input, 10);
  if (Number.isNaN(days) || days <= 0) {
    toast.error("Duração inválida.");
    return;
  }

  try {
    if (localStorage.getItem("mock_mode") === "true") {
      // cria/atualiza uma assinatura mock localmente
      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() + days);

      if (!subscriptions.value || !subscriptions.value.length) {
        subscriptions.value = [
          {
            id: Date.now(),
            userId: authStore.user?.id,
            status: 1,
            monthlyAmount: 0,
            startDate: now.toISOString(),
            endDate: end.toISOString(),
            nextPaymentDate: null,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            notes: "Plano mock",
            product: { id: 0, name: "Plano Mock" },
          },
        ];
      } else {
        const sub = subscriptions.value[0];
        sub.startDate = now.toISOString();
        sub.endDate = end.toISOString();
        sub.status = 1;
        sub.updatedAt = now.toISOString();
      }

      toast.success("Plano ativado (modo teste).");
      return;
    }

    await premiumService.activate(days);
    toast.success("Plano ativado/renovado com sucesso.");
    await loadLoyaltyData();
  } catch (e) {
    console.error(e);
    toast.error(e.message || "Erro ao ativar/renovar plano.");
  }
};

const subscribeToDefaultPlan = async () => {
  // Plano padrão: 30 dias por mês a R$15,99
  const days = 30;
  const price = 15.99;

  try {
    if (localStorage.getItem("mock_mode") === "true") {
      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() + days);

      subscriptions.value = [
        {
          id: Date.now(),
          userId: authStore.user?.id,
          status: 1,
          monthlyAmount: price,
          startDate: now.toISOString(),
          endDate: end.toISOString(),
          nextPaymentDate: null,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          notes: "Plano Fidelidade GearShop",
          product: { id: 0, name: "Plano Fidelidade GearShop" },
        },
      ];
      toast.success("Plano ativado (modo teste).");
      return;
    }

    // Em produção, chamamos o endpoint de ativação
    await premiumService.activate(days);
    toast.success("Plano ativado com sucesso.");
    await loadLoyaltyData();
  } catch (e) {
    console.error(e);
    toast.error(e.message || "Erro ao aderir ao plano.");
  }
};

// Modal control (we mount PaymentModal component)
const showPaymentModal = ref(false);
const openPaymentModal = () => {
  showPaymentModal.value = true;
};

const onPaymentConfirmed = async (paymentInfo) => {
  // paymentInfo: { paymentMethod, card }
  // Neste projeto não temos integração com gateway; reaproveitamos subscribeToDefaultPlan
  try {
    await subscribeToDefaultPlan();
  } catch (e) {
    console.error("Erro ao confirmar pagamento via modal:", e);
  }
};
</script>

<style scoped>
.loyalty-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 100px; /* mais espaço do footer */
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

.header-highlight {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--color-primary), #ff8c42);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 2.4rem;
  flex-shrink: 0;
  box-shadow: 0 10px 25px rgba(255, 102, 0, 0.2);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

.card {
  background-color: var(--color-card-background);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px var(--color-card-shadow);
  border: 1px solid var(--color-border);
}

.plan-overview {
  grid-column: span 12;
}

.plan-actions {
  grid-column: span 12;
}

.plan-benefits {
  grid-column: span 6;
}

.plan-details {
  grid-column: span 6;
}

.payment-history {
  grid-column: span 12;
}

.actions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.btn-warning {
  background-color: #f59e0b;
  color: #1f2937;
}

.btn-danger {
  background-color: #dc2626;
  color: #fff;
}

.btn-success {
  background-color: #16a34a;
  color: #fff;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.plan-header h2 {
  margin: 0;
  font-size: 2rem;
  color: var(--color-heading);
}

.plan-id {
  margin: 4px 0 0;
  font-size: 1.3rem;
  color: var(--color-text);
  opacity: 0.7;
}

.status-description {
  margin: 16px 0 24px;
  color: var(--color-text);
  font-size: 1.4rem;
  opacity: 0.85;
}

.plan-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metric {
  background-color: var(--color-background-mute);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.metric-label {
  display: block;
  font-size: 1.2rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-heading);
}

.metric small {
  display: block;
  margin-top: 6px;
  font-size: 1.2rem;
  color: var(--color-text);
  opacity: 0.7;
}

.metric small.late {
  color: #d12f2f;
  opacity: 1;
  font-weight: 600;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--color-heading);
}

.tag {
  font-size: 1.2rem;
  color: var(--color-primary);
  background-color: hsla(24, 100%, 50%, 0.1);
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
}

.benefits-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.benefits-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 1.4rem;
  color: var(--color-text);
}

.benefits-list i {
  color: var(--color-primary);
  font-size: 1.5rem;
  margin-top: 2px;
}

.benefits-empty {
  font-size: 1.4rem;
  color: var(--color-text);
  opacity: 0.8;
  margin: 0;
}

.plan-details h2 {
  margin-top: 0;
  font-size: 1.8rem;
  color: var(--color-heading);
}

.plan-details dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}

.detail-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-row dt {
  font-size: 1.4rem;
  color: var(--color-text);
  opacity: 0.8;
  margin: 0;
}

.detail-row dd {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-heading);
  font-weight: 600;
}

.payments-table {
  width: 100%;
  border-collapse: collapse;
}

.payments-table th,
.payments-table td {
  padding: 14px 12px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  font-size: 1.4rem;
  color: var(--color-text);
}

.payments-table th {
  font-size: 1.3rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
}

.payments-table tbody tr:hover {
  background-color: var(--color-background-mute);
}

.payments-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
  color: var(--color-text);
  opacity: 0.8;
  min-height: 160px;
}

.payments-empty i {
  font-size: 2.8rem;
  color: var(--color-primary);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.status-active {
  background-color: #d1fae5;
  color: #047857;
}

.status-paused {
  background-color: #fef3c7;
  color: #b45309;
}

.status-cancelled {
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-expired {
  background-color: #e5e7eb;
  color: #374151;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-processing {
  background-color: #e0f2fe;
  color: #0369a1;
}

.status-approved {
  background-color: #dcfce7;
  color: #15803d;
}

.status-rejected {
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-refunded {
  background-color: #ede9fe;
  color: #5b21b6;
}

.status-unknown {
  background-color: var(--color-background-mute);
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

.default-benefits {
  list-style: disc;
  margin: 12px auto 0 auto;
  padding-left: 20px;
  max-width: 640px;
  text-align: left;
  font-size: 1.6rem;
  color: var(--color-text);
  line-height: 1.6;
}
.default-benefits li {
  margin-bottom: 8px;
}

.default-price {
  font-size: 2.6rem;
  font-weight: 900;
  color: #ff8c42; /* laranja chamativo padrão */
  line-height: 1;
}
.default-price-sub {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-left: 8px;
  opacity: 0.95;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .plan-benefits,
  .plan-details {
    grid-column: span 6;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-highlight {
    width: 56px;
    height: 56px;
    font-size: 2rem;
  }

  .content-grid {
    grid-template-columns: repeat(1, 1fr);
  }

  .plan-overview,
  .plan-benefits,
  .plan-details,
  .payment-history {
    grid-column: span 1;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-row dd {
    font-size: 1.4rem;
  }
}
</style>
