import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '@/services/apiService';
import { getFeed, createPost, toggleLike, getComments, createComment, deletePost } from '@/services/postService';

// Mock do apiService
vi.mock('@/services/apiService', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('postService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getFeed should fetch posts', async () => {
    const mockPosts = [{ id: '1', title: 'Post 1' }];
    api.get.mockResolvedValue({ data: mockPosts });

    const response = await getFeed();

    expect(api.get).toHaveBeenCalledWith('/posts');
    expect(response.data).toEqual(mockPosts);
  });

  it('createPost should create a new post', async () => {
    const formData = new FormData();
    formData.append('title', 'New Post');
    const mockResponse = { id: '2', title: 'New Post' };
    api.post.mockResolvedValue({ data: mockResponse });

    const response = await createPost(formData);

    expect(api.post).toHaveBeenCalledWith(
      '/posts',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    expect(response.data).toEqual(mockResponse);
  });

  it('toggleLike should toggle a like on a post', async () => {
    const postId = '123';
    const mockResponse = { message: 'Like toggled' };
    api.post.mockResolvedValue({ data: mockResponse });

    const response = await toggleLike(postId);

    expect(api.post).toHaveBeenCalledWith(`/posts/${postId}/like`);
    expect(response.data).toEqual(mockResponse);
  });

  it('getComments should fetch comments for a post', async () => {
    const postId = '123';
    const mockComments = [{ id: 'c1', text: 'Comment 1' }];
    api.get.mockResolvedValue({ data: mockComments });

    const response = await getComments(postId);

    expect(api.get).toHaveBeenCalledWith(`/posts/${postId}/comments`);
    expect(response.data).toEqual(mockComments);
  });

  it('createComment should create a new comment', async () => {
    const postId = '123';
    const commentData = { text: 'My new comment' };
    const mockResponse = { id: 'c2', text: 'My new comment' };
    api.post.mockResolvedValue({ data: mockResponse });

    const response = await createComment(postId, commentData);

    expect(api.post).toHaveBeenCalledWith(
      `/posts/${postId}/comments`,
      commentData
    );
    expect(response.data).toEqual(mockResponse);
  });

  it('deletePost should delete a post', async () => {
    const postId = '123';
    const mockResponse = { message: 'Post deleted' };
    api.delete.mockResolvedValue({ data: mockResponse });

    const response = await deletePost(postId);

    expect(api.delete).toHaveBeenCalledWith(`/posts/${postId}`);
    expect(response.data).toEqual(mockResponse);
  });

  it('should handle errors when fetching feed', async () => {
    const error = new Error('Network error');
    api.get.mockRejectedValue(error);

    await expect(getFeed()).rejects.toThrow('Network error');
  });

  it('should handle errors when creating a post', async () => {
    const formData = new FormData();
    formData.append('title', 'New Post');
    const error = new Error('Create post error');
    api.post.mockRejectedValue(error);

    await expect(createPost(formData)).rejects.toThrow('Create post error');
  });

  it('should handle errors when toggling a like', async () => {
    const postId = '123';
    const error = new Error('Toggle like error');
    api.post.mockRejectedValue(error);

    await expect(toggleLike(postId)).rejects.toThrow('Toggle like error');
  });

  it('should handle errors when fetching comments', async () => {
    const postId = '123';
    const error = new Error('Fetch comments error');
    api.get.mockRejectedValue(error);

    await expect(getComments(postId)).rejects.toThrow('Fetch comments error');
  });

  it('should handle errors when creating a comment', async () => {
    const postId = '123';
    const commentData = { text: 'My new comment' };
    const error = new Error('Create comment error');
    api.post.mockRejectedValue(error);

    await expect(createComment(postId, commentData)).rejects.toThrow('Create comment error');
  });

  it('should handle errors when deleting a post', async () => {
    const postId = '123';
    const error = new Error('Delete post error');
    api.delete.mockRejectedValue(error);

    await expect(deletePost(postId)).rejects.toThrow('Delete post error');
  });
});