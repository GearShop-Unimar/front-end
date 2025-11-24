import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";

const routes = [
  { path: "/", name: "Home", component: { template: "<div>Home</div>" } },
  {
    path: "/produtos",
    name: "Produtos",
    component: { template: "<div>Produtos</div>" },
  },
  {
    path: "/mensagens",
    name: "Mensagens",
    component: { template: "<div>Mensagens</div>" },
  },
  {
    path: "/perfil",
    name: "Perfil",
    component: { template: "<div>Perfil</div>" },
  },
  {
    path: "/postar",
    name: "Postar",
    component: { template: "<div>Postar</div>" },
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

describe("Sidebar.vue", () => {
  beforeEach(async () => {
    await router.push("/");
    await router.isReady();
  });

  const mountSidebar = (options = {}) => {
    return mount(Sidebar, {
      global: {
        plugins: [router],
        stubs: {
          Icon: true,
        },
      },
      ...options,
    });
  };

  it("renderiza os links de navegação", () => {
    const wrapper = mountSidebar();
    const navLinks = wrapper.findAll(".sidebar-nav li a");
    expect(navLinks.length).toBe(4);
    expect(navLinks[0].text()).toContain("Página Inicial");
    expect(navLinks[1].text()).toContain("Explorar");
    expect(navLinks[2].text()).toContain("Mensagens");
    expect(navLinks[3].text()).toContain("Perfil");
  });

  it("o link 'Página Inicial' está ativo na rota inicial", async () => {
    const wrapper = mountSidebar();
    const homeLink = wrapper.find("a[href='/']");
    expect(homeLink.classes()).toContain("router-link-exact-active");
  });

  it("o botão 'Postar' é renderizado e contém o texto correto", () => {
    const wrapper = mountSidebar();
    const postButton = wrapper.find(".post-button");
    expect(postButton.exists()).toBe(true);
    expect(postButton.text()).toContain("Postar");
  });

  it("mantém a estrutura visual esperada (snapshot)", () => {
    const wrapper = mountSidebar();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("esconde o texto dos links em telas menores que 1200px", async () => {
    global.innerWidth = 1000;
    global.dispatchEvent(new Event("resize"));

    const wrapper = mountSidebar();
    await wrapper.vm.$nextTick();

    const navLinks = wrapper.findAll(".sidebar-nav li a span");
    navLinks.forEach((span) => {
      expect(span.exists()).toBe(true);
    });

    global.innerWidth = 1920;
    global.dispatchEvent(new Event("resize"));
  });
});
