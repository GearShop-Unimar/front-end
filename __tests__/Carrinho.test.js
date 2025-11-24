import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import { createPinia, setActivePinia } from "pinia";
import Carrinho from "@/components/Carrinho.vue";
import { useCartStore } from "@/stores/cart";

// Mock do router
const routes = [
  { path: "/pagamento", component: { template: "Pagamento" } },
  { path: "/produto/:id", component: { template: "Produto" } },
];
const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

describe("Carrinho.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const mountCarrinho = () => {
    return mount(Carrinho, {
      global: {
        plugins: [router],
      },
    });
  };

  it("não renderiza o carrinho se a store diz que está fechado", () => {
    const cartStore = useCartStore();
    cartStore.isOpen = false;
    const wrapper = mountCarrinho();
    expect(wrapper.find(".cart-sidebar").classes()).not.toContain("open");
  });

  it("renderiza o carrinho quando a store diz que está aberto", () => {
    const cartStore = useCartStore();
    cartStore.isOpen = true;
    const wrapper = mountCarrinho();
    expect(wrapper.find(".cart-sidebar").classes()).toContain("open");
  });

  it('exibe a mensagem "Seu carrinho está vazio" quando não há itens', () => {
    const cartStore = useCartStore();
    cartStore.isOpen = true;
    cartStore.items = [];
    const wrapper = mountCarrinho();
    expect(wrapper.text()).toContain("Seu carrinho está vazio.");
  });

  it("exibe os itens do carrinho corretamente", () => {
    const cartStore = useCartStore();
    cartStore.isOpen = true;
    cartStore.items = [
      {
        id: 1,
        quantity: 2,
        product: { id: "prod1", name: "Produto A", price: 10.0 },
      },
      {
        id: 2,
        quantity: 1,
        product: { id: "prod2", name: "Produto B", price: 25.5 },
      },
    ];
    const wrapper = mountCarrinho();
    expect(wrapper.findAll(".cart-item").length).toBe(2);
    expect(wrapper.text()).toContain("Produto A");
    expect(wrapper.text()).toContain("R$ 20.00");
    expect(wrapper.text()).toContain("Produto B");
    expect(wrapper.text()).toContain("R$ 25.50");
  });

  it("chama toggleCart ao clicar no botão de fechar", async () => {
    const cartStore = useCartStore();
    cartStore.isOpen = true;
    const toggleCartSpy = vi.spyOn(cartStore, "toggleCart");
    const wrapper = mountCarrinho();

    await wrapper.find(".close-btn").trigger("click");
    expect(toggleCartSpy).toHaveBeenCalled();
  });

  it("chama removeItem ao clicar no botão de remover", async () => {
    const cartStore = useCartStore();
    cartStore.isOpen = true;
    cartStore.items = [
      {
        id: 1,
        quantity: 1,
        product: { id: "prod1", name: "Produto A", price: 10.0 },
      },
    ];
    const removeItemSpy = vi.spyOn(cartStore, "removeItem");
    const wrapper = mountCarrinho();

    await wrapper.find(".remove-btn").trigger("click");
    expect(removeItemSpy).toHaveBeenCalledWith(1);
  });

  it("navega para a página de pagamento ao clicar em 'Finalizar Compra'", async () => {
    const cartStore = useCartStore();
    cartStore.isOpen = true;
    cartStore.items = [{ id: 1, quantity: 1, product: { id: "prod1", name: "Produto A", price: 10.0 } }];
    const pushSpy = vi.spyOn(router, "push");
    const wrapper = mountCarrinho();

    await wrapper.find(".checkout-btn").trigger("click");
    expect(pushSpy).toHaveBeenCalledWith("/pagamento");
  });

  it("navega para a página do produto ao clicar em um item", async () => {
    const cartStore = useCartStore();
    cartStore.isOpen = true;
    cartStore.items = [
      {
        id: 1,
        quantity: 1,
        product: { id: "prod123", name: "Produto Clicável", price: 50.0 },
      },
    ];
    const pushSpy = vi.spyOn(router, "push");
    const wrapper = mountCarrinho();

    await wrapper.find(".cart-item").trigger("click");
    expect(pushSpy).toHaveBeenCalledWith("/produto/prod123");
  });

  it("exibe o preço total corretamente", () => {
    const cartStore = useCartStore();
    cartStore.isOpen = true;
    cartStore.items = [
      { id: 1, quantity: 2, product: { price: 10 } },
      { id: 2, quantity: 1, product: { price: 5.5 } }
    ];
    
    const wrapper = mountCarrinho();

    // Em vez de mockar o getter, calculamos o valor esperado e verificamos na UI
    const expectedTotal = (2 * 10 + 1 * 5.5).toFixed(2);
    expect(wrapper.find('.total-row').text()).toContain(`R$ ${expectedTotal}`);
  });

  it("chama removeItem para todos os itens ao confirmar esvaziar carrinho", async () => {
    const cartStore = useCartStore();
    cartStore.isOpen = true;
    cartStore.items = [
      { id: 1, quantity: 1, product: { id: "prod1", name: "Produto A", price: 10.0 } },
      { id: 2, quantity: 1, product: { id: "prod2", name: "Produto B", price: 20.0 } },
    ];
    const removeItemSpy = vi.spyOn(cartStore, "removeItem");
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    
    const wrapper = mountCarrinho();

    await wrapper.find(".btn-clear-all").trigger("click");
    
    expect(confirmSpy).toHaveBeenCalledWith("Tem certeza que deseja esvaziar o carrinho?");
    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(removeItemSpy).toHaveBeenCalledWith(1);
    expect(removeItemSpy).toHaveBeenCalledWith(2);

    confirmSpy.mockRestore();
  });
});
