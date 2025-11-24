import Navbar from "@/components/Navbar.vue";
import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import { createPinia, setActivePinia } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";

const routes = [
  { path: "/", component: { template: "<div>Home</div>" } },
  { path: "/produtos", component: { template: "<div>Produtos</div>" } },
  { path: "/contato", component: { template: "<div>Contato</div>" } },
  { path: "/posts", component: { template: "<div>Posts</div>" } },
  { path: "/anunciar", component: { template: "<div>Anunciar</div>" } },
  { path: "/login", component: { template: "<div>Login</div>" } },
  { path: "/cadastro", component: { template: "<div>Cadastro</div>" } },
  { path: "/fidelidade", component: { template: "<div>Fidelidade</div>" } },
  { path: "/perfil", component: { template: "<div>Perfil</div>" } },
];
const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

let authStore;
let cartStore;

const mountNavbar = (options = {}) => {
  return mount(Navbar, {
    global: {
      plugins: [router],
      stubs: {
        Carrinho: true,
      },
    },
    ...options,
  });
};

describe("Navbar.vue", () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    authStore = useAuthStore();
    cartStore = useCartStore();

    authStore.user = null;
    vi.spyOn(authStore, "isAuthenticated", "get").mockReturnValue(false);

    await router.push("/");
    await router.isReady();
  });

  it("renderiza o nome da loja corretamente", () => {
    const wrapper = mountNavbar();
    expect(wrapper.text()).toContain("GearShop");
  });

  it("exibe os links de navegação para um usuário deslogado", () => {
    const wrapper = mountNavbar();
    const links = wrapper.findAll("a");
    const textos = links.map((l) => l.text());

    expect(textos).toEqual(
      expect.arrayContaining([
        "Home",
        "Posts",
        "Produtos",
        "Anunciar",
        "Fidelidade",
        "Entrar",
        "Cadastre-se",
      ])
    );
  });

  it("exibe os itens de usuário autenticado quando logado", async () => {
    vi.spyOn(authStore, "isAuthenticated", "get").mockReturnValue(true);
    authStore.user = { id: "testUser", name: "Teste" };

    const wrapper = mountNavbar();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('a[href="/perfil"]').exists()).toBe(true);
    expect(wrapper.find(".logout-btn").exists()).toBe(true);
    expect(wrapper.text()).toContain("Olá, Teste!");
    expect(wrapper.find('a[href="/login"]').exists()).toBe(false);
    expect(wrapper.find('a[href="/cadastro"]').exists()).toBe(false);
  });

  it("chama toggleCart da cartStore ao clicar no ícone do carrinho", async () => {
    vi.spyOn(authStore, "isAuthenticated", "get").mockReturnValue(true);
    authStore.user = { id: "testUser", name: "Teste" };

    const toggleCartSpy = vi.spyOn(cartStore, "toggleCart");

    const wrapper = mountNavbar();
    await wrapper.vm.$nextTick();

    const cartButton = wrapper.find(".cart-btn-wrapper");
    expect(cartButton.exists()).toBe(true);
    await cartButton.trigger("click");

    expect(toggleCartSpy).toHaveBeenCalledTimes(1);
    vi.restoreAllMocks();
  });

  it("tem o logo visível (que é um link para a home)", () => {
    const wrapper = mountNavbar();
    const logoLink = wrapper.find('a[href="/"]');
    expect(logoLink.exists()).toBe(true);
    expect(logoLink.text()).toContain("GearShop");
  });

  it("marca o link ativo corretamente ao navegar", async () => {
    const wrapper = mountNavbar();
    await router.push("/produtos");
    await wrapper.vm.$nextTick();
    const productsLink = wrapper.find('a[href="/produtos"]');
    expect(productsLink.classes()).toContain("router-link-active");
  });

  it("mantém a estrutura visual esperada (snapshot)", () => {
    const wrapper = mountNavbar();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
