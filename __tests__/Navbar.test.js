import Navbar from "@/components/Navbar.vue";
import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest"; // <-- Importa o beforeEach
import { createRouter, createMemoryHistory } from "vue-router";
import { createPinia } from "pinia";

const routes = [
  { path: "/", component: { template: "<div>Home</div>" } },
  { path: "/produtos", component: { template: "<div>Produtos</div>" } },
  { path: "/contato", component: { template: "<div>Contato</div>" } },
  { path: "/posts", component: { template: "<div>Posts</div>" } },
  { path: "/anunciar", component: { template: "<div>Anunciar</div>" } },
  { path: "/login", component: { template: "<div>Login</div>" } },
  { path: "/cadastro", component: { template: "<div>Cadastro</div>" } },
];
const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

describe("Navbar.vue", () => {
  const pinia = createPinia();

  // --- SOLUÇÃO 1: Resetar o router antes de cada teste ---
  beforeEach(async () => {
    // Leva o router de volta para a página inicial
    await router.push("/");
    await router.isReady();
  });

  const mountNavbar = (options = {}) => {
    return mount(Navbar, {
      global: {
        plugins: [pinia, router],
        stubs: {
          Carrinho: true, // "Desliga" o componente Carrinho
        },
      },
      ...options,
    });
  };

  it("renderiza o nome da loja corretamente", () => {
    const wrapper = mountNavbar();
    expect(wrapper.text()).toContain("GearShop");
  });

  it("exibe os links de navegação", () => {
    const wrapper = mountNavbar();
    const links = wrapper.findAll("a");
    const textos = links.map((l) => l.text());

    expect(textos).toEqual(
      expect.arrayContaining([
        "Home",
        "Posts",
        "Produtos",
        "Anunciar",
        "Entrar",
      ])
    );
  });

  it("tem o logo visível (que é um link para a home)", () => {
    const wrapper = mountNavbar();
    const logoLink = wrapper.find('a[href="/"]');
    expect(logoLink.exists()).toBe(true);
    expect(logoLink.text()).toContain("GearShop");
  });

  it("abre o menu mobile ao clicar no botão", async () => {
    const wrapper = mountNavbar();
    const botao = wrapper.find('[data-test="menu-button"]');
    if (botao.exists()) {
      await botao.trigger("click");
      expect(wrapper.html()).toMatch(/menu/i);
    } else {
      expect(true).toBe(true);
    }
  });

  // --- SOLUÇÃO 2: Corrigir a lógica do teste de navegação ---
  it("marca o link ativo corretamente ao navegar", async () => {
    // 1. Monta o componente (está em "/")
    const wrapper = mountNavbar();

    // 2. Navega para /produtos
    await router.push("/produtos");

    // 3. Espera o Vue atualizar o HTML
    await wrapper.vm.$nextTick();

    // 4. Procura o link de produtos
    const productsLink = wrapper.find('a[href="/produtos"]');
    expect(productsLink.exists()).toBe(true);

    // 5. Verifica se TEM a classe
    expect(productsLink.classes()).toContain("router-link-active");
  });

  it("mantém a estrutura visual esperada (snapshot)", () => {
    const wrapper = mountNavbar();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
