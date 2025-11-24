import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import MessagesWidget from "@/components/MessagesWidget.vue";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import * as messagesService from "@/services/messagesService";

vi.mock("@/services/messagesService", () => ({
  fetchConversationsFromBackend: vi.fn(),
  fetchMessagesFromBackend: vi.fn(),
  sendMessageToBackend: vi.fn(),
}));

describe("MessagesWidget.vue", () => {
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    // Reset mocks antes de cada teste
    vi.clearAllMocks();

    // Mock de dados para conversas e mensagens
    messagesService.fetchConversationsFromBackend.mockResolvedValue([
      {
        id: "conv1",
        otherUser: { id: 2, name: "Alice", avatar: "avatar-alice.jpg" },
        lastTimestamp: Date.now() - 60 * 1000, // 1 minute ago
        lastMessage: "Olá!",
        unread: 1,
      },
      {
        id: "conv2",
        otherUser: { id: 3, name: "Bob", avatar: "avatar-bob.jpg" },
        lastTimestamp: Date.now() - 3600 * 1000, // 1 hour ago
        lastMessage: "Tudo bem?",
        unread: 0,
      },
    ]);

    messagesService.fetchMessagesFromBackend.mockResolvedValue([
      { id: 1, senderId: 2, text: "Olá!", timestamp: Date.now() - 60 * 1000 },
      { id: 2, senderId: 1, text: "Oi Alice!", timestamp: Date.now() - 30 * 1000 },
    ]);

    messagesService.sendMessageToBackend.mockImplementation((convId, text) =>
      Promise.resolve({
        id: Date.now(),
        senderId: 1,
        text,
        timestamp: Date.now(),
      })
    );

    const authStore = useAuthStore();
    authStore.user = { id: 1, name: "Current User" };

    const cartStore = useCartStore();
    cartStore.isOpen = false;
  });

  const mountMessagesWidget = () => {
    return mount(MessagesWidget, {
      global: {
        plugins: [pinia], // Usa a instância pinia do escopo do teste
      },
    });
  };

  it("renderiza o botão FAB quando fechado", () => {
    const wrapper = mountMessagesWidget();
    expect(wrapper.find(".chat-fab").exists()).toBe(true);
    expect(wrapper.find(".chat-panel").exists()).toBe(false);
  });

  it("abre o painel de chat e carrega conversas ao clicar no FAB", async () => {
    const wrapper = mountMessagesWidget();
    await wrapper.find(".chat-fab").trigger("click");

    expect(wrapper.find(".chat-panel.open").exists()).toBe(true);
    expect(messagesService.fetchConversationsFromBackend).toHaveBeenCalled();
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(".conv-item")).toHaveLength(2);
    expect(wrapper.text()).toContain("Alice");
  });

  it("fecha o painel de chat ao clicar no botão de fechar", async () => {
    const wrapper = mountMessagesWidget();
    await wrapper.find(".chat-fab").trigger("click"); // Abre
    await wrapper.find(".chat-header .actions .icon").trigger("click"); // Fecha

    expect(wrapper.find(".chat-panel.open").exists()).toBe(false);
    expect(wrapper.find(".chat-fab").exists()).toBe(true);
  });

  it("seleciona uma conversa e carrega as mensagens", async () => {
    const wrapper = mountMessagesWidget();
    await wrapper.find(".chat-fab").trigger("click"); // Abre
    await wrapper.vm.$nextTick();

    await wrapper.find(".conv-item").trigger("click"); // Clica na primeira conversa
    expect(messagesService.fetchMessagesFromBackend).toHaveBeenCalledWith("conv1");
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(".bubble")).toHaveLength(2);
    expect(wrapper.text()).toContain("Olá!");
    expect(wrapper.text()).toContain("Oi Alice!");
  });

  it("filtra conversas pela query de busca", async () => {
    const wrapper = mountMessagesWidget();
    await wrapper.find(".chat-fab").trigger("click");
    await wrapper.vm.$nextTick();

    const searchInput = wrapper.find(".search-box input");
    await searchInput.setValue("alice");
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll(".conv-item")).toHaveLength(1);
    expect(wrapper.text()).toContain("Alice");
    expect(wrapper.text()).not.toContain("Bob");

    await searchInput.setValue("tudo");
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll(".conv-item")).toHaveLength(1);
    expect(wrapper.text()).not.toContain("Alice");
    expect(wrapper.text()).toContain("Bob");
  });

  it("envia uma mensagem e a adiciona à lista", async () => {
    const wrapper = mountMessagesWidget();
    await wrapper.find(".chat-fab").trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.find(".conv-item").trigger("click");
    await wrapper.vm.$nextTick();

    const messageInput = wrapper.find(".composer input");
    await messageInput.setValue("Minha nova mensagem");
    await wrapper.find(".composer").trigger("submit.prevent"); // Dispara o evento de submit no formulário
    await wrapper.vm.$nextTick();

    expect(messagesService.sendMessageToBackend).toHaveBeenCalledWith("conv1", "Minha nova mensagem");
    // Verifica se a mensagem foi adicionada à UI
    expect(wrapper.text()).toContain("Minha nova mensagem");
    expect(wrapper.findAll(".bubble")).toHaveLength(3); // 2 mocks + 1 nova
    expect(messageInput.element.value).toBe(""); // Input deve ser limpo
  });

  it("FAB é shifted quando o carrinho está aberto", async () => {
    const cartStore = useCartStore();
    cartStore.isOpen = true;

    const wrapper = mountMessagesWidget();
    expect(wrapper.find(".chat-fab").classes()).toContain("shifted");
  });

  it("Chat panel é shifted quando o carrinho está aberto", async () => {
    const cartStore = useCartStore();
    cartStore.isOpen = true;
    
    const wrapper = mountMessagesWidget();
    await wrapper.find(".chat-fab").trigger("click"); // Abre o chat
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".chat-panel.open").classes()).toContain("shifted");
  });
});
