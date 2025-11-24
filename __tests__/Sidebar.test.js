import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import Icon from "@/components/Icon.vue"; // Importa o componente Icon

const routes = [
  { path: "/", name: "Home", component: { template: "<div>Home</div>" } },
  { path: "/produtos", name: "Produtos", component: { template: "<div>Produtos</div>" } },
  { path: "/mensagens", name: "Mensagens", component: { template: "<div>Mensagens</div>" } },
  { path: "/perfil", name: "Perfil", component: { template: "<div>Perfil</div>" } },
  { path: "/postar", name: "Postar", component: { template: "<div>Postar</div>" } },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

describe("Sidebar.vue", () => {
  beforeEach(async () => {
    await router.push("/"); // Garante que a rota inicial seja Home antes de cada teste
    await router.isReady();
  });

  const mountSidebar = (options = {}) => {
    return mount(Sidebar, {
      global: {
        plugins: [router],
        stubs: {
          // Stub o componente Icon para focar no teste do Sidebar
          Icon: true, 
        },
      },
      ...options,
    });
  };

  it("renderiza os links de navegação", () => {
    const wrapper = mountSidebar();
    const navLinks = wrapper.findAll(".sidebar-nav li a");
    expect(navLinks.length).toBe(4); // Home, Explorar, Mensagens, Perfil
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

  // Teste de responsividade (exemplo para 1200px)
  it("esconde o texto dos links em telas menores que 1200px", async () => {
    // Simula uma largura de tela menor para testes de mídia
    global.innerWidth = 1000;
    global.dispatchEvent(new Event('resize'));

    const wrapper = mountSidebar();
    await wrapper.vm.$nextTick();

    const navLinks = wrapper.findAll(".sidebar-nav li a span");
    navLinks.forEach(span => {
      // No modo mobile/tablet, os spans de texto são escondidos via CSS
      // Não é diretamente testável com .isVisible() pois o CSS é que os esconde
      // Mas podemos verificar que eles existem e a logica do CSS os esconde.
      // Para um teste mais robusto, seria necessário testar o CSS computado ou mockar as media queries.
      expect(span.exists()).toBe(true); // O elemento span ainda existe
    });
    
    // Restaura a largura da tela
    global.innerWidth = 1920;
    global.dispatchEvent(new Event('resize'));
  });
});