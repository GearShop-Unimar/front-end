<template>
  <div>
    <button
      class="chat-fab"
      :class="{ shifted: cartStore.isOpen }"
      v-if="!isOpen"
      @click="toggleOpen(true)"
      aria-label="Abrir mensagens"
    >
      <i class="bi bi-chat-dots"></i>
      <span class="label">Mensagens</span>
    </button>

    <div
      v-else
      class="chat-panel"
      :class="{
        open: isOpen,
        'chat-active': selectedId,
        shifted: cartStore.isOpen,
      }"
    >
      <header class="chat-header">
        <div class="title">
          <i class="bi bi-chat-dots"></i>
          <span>{{ headerTitle }}</span>
        </div>
        <div class="actions">
          <button class="icon" @click="toggleOpen(false)" aria-label="Fechar">
            <i class="bi bi-chevron-double-down chevrons"></i>
          </button>
        </div>
      </header>

      <div class="chat-body">
        <aside class="conversations">
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input v-model="query" type="text" placeholder="Buscar conversas" />
          </div>

          <ul class="conv-list">
            <li
              v-for="conv in filteredConversations"
              :key="conv.id"
              :class="['conv-item', { active: conv.id === selectedId }]"
              @click="selectConversation(conv.id)"
            >
              <img
                class="avatar"
                :src="conv.otherUser.avatar"
                :alt="conv.otherUser.name"
              />
              <div class="conv-info">
                <div class="row">
                  <span class="name">{{ conv.otherUser.name }}</span>
                  <span class="time">{{ timeAgo(conv.lastTimestamp) }}</span>
                </div>
                <div class="row">
                  <span class="last">{{ conv.lastMessage }}</span>
                  <span v-if="conv.unread" class="badge">{{
                    conv.unread
                  }}</span>
                </div>
              </div>
            </li>
          </ul>
        </aside>

        <section class="chat">
          <div v-if="!selectedId" class="empty-state">
            <i class="bi bi-envelope-open"></i>
            <p>Selecione uma conversa para começar</p>
          </div>

          <template v-else>
            <div class="chat-title">
              <img
                class="avatar"
                :src="selectedConversation?.otherUser.avatar"
                :alt="selectedConversation?.otherUser.name"
              />
              <div class="meta">
                <h4>{{ selectedConversation?.otherUser.name }}</h4>
                <span class="sub">Conversando agora</span>
              </div>
            </div>

            <div class="messages" ref="messagesRef">
              <div
                v-for="m in messages"
                :key="m.id"
                :class="['bubble', { me: m.senderId === currentUserId }]"
              >
                <p class="text">{{ m.text }}</p>
                <span class="ts">{{ formatTime(m.timestamp) }}</span>
              </div>
            </div>

            <form class="composer" @submit.prevent="handleSend">
              <input
                v-model="draft"
                type="text"
                placeholder="Escreva uma mensagem..."
                @keydown.enter.exact.prevent="handleSend"
              />
              <button type="submit" :disabled="!draft.trim()">
                <i class="bi bi-send"></i>
              </button>
            </form>
          </template>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import {
  fetchConversationsFromBackend,
  fetchMessagesFromBackend,
  sendMessageToBackend,
} from "@/services/messagesService";

// Obtém as stores de autenticação e carrinho
const auth = useAuthStore();
const cartStore = useCartStore();
// ID do usuário logado
const currentUserId = computed(() => auth.user?.id || 0);

// Controla a visibilidade do widget de chat
const isOpen = ref(false);
// Termo de busca para as conversas
const query = ref("");
// Lista de conversas carregadas
const conversations = ref([]);
// ID da conversa selecionada
const selectedId = ref("");
// Mensagens da conversa selecionada
const messages = ref([]);
// Texto da nova mensagem a ser enviada
const draft = ref("");
// Referência para o contêiner de mensagens (para scroll)
const messagesRef = ref(null);

// Filtra as conversas com base na busca do usuário
const filteredConversations = computed(() => {
  const q = query.value.toLowerCase().trim();
  if (!q) return conversations.value;
  return conversations.value.filter(
    (c) =>
      c.otherUser.name.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
  );
});

// Encontra a conversa atualmente selecionada na lista
const selectedConversation = computed(() =>
  conversations.value.find((c) => c.id === selectedId.value)
);

// Define o título do cabeçalho do chat
const headerTitle = computed(
  () => selectedConversation.value?.otherUser?.name || "Mensagens"
);

// Abre ou fecha o painel de mensagens
function toggleOpen(v) {
  isOpen.value = v;
  if (v === true && conversations.value.length === 0) {
    loadConversations();
  }
}

// Formata um timestamp para tempo relativo (ex: "5 min atrás")
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  return `${d} d`;
}

// Formata um timestamp para hora local (ex: "14:30")
function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// Carrega a lista de conversas do backend
async function loadConversations() {
  try {
    conversations.value = await fetchConversationsFromBackend();
  } catch (error) {
    console.error("Falha ao carregar conversas no componente.", error);
  }
}

// Seleciona uma conversa e carrega suas mensagens
async function selectConversation(id) {
  selectedId.value = id;
  messages.value = [];
  try {
    messages.value = await fetchMessagesFromBackend(id);
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("Falha ao carregar mensagens no componente.", error);
  }
}

// Rola a visualização de mensagens para o final
function scrollToBottom() {
  const el = messagesRef.value;
  if (el) el.scrollTop = el.scrollHeight;
}

// Envia a mensagem digitada para o backend
async function handleSend() {
  const text = draft.value.trim();
  if (!text || !selectedId.value) return;

  try {
    const msg = await sendMessageToBackend(selectedId.value, text);

    if (msg) {
      messages.value.push(msg);
      draft.value = "";
      await nextTick();
      scrollToBottom();
    }
  } catch (error) {
    console.error("Falha ao enviar mensagem no componente.", error);
  }
}

// Hook do ciclo de vida, executado quando o componente é montado
onMounted(() => {});
</script>

<style scoped>
.chat-fab {
  position: fixed;
  right: 20px;
  bottom: 20px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 18px 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  font-weight: 600;
  z-index: 9990;
  transition: right 0.3s ease, bottom 0.3s ease;
}

.chat-fab.shifted {
  right: 380px;
}

.chat-fab .label {
  display: none;
  font-size: 16px;
}
@media (min-width: 420px) {
  .chat-fab .label {
    display: inline;
  }
}

.chat-panel {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: min(920px, 96vw);
  height: 520px;
  font-size: 16px;
  background: var(--color-card-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 12px 30px var(--color-card-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9995;
  transition: right 0.3s ease, width 0.3s ease;
}

.chat-panel.shifted {
  right: 380px;
}

.chat-header {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  background: var(--color-navbar-background);
  border-bottom: 1px solid var(--color-border);
}
.chat-header .title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}
.chat-header .actions .icon {
  background: transparent;
  border: none;
  cursor: pointer;
}
.chat-header .actions .icon .chevrons {
  color: var(--color-primary);
  font-size: 1.2rem;
}
.chat-header .actions .icon .bi-x {
  color: var(--color-text);
}

.chat-body {
  display: grid;
  grid-template-columns: 320px 1fr;
  height: 100%;
}

.conversations {
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-bottom: 1px solid var(--color-border);
}
.search-box input {
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 8px 10px;
  background: var(--color-background);
  color: var(--color-text);
}
.conv-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
}
.conv-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
  align-items: center;
}
.conv-item.active {
  background: var(--color-background-mute);
}
.conv-item:hover {
  background: var(--color-background-mute);
}
.conv-item .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.conv-info {
  flex: 1;
}
.conv-info .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.conv-info .name {
  font-weight: 700;
  color: var(--color-heading);
}
.conv-info .last {
  color: var(--color-text);
  opacity: 0.9;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.badge {
  background: var(--color-primary);
  color: #fff;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 0.75rem;
}

.chat {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.chat-title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid var(--color-border);
}
.chat-title .avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
.chat-title .meta h4 {
  margin: 0;
}
.chat-title .meta .sub {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.9;
}

.empty-state {
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--color-text);
}

.messages {
  flex: 1;
  padding: 14px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bubble {
  max-width: 70%;
  background: var(--color-background-mute);
  color: var(--color-text);
  padding: 10px 12px;
  border-radius: 12px;
  align-self: flex-start;
}
.bubble.me {
  background: var(--color-primary);
  color: #fff;
  align-self: flex-end;
}
.bubble .ts {
  display: block;
  font-size: 0.75rem;
  opacity: 0.85;
  margin-top: 4px;
}

.composer {
  display: flex;
  gap: 8px;
  padding: 10px;
  border-top: 1px solid var(--color-border);
}
.composer input {
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 10px 12px;
  background: var(--color-background);
  color: var(--color-text);
}
.composer button {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 0 14px;
  cursor: pointer;
}

@media (max-width: 920px) {
  .chat-body {
    grid-template-columns: 1fr;
  }

  .chat-panel.chat-active .conversations {
    display: none;
  }

  .conversations {
    display: flex;
    border-right: none;
  }

  .chat {
    display: none;
  }

  .chat-panel.chat-active .chat {
    display: flex;
  }

  .chat-panel {
    width: min(400px, 96vw);
    height: 90vh;
    right: 10px;
    bottom: 10px;
  }

  .chat-fab.shifted,
  .chat-panel.shifted {
    right: 380px;
  }
}

@media (max-width: 480px) {
  .chat-panel {
    width: 100vw;
    height: 100vh;
    right: 0;
    bottom: 0;
    border-radius: 0;
  }

  .chat-fab {
    right: 10px;
    bottom: 10px;
    padding: 14px;
  }

  .chat-fab.shifted {
    right: 10px;
  }

  .chat-panel.shifted {
    right: 0;
  }

  .chat-fab .label {
    display: none;
  }

  .conv-item .last {
    max-width: 120px;
  }
}
</style>
