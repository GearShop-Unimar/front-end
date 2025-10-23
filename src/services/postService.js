import api from "./apiService";

export const getFeed = () => {
  return api.get("/posts");
};

export const createPost = (formData) => {
  return api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const toggleLike = (postId) => {
  return api.post(`/posts/${postId}/like`);
};

export const getComments = (postId) => {
  return api.get(`/posts/${postId}/comments`);
};

export const createComment = (postId, data) => {
  return api.post(`/posts/${postId}/comments`, data);
};

export const deletePost = (postId) => {
  return api.delete(`/posts/${postId}`);
};
