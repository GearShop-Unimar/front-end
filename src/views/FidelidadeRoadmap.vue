<template>
  <div class="roadmap-page">
    <header class="page-header">
      <div>
        <p class="breadcrumb">
          <router-link to="/perfil">Minha conta</router-link>
          <span>/</span>
          <router-link to="/fidelidade">Plano de fidelidade</router-link>
          <span>/</span>
          <span>Nível de fidelidade</span>
        </p>
        <h1>Nível de Fidelidade</h1>
        <p class="subtitle">Acompanhe seu progresso e resgate recompensas.</p>
      </div>
    </header>

    <section v-if="loading" class="state-card loading">
      <div class="spinner"></div>
      <p>Carregando seu nível de fidelidade...</p>
    </section>

    <section v-else-if="!isPremium" class="state-card empty">
      <h2>Você não possui um plano de fidelidade ativo</h2>
      <p>Adira ao plano para começar a acumular níveis e resgatar recompensas.</p>
      <button class="btn btn-primary" @click="goToFidelidade">Aderir ao plano</button>
    </section>

    <section v-else class="content card">
      <div class="level-summary">
        <div>
          <h2>Seu nível atual: <span class="level-name">{{ currentLevel.key }}</span></h2>
          <p class="level-reward">Recompensa: {{ currentLevel.reward }}</p>
        </div>
        <div class="progress-block">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <small>{{ progressPercent }}% até o próximo nível</small>
        </div>
      </div>

      <div class="levels-list">
        <div
          v-for="level in levels"
          :key="level.key"
          :class="['level-item', { achieved: isLevelAchieved(level), current: level.key === currentLevel.key }]"
        >
          <div class="level-info">
            <div class="level-title">{{ level.key }}</div>
            <div class="level-min">A partir de R$ {{ level.min.toFixed(2) }}</div>
          </div>
          <div class="level-reward-small">{{ level.reward }}</div>
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-primary" @click="claimReward" :disabled="claimed">
          {{ claimed ? 'Recompensa resgatada' : 'Resgatar recompensa atual' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import premiumService from '@/services/premiumService';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const toast = useToast();

const loading = ref(true);
const isPremium = ref(false);
const payments = ref([]);
const premiumAccount = ref(null);
const claimed = ref(false);

const levels = [
  { key: 'Bronze', min: 0, reward: 'Cupom de 5% na próxima compra' },
  { key: 'Prata', min: 100, reward: 'Cupom de 10% ou frete grátis' },
  { key: 'Ouro', min: 300, reward: 'Cupom de 15% + frete grátis' },
  { key: 'Platina', min: 600, reward: 'Cupom de 25% + frete VIP' },
];

const normalizePayment = (p) => {
  const id = p.id ?? p.Id;
  const amount = p.amount ?? p.Amount ?? 0;
  const status = p.status ?? p.Status ?? 0;
  const createdAt = p.createdAt ?? p.CreatedAt ?? null;
  const premiumAccountId = p.premiumAccountId ?? p.PremiumAccountId ?? (p.premiumAccount ? (p.premiumaccount?.id ?? p.premiumaccount?.Id ?? p.premiumaccount?.id) : undefined);
  return { ...p, id, amount: Number(amount) || 0, status, createdAt, premiumAccountId };
};

const totalSpent = computed(() => {
  const arr = payments.value || [];
  return arr.reduce((sum, p) => {
    const st = typeof p.status === 'string' ? p.status.toLowerCase() : p.status;
    const approved = st === 3 || st === '3' || st === 'approved' || st === 'aprovado';
    if (approved) return sum + (Number(p.amount) || 0);
    return sum;
  }, 0);
});

const currentLevel = computed(() => {
  const spent = totalSpent.value;
  let cur = levels[0];
  for (const lvl of levels) {
    if (spent >= lvl.min) cur = lvl;
  }
  return cur;
});

const progressPercent = computed(() => {
  const spent = totalSpent.value;
  const curIndex = levels.findIndex(l => l.key === currentLevel.value.key);
  const cur = levels[curIndex];
  const next = levels[curIndex + 1];
  if (!next) return 100;
  const range = next.min - cur.min;
  const progress = spent - cur.min;
  const pct = Math.max(0, Math.min(100, Math.round((progress / range) * 100)));
  return pct;
});

const isLevelAchieved = (level) => {
  return totalSpent.value >= level.min;
};

const loadRoadmap = async () => {
  loading.value = true;
  try {
    const account = await premiumService.getDetails();
    premiumAccount.value = account;
    isPremium.value = !!account;

    const token = authStore.token;
    const userId = authStore.user?.id;
    if (!token || !userId) {
      payments.value = [];
      loading.value = false;
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    const res = await fetch(`${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/Payment/user/${userId}`, { headers });
    if (res.ok) {
      const data = await res.json();
      payments.value = Array.isArray(data) ? data.map(normalizePayment) : [];
    } else {
      payments.value = [];
    }
  } catch (e) {
    console.error('Erro ao carregar roadmap:', e);
    toast.error('Erro ao carregar seu roadmap de fidelidade.');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadRoadmap();
});

const claimReward = () => {
  if (claimed.value) return;
  claimed.value = true;
  toast.success('Recompensa adicionada à sua conta! Verifique seus cupons.');
};

const goToFidelidade = () => {
  window.location.href = '/fidelidade';
};
</script>

<style scoped>
.roadmap-page { max-width: 1000px; margin: 0 auto; padding: 32px; }
.level-summary { display:flex; justify-content:space-between; align-items:center; gap:12px; }
.level-name { color: #ff8c42; font-weight:900; }
.level-reward { margin-top:6px; color:var(--color-text); }
.progress-block { width:320px; }
.progress-bar { background:var(--color-background-mute); height:12px; border-radius:999px; overflow:hidden; }
.progress-fill { height:100%; background:linear-gradient(90deg,#ff8c42,#ffb37a); }
.levels-list { margin-top:20px; display:flex; flex-direction:column; gap:12px; }
.level-item { display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-radius:10px; border:1px solid var(--color-border); }
.level-item.achieved { background:#f0fff4; border-color:#bbf7d0; }
.level-item.current { box-shadow:0 6px 18px rgba(255,140,66,0.12); }
.level-title { font-weight:800; font-size:1.2rem; }
.level-min { color:var(--color-text); opacity:0.8; }
.level-reward-small { color:var(--color-text); opacity:0.9; max-width:50%; text-align:right; }
.actions { margin-top:18px; text-align:center; }
</style>
