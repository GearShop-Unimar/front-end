import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ReviewProductCard from "@/components/ReviewProductCard.vue";

describe("ReviewProductCard.vue", () => {
  const mockItem = {
    id: "prod1",
    nome: "Produto de Teste",
    descricao: "Descrição do produto",
    preco: 123.45,
    quantidade: 2,
    imagem: "http://example.com/image.jpg",
  };

  const mountReviewProductCard = (options = {}) => {
    return mount(ReviewProductCard, {
      props: {
        item: mockItem,
      },
      ...options,
    });
  };

  it("renderiza o nome, preço e quantidade do item", () => {
    const wrapper = mountReviewProductCard();
    expect(wrapper.text()).toContain(mockItem.nome);
    expect(wrapper.text()).toContain(`R$ ${mockItem.preco.toFixed(2)}`);
    expect(wrapper.text()).toContain(`Qtd: ${mockItem.quantidade}`);
  });

  it("renderiza a descrição do item se presente", () => {
    const wrapper = mountReviewProductCard();
    expect(wrapper.text()).toContain(mockItem.descricao);
  });

  it("não renderiza a descrição do item se não estiver presente", () => {
    const wrapper = mountReviewProductCard({
      props: {
        item: { ...mockItem, descricao: undefined },
      },
    });
    expect(wrapper.text()).not.toContain("Descrição do produto");
  });

  it("emite o evento 'remove' com o ID do item ao clicar no botão de remover", async () => {
    const wrapper = mountReviewProductCard();
    await wrapper.find(".btn-remove").trigger("click");
    expect(wrapper.emitted().remove).toBeDefined();
    expect(wrapper.emitted().remove[0]).toEqual([mockItem.id]);
  });

  it("chama onImageError quando a imagem falha ao carregar", async () => {
    const wrapper = mountReviewProductCard();
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);

    await img.trigger("error");
    expect(img.element.style.display).toBe("none");
  });

  it("exibe fallback se não houver imagem", () => {
    const wrapper = mountReviewProductCard({
      props: {
        item: { ...mockItem, imagem: null },
      },
    });
    expect(wrapper.find(".thumb-fallback").exists()).toBe(true);
    expect(wrapper.find("img").exists()).toBe(false);
  });
});
