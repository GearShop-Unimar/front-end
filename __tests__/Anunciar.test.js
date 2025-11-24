import { mount } from "@vue/test-utils";
import Anunciar from "../src/views/Anunciar.vue";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";

// Mocking Pinia store
const mockAddProduct = vi.fn(() => Promise.resolve());
const mockProductStore = {
  loading: false,
  addProduct: mockAddProduct,
};
vi.mock("../src/stores/product.js", () => ({
  useProductStore: () => mockProductStore,
}));

beforeEach(() => {
  mockAddProduct.mockClear();
  mockProductStore.loading = false;
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: { template: "<div></div>" } },
    { path: "/produtos", component: { template: "<div>Produtos</div>" } },
  ],
});

describe("Anunciar.vue", () => {
  it("renders the form correctly", async () => {
    const pinia = createPinia();
    const wrapper = mount(Anunciar, {
      global: {
        plugins: [pinia, router],
      },
    });
    await router.isReady();

    expect(wrapper.find("h1").text()).toContain("Anuncie seu Produto");
    expect(wrapper.find("form").exists()).toBe(true);
    expect(wrapper.find("#nome").exists()).toBe(true);
    expect(wrapper.find("#categoria").exists()).toBe(true);
    expect(wrapper.find("#estoque").exists()).toBe(true);
    expect(wrapper.find("#modelo").exists()).toBe(true);
    expect(wrapper.find("#preco").exists()).toBe(true);
    expect(wrapper.find("#estado").exists()).toBe(true);
    expect(wrapper.find("#descricao").exists()).toBe(true);
    expect(wrapper.find("#imagem").exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it("updates form fields correctly", async () => {
    const pinia = createPinia();
    const wrapper = mount(Anunciar, {
      global: {
        plugins: [pinia, router],
      },
    });
    await router.isReady();

    await wrapper.find("#nome").setValue("Jogo de Velas");
    expect(wrapper.vm.produto.nome).toBe("Jogo de Velas");

    await wrapper.find("#categoria").setValue("Motor e Ignição");
    expect(wrapper.vm.produto.categoria).toBe("Motor e Ignição");

    await wrapper.find("#estoque").setValue(10);
    expect(wrapper.vm.produto.estoque).toBe(10);

    await wrapper.find("#modelo").setValue("VW Gol");
    expect(wrapper.vm.produto.modelo).toBe("VW Gol");

    const precoInput = wrapper.find("#preco");
    await precoInput.setValue("123,45");
    precoInput.trigger("input");
    expect(wrapper.vm.produto.preco).toBe(123.45);

    await wrapper.find("#estado").setValue("Nova");
    expect(wrapper.vm.produto.estado).toBe("Nova");

    await wrapper.find("#descricao").setValue("Descrição detalhada.");
    expect(wrapper.vm.produto.descricao).toBe("Descrição detalhada.");
  });

  it("shows image preview when an image is selected", async () => {
    const pinia = createPinia();
    const wrapper = mount(Anunciar, {
      global: {
        plugins: [pinia, router],
      },
    });
    await router.isReady();

    const file = new File(["dummy content"], "test.png", { type: "image/png" });

    const readAsDataURLMock = vi.fn();
    let onloadCallback;
    global.FileReader = class {
      constructor() {
        this.onload = null;
        this.result = "";
      }

      readAsDataURL(file) {
        readAsDataURLMock(file);
        onloadCallback = this.onload;
        // Simular a leitura de forma assíncrona
        setTimeout(() => {
          if (onloadCallback) {
            onloadCallback({
              target: { result: "data:image/png;base64,mocked-base64-image" },
            });
          }
        }, 100);
      }
    };

    // CORREÇÃO: Chamar o método do componente diretamente
    wrapper.vm.selecionarImagem({ target: { files: [file] } });

    expect(readAsDataURLMock).toHaveBeenCalledWith(file);
    if (onloadCallback) {
      onloadCallback({
        target: { result: "data:image/png;base64,mocked-base64-image" },
      });
    }

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".img-preview-container").exists()).toBe(true);
    expect(wrapper.find(".img-preview-container img").attributes("src")).toBe(
      "data:image/png;base64,mocked-base64-image"
    );
  });

  it("removes image preview when remove button is clicked", async () => {
    const pinia = createPinia();
    const wrapper = mount(Anunciar, {
      global: {
        plugins: [pinia, router],
      },
    });
    await router.isReady();

    wrapper.vm.imagemPreview = "data:image/png;base64,mocked-base64-image";
    wrapper.vm.produto.arquivoImagem = new File(["dummy"], "test.png", {
      type: "image/png",
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".img-preview-container").exists()).toBe(true);

    await wrapper.find(".remove-btn").trigger("click");

    expect(wrapper.find(".img-preview-container").exists()).toBe(false);
    expect(wrapper.vm.imagemPreview).toBe(null);
    expect(wrapper.vm.produto.arquivoImagem).toBe(null);
  });

  it("submits product data and redirects on success", async () => {
    const pinia = createPinia();
    mockAddProduct.mockClear();
    mockAddProduct.mockImplementation(() => Promise.resolve());

    const wrapper = mount(Anunciar, {
      global: {
        plugins: [pinia, router],
      },
    });
    await router.isReady();

    await wrapper.find("#nome").setValue("Produto Teste");
    await wrapper.find("#categoria").setValue("Motor e Ignição");
    await wrapper.find("#estoque").setValue(5);
    await wrapper.find("#modelo").setValue("Modelo X");
    const precoInput = wrapper.find("#preco");
    await precoInput.setValue("100,00");
    precoInput.trigger("input");
    await wrapper.find("#estado").setValue("Nova");
    await wrapper.find("#descricao").setValue("Descrição do produto.");

    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    wrapper.vm.produto.arquivoImagem = file;

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const pushSpy = vi.spyOn(router, "push").mockImplementation(() => {});

    await wrapper.find("form").trigger("submit");

    expect(mockAddProduct).toHaveBeenCalledWith({
      name: "Produto Teste",
      description: "Condição: Nova.\nDescrição do produto.",
      price: 100,
      stockQuantity: 5,
      category: "Motor e Ignição",
      compatibleModel: "Modelo X",
      imageFile: file,
    });

    expect(alertSpy).toHaveBeenCalledWith("Peça anunciada com sucesso!");
    expect(pushSpy).toHaveBeenCalledWith("/produtos");

    alertSpy.mockRestore();
    pushSpy.mockRestore();
  });

  it("displays error message on submission failure", async () => {
    const pinia = createPinia();
    mockAddProduct.mockClear();
    mockAddProduct.mockImplementation(() =>
      Promise.reject(new Error("API Error"))
    );

    const wrapper = mount(Anunciar, {
      global: {
        plugins: [pinia, router],
      },
    });
    await router.isReady();

    await wrapper.find("#nome").setValue("Produto Teste");
    await wrapper.find("#categoria").setValue("Motor e Ignição");
    await wrapper.find("#estoque").setValue(1);
    await wrapper.find("#modelo").setValue("Modelo X");
    const precoInput = wrapper.find("#preco");
    await precoInput.setValue("10,00");
    precoInput.trigger("input");
    await wrapper.find("#estado").setValue("Nova");
    await wrapper.find("#descricao").setValue("Descrição.");

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await wrapper.find("form").trigger("submit");
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".error-message.alert").exists()).toBe(true);
    expect(wrapper.find(".error-message.alert").text()).toContain(
      "Erro ao publicar. Verifique os dados e tente novamente."
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith("Erro:", expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
