import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NewsSection from "@/components/NewsSection.vue";
import * as newsService from "@/services/newsService";

// Mock do serviço de notícias
vi.mock("@/services/newsService", () => ({
  getNewsFromBackend: vi.fn(),
  formatDate: vi.fn((dateString) => new Date(dateString).toLocaleDateString("pt-BR")),
  truncateText: vi.fn((text, length) => (text.length > length ? text.slice(0, length) + "..." : text)),
}));

describe("NewsSection.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Dados mockados para as notícias
    const longDescription = "Esta é uma descrição muito, mas muito longa, que com certeza vai passar dos 120 caracteres que foram definidos no componente como o limite para o texto. Se não passar, eu adiciono mais algumas palavras só para garantir o teste.";
    newsService.getNewsFromBackend.mockResolvedValue([
      {
        title: "Título da Notícia 1",
        description: longDescription,
        url: "http://noticia1.com",
        urlToImage: "http://imagem1.com/img.jpg",
        source: { name: "Fonte A" },
        publishedAt: "2025-11-20T10:00:00Z",
        category: "Veículos",
      },
      {
        title: "Título da Notícia 2",
        description: "Descrição da notícia 2.",
        url: "http://noticia2.com",
        urlToImage: null,
        source: { name: "Fonte B" },
        publishedAt: "2025-11-19T12:00:00Z",
      },
    ]);
  });

  const mountNewsSection = () => {
    return mount(NewsSection);
  };

  it("exibe o spinner de carregamento inicialmente", () => {
    newsService.getNewsFromBackend.mockReturnValue(new Promise(() => {})); // Never resolve
    const wrapper = mountNewsSection();
    expect(wrapper.find(".loading-container").exists()).toBe(true);
    expect(wrapper.text()).toContain("Carregando notícias...");
  });

  it("renderiza as notícias após o carregamento", async () => {
    const wrapper = mountNewsSection();
    await wrapper.vm.$nextTick(); // Aguarda a resolução da promessa
    await wrapper.vm.$nextTick(); // Aguarda o Vue renderizar

    expect(wrapper.find(".loading-container").exists()).toBe(false);
    expect(wrapper.findAll(".news-card")).toHaveLength(2);
    expect(wrapper.text()).toContain("Título da Notícia 1");
    
    // Asserção mais específica para o texto truncado
    const firstArticleDescription = wrapper.find(".news-card .news-description");
    // Garante que o texto truncado corresponde ao esperado
    expect(firstArticleDescription.text()).toBe("Esta é uma descrição muito, mas muito longa, que com certeza vai passar dos 120 caracteres que foram definidos no compon..."); 

    expect(wrapper.text()).toContain("Fonte A");
    expect(wrapper.text()).toContain("Veículos");
  });

  it("exibe mensagem de erro se o carregamento falhar", async () => {
    newsService.getNewsFromBackend.mockRejectedValue(new Error("Erro de rede"));
    const wrapper = mountNewsSection();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".error-container").exists()).toBe(true);
    expect(wrapper.text()).toContain("Falha ao carregar notícias.");
  });

  it("usa imagem padrão quando urlToImage é null ou erro", async () => {
    const wrapper = mountNewsSection();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // O primeiro artigo tem imagem, o segundo não
    const images = wrapper.findAll(".news-image img");
    expect(images[0].attributes("src")).toBe("http://imagem1.com/img.jpg");
    // Verifica se o src foi definido para uma imagem padrão (não o urlToImage nulo)
    expect(images[1].attributes("src")).not.toBeNull();
    expect(images[1].attributes("src")).not.toBe("");
    expect(images[1].attributes("src")).toContain("unsplash"); // Padrão usa unsplash
  });

  it("chama window.open ao clicar em um artigo", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => {});
    const wrapper = mountNewsSection();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    await wrapper.find(".news-card").trigger("click");
    expect(openSpy).toHaveBeenCalledWith("http://noticia1.com", "_blank");
    openSpy.mockRestore();
  });

  it("exibe 'Nenhuma notícia encontrada' se a API retornar vazio", async () => {
    newsService.getNewsFromBackend.mockResolvedValue([]);
    const wrapper = mountNewsSection();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".empty-msg").exists()).toBe(false); // Não há empty-msg, apenas error-container
    expect(wrapper.find(".error-container").exists()).toBe(true); // O componente usa error.value para isso
    expect(wrapper.text()).toContain("Nenhuma notícia encontrada.");
  });

  it("formata a data corretamente", async () => {
    const wrapper = mountNewsSection();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    // formatDate é mockado para toLocaleDateString, então deve mostrar a data formatada
    expect(wrapper.text()).toContain(new Date("2025-11-20T10:00:00Z").toLocaleDateString("pt-BR"));
  });

  it("trunca o texto da descrição conforme especificado", async () => {
    newsService.truncateText.mockImplementation((text, length) => (text.length > length ? text.slice(0, length) + "..." : text));
    const wrapper = mountNewsSection();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const longDescription = "Esta é uma descrição muito, mas muito longa, que com certeza vai passar dos 120 caracteres que foram definidos no componente como o limite para o texto. Se não passar, eu adiciono mais algumas palavras só para garantir o teste.";
    const expectedTruncatedText = longDescription.slice(0, 120) + "...";
    
    const descriptionElement = wrapper.findAll(".news-description")[0];
    expect(descriptionElement.text()).toBe(expectedTruncatedText);
  });
});
