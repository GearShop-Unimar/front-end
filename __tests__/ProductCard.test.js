import ProductCard from "@/components/ProductCard.vue";
import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import { createPinia, setActivePinia } from "pinia";
import { useUserStore } from "@/stores/user"; // Movido para o topo
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";

const routes = [
  {
    path: "/produto/:id",
    component: { template: "<div>Detalhes do Produto</div>" },
  },
];
const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

describe("ProductCard.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Mock da user store para previnir chamadas de rede
    const userStore = useUserStore();
    userStore.fetchUserById = vi.fn();
  });

  const mockProduct = {
    id: "123",
    name: "Produto de Teste",
    price: 99.99,
    sellerId: "seller1",
    mainImageUrl: "http://example.com/image.jpg",
    rating: 4,
    reviewCount: 10,
    state: "Novo",
  };

  const mountProductCard = (options = {}) => {
    return mount(ProductCard, {
      global: {
        plugins: [router],
        stubs: {
          // Caso ProductCard use sub-componentes que não precisam ser totalmente renderizados
        },
      },
      props: {
        produto: mockProduct,
      },
      ...options,
    });
  };

  it("renderiza o nome do produto e o preço corretamente", () => {
    const wrapper = mountProductCard();
    expect(wrapper.text()).toContain(mockProduct.name);
    expect(wrapper.text()).toContain(`R$ ${mockProduct.price.toFixed(2)}`);
  });

  it("exibe o nome do vendedor", async () => {
    const userStore = useUserStore();
    // Popula o estado da store ANTES de montar o componente
    userStore.users = { seller1: { name: "Vendedor Teste" } };

    const wrapper = mountProductCard();
    await wrapper.vm.$nextTick(); // Garante que a UI reativa seja atualizada
    expect(wrapper.text()).toContain("Vendedor Teste");
  });

  it("exibe a avaliação por estrelas corretamente", () => {
    const wrapper = mountProductCard();
    const filledStars = wrapper.findAll(".estrela-preenchida");
    expect(filledStars.length).toBe(mockProduct.rating);
    expect(wrapper.text()).toContain(`(${mockProduct.reviewCount} avaliações)`);
  });

  it("chama a função irParaProduto com o ID correto ao clicar no card", async () => {
    const pushSpy = vi.spyOn(router, "push");
    const wrapper = mountProductCard();
    await wrapper.trigger("click");
    expect(pushSpy).toHaveBeenCalledWith(`/produto/${mockProduct.id}`);
    pushSpy.mockRestore();
  });

  it("chama a função addToCart ao clicar no botão quando logado", async () => {
    // Simula um usuário logado
    const authStore = useAuthStore();
    authStore.user = { id: "testUser" };

    const cartStore = useCartStore();
    cartStore.addToCart = vi.fn(); // Mock da função correta

    const wrapper = mountProductCard();
    const addButton = wrapper.find(".btn-carrinho");
    await addButton.trigger("click");

    // Verifica se a função correta foi chamada com os argumentos corretos
    expect(cartStore.addToCart).toHaveBeenCalledWith(mockProduct.id, 1);
  });

  it("exibe o botão de deletar se o usuário for o dono do produto", async () => {
    const authStore = useAuthStore();
    authStore.user = { id: "seller1" }; // Simula que o usuário é o vendedor
    const wrapper = mountProductCard();
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".btn-delete").exists()).toBe(true);
  });

  it("não exibe o botão de deletar se o usuário não for o dono do produto", async () => {
    const authStore = useAuthStore();
    authStore.user = { id: "otherSeller" }; // Simula que o usuário NÃO é o vendedor
    const wrapper = mountProductCard();
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".btn-delete").exists()).toBe(false);
  });

  it("emite o evento 'delete' ao clicar no botão de deletar", async () => {
    const authStore = useAuthStore();
    authStore.user = { id: "seller1" };
    const wrapper = mountProductCard();
    await wrapper.vm.$nextTick();
    const deleteButton = wrapper.find(".btn-delete");
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    await deleteButton.trigger("click");

    expect(confirmSpy).toHaveBeenCalledWith(
      "Tem certeza que deseja excluir este produto?"
    );
    expect(wrapper.emitted()).toHaveProperty("delete");
    expect(wrapper.emitted().delete[0]).toEqual(["123"]);

    confirmSpy.mockRestore();
  });

  it("mantém a estrutura visual esperada (snapshot)", () => {
    const userStore = useUserStore();
    const authStore = useAuthStore();

    // Define um estado consistente para um snapshot previsível
    authStore.user = { id: "otherUser" }; // Não é o dono, para não mostrar o botão de deletar
    userStore.users = { seller1: { name: "Vendedor Teste" } };

    const wrapper = mountProductCard();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
