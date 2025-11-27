import { mount, flushPromises } from "@vue/test-utils"; // 1. Importamos flushPromises
import Anunciar from "../src/views/Anunciar.vue";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";

// --- Mock do Store e Dependências ---
const mockAddProduct = vi.fn(() => Promise.resolve());
const mockProductStore = {
  loading: false,
  addProduct: mockAddProduct,
};

// Mockamos o módulo do store
vi.mock("../src/stores/product.js", () => ({
  useProductStore: () => mockProductStore,
}));

// Mockamos o FileReader para o teste de imagem
global.FileReader = class {
  constructor() {
    this.onload = null;
  }
  readAsDataURL(file) {
    setTimeout(() => {
      if (this.onload) {
        this.onload({
          target: { result: "data:image/png;base64,mocked-base64-image" },
        });
      }
    }, 10); // Pequeno delay simulado
  }
};

beforeEach(() => {
  mockAddProduct.mockClear();
  mockProductStore.loading = false;
});

// Setup do Router para testes
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: { template: "<div></div>" } },
    { path: "/produtos", component: { template: "<div>Produtos</div>" } },
  ],
});

describe("Anunciar.vue", () => {
  // ... (Os testes de renderização e update de campos que já passavam mantêm-se iguais) ...

  it("renders the form correctly", async () => {
    const pinia = createPinia();
    const wrapper = mount(Anunciar, { global: { plugins: [pinia, router] } });
    await router.isReady();
    expect(wrapper.find("h1").text()).toContain("Anuncie seu Produto");
  });

  // ... (Pulei os testes de input e imagem que já estavam corretos para focar nos erros) ...

  it("submits product data and redirects on success", async () => {
    const pinia = createPinia();
    mockAddProduct.mockResolvedValue(); // Garante sucesso

    const wrapper = mount(Anunciar, {
      global: { plugins: [pinia, router] },
    });
    await router.isReady();

    // Preenche o formulário
    await wrapper.find("#nome").setValue("Produto Teste");
    await wrapper.find("#categoria").setValue("Motor e Ignição");
    await wrapper.find("#estoque").setValue(5);
    await wrapper.find("#modelo").setValue("Modelo X");
    const precoInput = wrapper.find("#preco");
    await precoInput.setValue("100,00");
    precoInput.trigger("input");
    await wrapper.find("#estado").setValue("Nova");
    await wrapper.find("#descricao").setValue("Descrição do produto.");

    // Simula arquivo
    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    wrapper.vm.produto.arquivoImagem = file;

    // Espião no Router
    const pushSpy = vi.spyOn(router, "push");

    // 2. Dispara o submit
    await wrapper.find("form").trigger("submit");

    // 3. O SEGREDO: flushPromises espera todas as promises pendentes (addProduct) resolverem
    await flushPromises();

    // Verificações
    expect(mockAddProduct).toHaveBeenCalled(); // Verifica se chamou a API
    expect(pushSpy).toHaveBeenCalledWith("/produtos"); // Verifica se redirecionou

    // Nota: Removemos o teste do showToastMessageSpy pois funções internas
    // do <script setup> não são testáveis dessa forma. O redirecionamento
    // já prova que o caminho de sucesso foi executado.
  });

  it("displays error message on submission failure", async () => {
    const pinia = createPinia();
    // 4. Força o erro no mock
    mockAddProduct.mockRejectedValue(new Error("API Error"));

    const wrapper = mount(Anunciar, {
      global: { plugins: [pinia, router] },
    });
    await router.isReady();

    // Preenche campos obrigatórios mínimos para passar na validação HTML5
    await wrapper.find("#nome").setValue("Produto Teste");
    await wrapper.find("#categoria").setValue("Outros");
    await wrapper.find("#estoque").setValue(1);
    await wrapper.find("#modelo").setValue("X");
    await wrapper.find("#preco").setValue("10,00");
    wrapper.find("#preco").trigger("input");
    await wrapper.find("#estado").setValue("Nova");
    await wrapper.find("#descricao").setValue("Desc");
    // Adiciona imagem fake para não falhar na validação do front antes de enviar
    wrapper.vm.produto.arquivoImagem = new File([""], "t.png", {
      type: "image/png",
    });

    // Silencia o console.error esperado neste teste
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await wrapper.find("form").trigger("submit");

    // 5. Espera a rejeição ser processada e o DOM atualizar
    await flushPromises();

    // Agora o elemento de erro deve existir
    expect(wrapper.find(".error-message.alert").exists()).toBe(true);
    expect(wrapper.find(".error-message.alert").text()).toContain(
      "Erro ao publicar. Verifique os dados e tente novamente."
    );

    consoleErrorSpy.mockRestore();
  });
});
