import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Icon from "@/components/Icon.vue";

describe("Icon.vue", () => {
  const mountIcon = (props = {}) => {
    return mount(Icon, {
      props: {
        ...props,
      },
      global: {
        stubs: {
          // Permite testar slots, se houver
          default: true,
        },
      },
    });
  };

  it("renderiza com lib 'material' por padrão e o nome correto", () => {
    const wrapper = mountIcon({ name: "home" });
    expect(wrapper.find("span").classes()).toContain("material-symbols-outlined");
    expect(wrapper.text()).toContain("home");
  });

  it("renderiza com lib 'fa' e a classe correta", () => {
    const wrapper = mountIcon({ lib: "fa", name: "fa-home" });
    expect(wrapper.find("i").classes()).toContain("fa-home");
    expect(wrapper.find("i").classes()).toContain("fa");
  });

  it("renderiza com lib 'bi' e a classe correta", () => {
    const wrapper = mountIcon({ lib: "bi", name: "house" }); // Testa com nome simples
    expect(wrapper.find("i").classes()).toContain("bi-house");
    expect(wrapper.find("i").classes()).toContain("bi");
  });

  it("renderiza um slot SVG quando lib é 'svg'", () => {
    const wrapper = mount(Icon, {
      props: { lib: "svg" },
      slots: {
        default: '<svg class="test-svg"></svg>',
      },
    });
    expect(wrapper.find(".test-svg").exists()).toBe(true);
  });

  it("aplica o tamanho e a cor via estilo computado", () => {
    const wrapper = mountIcon({ name: "test", size: 32, color: "red" });
    const span = wrapper.find("span");
    expect(span.attributes("style")).toContain("font-size: 32px;");
    expect(span.attributes("style")).toContain("color: red;");
  });

  it("aplica a customClass", () => {
    const wrapper = mountIcon({ name: "test", customClass: "my-custom-class" });
    expect(wrapper.find("span").classes()).toContain("my-custom-class");
  });

  it("aplica o fallback quando a lib é desconhecida", () => {
    const wrapper = mountIcon({ lib: "unknown", fallback: "❌" });
    expect(wrapper.find(".icon-fallback").exists()).toBe(true);
    expect(wrapper.text()).toContain("❌");
  });

  it("aplica a animação de rotação (spin)", () => {
    const wrapper = mountIcon({ name: "loading", spin: true });
    expect(wrapper.find("span").attributes("style")).toContain("animation: icon-spin 1s linear infinite;");
  });

  it("ajusta a classe FA para nomes simples (ex: 'home' -> 'fa fa-home')", () => {
    const wrapper = mountIcon({ lib: "fa", name: "home" });
    expect(wrapper.find("i").classes()).toContain("fa");
    expect(wrapper.find("i").classes()).toContain("fa-home");
  });

  it("não altera a classe FA se já estiver completa (ex: 'fas fa-home')", () => {
    const wrapper = mountIcon({ lib: "fa", name: "fas fa-home" });
    expect(wrapper.find("i").classes()).toContain("fas");
    expect(wrapper.find("i").classes()).toContain("fa-home");
    // Garante que não adiciona um 'fa' duplicado
    expect(wrapper.find("i").classes().filter(c => c === 'fa').length).toBe(0);
  });
});
