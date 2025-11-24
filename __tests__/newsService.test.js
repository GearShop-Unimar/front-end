import { describe, it, expect, vi, beforeEach } from 'vitest';
import newsService, { getNewsMock, formatDate, truncateText, getNewsFromBackend } from '@/services/newsService';
import api from '@/services/apiService';

// Mock do apiService, embora não seja usado diretamente nas funções testadas inicialmente, é bom ter.
vi.mock('@/services/apiService', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('newsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getNewsMock should return a limited number of mock articles', async () => {
    const articles = await getNewsMock(2);
    expect(articles).toHaveLength(2);
    expect(articles[0]).toHaveProperty('title');
    expect(articles[1]).toHaveProperty('description');
  });

  it('getNewsMock should return 6 articles by default', async () => {
    const articles = await getNewsMock();
    expect(articles).toHaveLength(6);
  });

  it('formatDate should format a date string to pt-BR format', () => {
    const dateString = '2023-01-20T10:00:00Z';
    const formattedDate = formatDate(dateString);
    expect(formattedDate).toBe('20/01/2023');
  });

  it('truncateText should truncate text to a specified maxLength with ellipsis', () => {
    const longText = 'Este é um texto muito longo que precisa ser truncado para caber em um espaço menor.';
    const truncated = truncateText(longText, 20);
    expect(truncated).toBe('Este é um texto muit...');
    expect(truncated.length).toBe(23); // 20 + 3 de '...'
  });

  it('truncateText should not truncate text if it is shorter than maxLength', () => {
    const shortText = 'Texto curto.';
    const truncated = truncateText(shortText, 20);
    expect(truncated).toBe('Texto curto.');
  });

  it('truncateText should return an empty string if text is null or undefined', () => {
    expect(truncateText(null)).toBe('');
    expect(truncateText(undefined)).toBe('');
  });

  it('getNewsFromBackend should return mock articles for now', async () => {
    // Embora a função tenha a lógica para chamar a API, ela está mockada para retornar mockArticles
    const articles = await getNewsFromBackend({ limit: 3 });
    expect(articles).toHaveLength(3);
    expect(api.get).not.toHaveBeenCalled(); // Garante que a chamada real da API não foi feita
  });

  it('should export all functions correctly as default', () => {
    expect(newsService.getNewsMock).toBe(getNewsMock);
    expect(newsService.getNewsFromBackend).toBe(getNewsFromBackend);
    expect(newsService.formatDate).toBe(formatDate);
    expect(newsService.truncateText).toBe(truncateText);
  });
});