import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import CreditCardForm from "@/components/CreditCardForm.vue";

describe("CreditCardForm.vue", () => {
  const mountForm = (options = {}) => {
    return mount(CreditCardForm, {
      ...options,
    });
  };

  it("renderiza todos os campos do formulário", () => {
    const wrapper = mountForm();
    expect(wrapper.find("#nomeCartao").exists()).toBe(true);
    expect(wrapper.find("#numeroCartao").exists()).toBe(true);
    expect(wrapper.find("#mesValidade").exists()).toBe(true);
    expect(wrapper.find("#anoValidade").exists()).toBe(true);
    expect(wrapper.find("#cvv").exists()).toBe(true);
    expect(wrapper.find("#cpfTitular").exists()).toBe(true);
  });

  it("o botão de pagar fica desabilitado inicialmente", () => {
    const wrapper = mountForm();
    const button = wrapper.find('button[type="submit"]');
    expect(button.attributes("disabled")).toBeDefined();
  });

  it("habilita o botão de pagar quando o formulário é válido", async () => {
    const wrapper = mountForm();

    await wrapper.find("#nomeCartao").setValue("Teste Nome");
    await wrapper.find("#numeroCartao").setValue("4000 0000 0000 0000");
    await wrapper.find("#mesValidade").setValue("12");
    await wrapper.find("#anoValidade").setValue("30");
    await wrapper.find("#cvv").setValue("123");
    await wrapper.find("#cpfTitular").setValue("123.456.789-00");
    
    // O Vue precisa de um ciclo de atualização para a prop computada `formularioValido`
    await wrapper.vm.$nextTick();
    
    const button = wrapper.find('button[type="submit"]');
    expect(button.attributes("disabled")).toBeUndefined();
  });

  it("emite o evento 'submit' quando o formulário é enviado", async () => {
    const wrapper = mountForm();

    // Preenche o formulário para habilitar o botão
    await wrapper.find("#nomeCartao").setValue("Teste Nome");
    await wrapper.find("#numeroCartao").setValue("4000 0000 0000 0000");
    await wrapper.find("#mesValidade").setValue("12");
    await wrapper.find("#anoValidade").setValue("30");
    await wrapper.find("#cvv").setValue("123");
    await wrapper.find("#cpfTitular").setValue("123.456.789-00");
    await wrapper.vm.$nextTick();

    await wrapper.find("form").trigger("submit.prevent");
    expect(wrapper.emitted()).toHaveProperty("submit");
  });

  it("mostra a bandeira do cartão Visa", async () => {
    const wrapper = mountForm();
    await wrapper.find("#numeroCartao").setValue("4111");
    expect(wrapper.find("img.bandeira-cartao-input").attributes("src")).toContain("visa");
  });

  it("mostra a bandeira do cartão Mastercard", async () => {
    const wrapper = mountForm();
    await wrapper.find("#numeroCartao").setValue("5432");
    expect(wrapper.find("img.bandeira-cartao-input").attributes("src")).toContain("mastercard");
  });

  it("formata o número do cartão com espaços", async () => {
    const wrapper = mountForm();
    const input = wrapper.find("#numeroCartao");
    await input.setValue("1234567812345678");
    expect(input.element.value).toBe("1234 5678 1234 5678");
  });

  it("formata o CPF", async () => {
    const wrapper = mountForm();
    const input = wrapper.find("#cpfTitular");
    await input.setValue("12345678900");
    expect(input.element.value).toBe("123.456.789-00");
  });

  it("mostra um erro se a data de validade for inválida", async () => {
    const wrapper = mountForm();
    
    // Preenche o formulário com data inválida (passado)
    await wrapper.find("#nomeCartao").setValue("Teste Nome");
    await wrapper.find("#numeroCartao").setValue("4000 0000 0000 0000");
    await wrapper.find("#mesValidade").setValue("01");
    await wrapper.find("#anoValidade").setValue("20");
    await wrapper.find("#cvv").setValue("123");
    await wrapper.find("#cpfTitular").setValue("123.456.789-00");
    await wrapper.vm.$nextTick();

    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".erro").exists()).toBe(true);
    expect(wrapper.text()).toContain("Validade do cartão expirada ou inválida.");
  });
});
