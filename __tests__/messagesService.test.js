import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '@/services/apiService';
import messagesService, { fetchConversationsFromBackend, fetchMessagesFromBackend, sendMessageToBackend } from '@/services/messagesService';

vi.mock('@/services/apiService', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('messagesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchConversationsFromBackend should fetch conversations', async () => {
    const mockConversations = [{ id: '1', subject: 'Test' }];
    api.get.mockResolvedValue({ data: mockConversations });

    const result = await fetchConversationsFromBackend();

    expect(api.get).toHaveBeenCalledWith('/messages');
    expect(result).toEqual(mockConversations);
  });

  it('fetchConversationsFromBackend should handle errors', async () => {
    api.get.mockRejectedValue(new Error('Failed to fetch'));
    console.error = vi.fn(); // Mock console.error

    const result = await fetchConversationsFromBackend();

    expect(api.get).toHaveBeenCalledWith('/messages');
    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Erro ao buscar conversas:', expect.any(Error));
  });

  it('fetchMessagesFromBackend should fetch messages for a conversation', async () => {
    const conversationId = '123';
    const mockMessages = [{ id: 'msg1', text: 'Hello' }];
    api.get.mockResolvedValue({ data: mockMessages });

    const result = await fetchMessagesFromBackend(conversationId);

    expect(api.get).toHaveBeenCalledWith(`/messages/conversation/${conversationId}`);
    expect(result).toEqual(mockMessages);
  });

  it('fetchMessagesFromBackend should handle errors', async () => {
    const conversationId = '123';
    api.get.mockRejectedValue(new Error('Failed to fetch messages'));
    console.error = vi.fn();

    const result = await fetchMessagesFromBackend(conversationId);

    expect(api.get).toHaveBeenCalledWith(`/messages/conversation/${conversationId}`);
    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Erro ao buscar mensagens:', expect.any(Error));
  });

  it('sendMessageToBackend should send a message', async () => {
    const conversationId = '123';
    const text = 'New message';
    const mockResponse = { success: true };
    api.post.mockResolvedValue({ data: mockResponse });

    const result = await sendMessageToBackend(conversationId, text);

    expect(api.post).toHaveBeenCalledWith(
      `/messages/conversation/${conversationId}`,
      { text }
    );
    expect(result).toEqual(mockResponse);
  });

  it('sendMessageToBackend should handle errors', async () => {
    const conversationId = '123';
    const text = 'New message';
    api.post.mockRejectedValue(new Error('Failed to send message'));
    console.error = vi.fn();

    const result = await sendMessageToBackend(conversationId, text);

    expect(api.post).toHaveBeenCalledWith(
      `/messages/conversation/${conversationId}`,
      { text }
    );
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Erro ao enviar mensagem:', expect.any(Error));
  });

  it('should export all functions correctly as default', () => {
    expect(messagesService.fetchConversationsFromBackend).toBe(fetchConversationsFromBackend);
    expect(messagesService.fetchMessagesFromBackend).toBe(fetchMessagesFromBackend);
    expect(messagesService.sendMessageToBackend).toBe(sendMessageToBackend);
  });
});