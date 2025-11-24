import { mount } from "@vue/test-utils";
import Cadastro from "../src/views/Cadastro.vue";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/login", component: { template: "<div>Login</div>" } }],
});

// Mock fetch
global.fetch = vi.fn();

describe("Cadastro.vue", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("renders all form fields correctly", async () => {
    const wrapper = mount(Cadastro, {
      global: {
        plugins: [router],
      },
    });
    await router.isReady();

    expect(wrapper.find("h2").text()).toBe("Crie sua Conta");
    expect(wrapper.find('input[placeholder="Nome completo"]').exists()).toBe(
      true
    );
    expect(
      wrapper.find('input[placeholder="CPF (apenas números)"]').exists()
    ).toBe(true);
    expect(
      wrapper.find('input[placeholder="Telefone (XX) XXXXX-XXXX"]').exists()
    ).toBe(true);
    expect(wrapper.find('input[placeholder="CEP (00000-000)"]').exists()).toBe(
      true
    );
    expect(wrapper.find("select").exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Cidade"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Rua / Logradouro"]').exists()).toBe(
      true
    );
    expect(wrapper.find('input[placeholder="Número da casa"]').exists()).toBe(
      true
    );
    expect(wrapper.find('input[placeholder="Email"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder^="Senha"]').exists()).toBe(true);
    expect(
      wrapper.find('input[placeholder="Confirme sua senha"]').exists()
    ).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it("masks CPF, CEP, and Telefone inputs correctly", async () => {
    const wrapper = mount(Cadastro, {
      global: {
        plugins: [router],
      },
    });
    await router.isReady();

    const cpfInput = wrapper.find('input[placeholder="CPF (apenas números)"]');
    await cpfInput.setValue("12345678900");
    expect(cpfInput.element.value).toBe("123.456.789-00");

    const cepInput = wrapper.find('input[placeholder="CEP (00000-000)"]');
    await cepInput.setValue("12345678");
    expect(cepInput.element.value).toBe("12345-678");

    const telefoneInput = wrapper.find(
      'input[placeholder="Telefone (XX) XXXXX-XXXX"]'
    );
    await telefoneInput.setValue("11987654321");
    expect(telefoneInput.element.value).toBe("(11) 98765-4321");
  });

  it("fetches and fills address fields on CEP blur", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          localidade: "São Paulo",
          logradouro: "Rua Augusta",
          uf: "SP",
        }),
    });

    const wrapper = mount(Cadastro, {
      global: {
        plugins: [router],
      },
    });
    await router.isReady();

    const cepInput = wrapper.find('input[placeholder="CEP (00000-000)"]');
    await cepInput.setValue("01311-000");
    await cepInput.trigger("blur");
    await wrapper.vm.$nextTick();

    expect(fetch).toHaveBeenCalledWith(
      "https://viacep.com.br/ws/01311000/json/"
    );
    expect(wrapper.vm.cidade).toBe("São Paulo");
    expect(wrapper.vm.rua).toBe("Rua Augusta");
    expect(wrapper.vm.estado).toBe("SP");
  });

  it("shows error if passwords do not match", async () => {
    const wrapper = mount(Cadastro, {
      global: {
        plugins: [router],
      },
    });
    await router.isReady();

    // CORREÇÃO: Preencher o CPF com valor válido para que a validação de senha seja a primeira a falhar
    await wrapper.find('input[placeholder="CPF (apenas números)"]').setValue("123.456.789-00");
    // CORREÇÃO: Preencher o CEP com valor válido para que a validação de senha seja a primeira a falhar
    await wrapper.find('input[placeholder="CEP (00000-000)"]').setValue("12345-678");
    await wrapper.find('input[placeholder^="Senha"]').setValue("password123");
    await wrapper
      .find('input[placeholder="Confirme sua senha"]')
      .setValue("password456");

    await wrapper.find("form").trigger("submit");
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".erro").text()).toBe("As senhas não coincidem.");
  });

  it("submits form successfully and redirects to login", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          name: "Test User",
        }),
    });

    const wrapper = mount(Cadastro, {
      global: {
        plugins: [router],
      },
    });
    await router.isReady();
    const pushSpy = vi.spyOn(router, "push").mockImplementation(() => {});

    // Fill the form completely
    await wrapper
      .find('input[placeholder="Nome completo"]')
      .setValue("Test User");
    await wrapper
      .find('input[placeholder="CPF (apenas números)"]')
      .setValue("123.456.789-00");
    await wrapper
      .find('input[placeholder="Telefone (XX) XXXXX-XXXX"]')
      .setValue("(11) 98765-4321");
    await wrapper
      .find('input[placeholder="CEP (00000-000)"]')
      .setValue("12345-678");
    await wrapper.find("select").setValue("SP");
    await wrapper.find('input[placeholder="Cidade"]').setValue("São Paulo");
    await wrapper
      .find('input[placeholder="Rua / Logradouro"]')
      .setValue("Rua Teste");
    await wrapper.find('input[placeholder="Número da casa"]').setValue("123");
    await wrapper
      .find('input[placeholder="Email"]')
      .setValue("test@example.com");
    await wrapper.find('input[placeholder^="Senha"]').setValue("password123");
    await wrapper
      .find('input[placeholder="Confirme sua senha"]')
      .setValue("password123");

    await wrapper.find("form").trigger("submit");
    await wrapper.vm.$nextTick();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5282/api/User",
      expect.any(Object)
    );
    expect(pushSpy).toHaveBeenCalledWith("/login");

    pushSpy.mockRestore();
  });

  it("shows error message on API failure", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () =>
        Promise.resolve({
          title: "Validation Error",
          errors: {
            Email: ["Email is already in use."],
          },
        }),
    });

    const wrapper = mount(Cadastro, {
      global: {
        plugins: [router],
      },
    });
    await router.isReady();

    // Fill form to pass initial validation
    await wrapper
      .find('input[placeholder="CPF (apenas números)"]')
      .setValue("123.456.789-00");
    await wrapper
      .find('input[placeholder="CEP (00000-000)"]')
      .setValue("12345-678");
    await wrapper.find('input[placeholder^="Senha"]').setValue("password123");
    await wrapper
      .find('input[placeholder="Confirme sua senha"]')
      .setValue("password123");

    await wrapper.find("form").trigger("submit");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".erro").text()).toContain(
      "Email: Email is already in use."
    );
  });
});
