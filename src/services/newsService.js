// Serviço de notícias com dados mockados, preparado para conectar ao backend
// Futuro endpoint sugerido: GET /news?limit=6&category=automotive

const mockArticles = [
  {
    title: "Nova liga metálica promete peças mais leves e resistentes",
    description:
      "Pesquisa nacional desenvolve componentes com melhor desempenho e menor custo para montadoras.",
    url: "#",
    urlToImage:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=450&fit=crop",
    publishedAt: new Date().toISOString(),
    source: { name: "Auto Tech" },
    category: "Peças Automotivas",
  },
  {
    title: "Montadoras aceleram planos de veículos híbridos no Brasil",
    description:
      "Fabricantes anunciam portfólio ampliado com foco em eficiência energética e menor emissão.",
    url: "#",
    urlToImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop",
    publishedAt: new Date().toISOString(),
    source: { name: "Car Business" },
    category: "Montadoras",
  },
  {
    title: "Mercado de reposição cresce com digitalização das oficinas",
    description:
      "Plataformas online facilitam a compra de peças e elevam a competitividade do setor.",
    url: "#",
    urlToImage:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=450&fit=crop",
    publishedAt: new Date().toISOString(),
    source: { name: "Aftermarket News" },
    category: "Peças Automotivas",
  },
  {
    title: "Tecnologia embarcada: carros mais conectados em 2025",
    description:
      "Atualizações over-the-air e integração com smartphones tornam experiência mais completa.",
    url: "#",
    urlToImage:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=450&fit=crop",
    publishedAt: new Date().toISOString(),
    source: { name: "Auto Trends" },
    category: "Tecnologia",
  },
  {
    title: "Investimentos em mobilidade elétrica batem recorde",
    description:
      "Aportes em infraestrutura de recarga e novas fábricas impulsionam a cadeia automotiva.",
    url: "#",
    urlToImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop",
    publishedAt: new Date().toISOString(),
    source: { name: "Investment Hub" },
    category: "Investimentos",
  },
  {
    title: "Sustentabilidade nas montadoras ganha protagonismo",
    description:
      "Materiais recicláveis e processos limpos entram no centro da estratégia das fábricas.",
    url: "#",
    urlToImage:
      "https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=450&fit=crop",
    publishedAt: new Date().toISOString(),
    source: { name: "Green Mobility" },
    category: "Sustentabilidade",
  },
];

export async function getNewsMock(limit = 6) {
  return mockArticles.slice(0, limit);
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function truncateText(text = "", maxLength = 120) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Preparado para backend: troque getNewsMock por esta chamada quando o endpoint existir
// Exemplo de uso futuro:
export async function getNewsFromBackend({ limit = 6 } = {}) {
  // return (await api.get(`/news`, { params: { limit } })).data;
  // No momento, retornar mock para manter a home funcional
  return getNewsMock(limit);
}

export default {
  getNewsMock,
  getNewsFromBackend,
  formatDate,
  truncateText,
};
