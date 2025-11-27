import api from "./apiService"; // Importa a instância configurada do Axios (apiService)

// --- Métodos de Serviço de Posts ---

// Busca todos os posts para o feed principal
export const getFeed = () => {
  return api.get("/posts");
};

// Cria um novo post, enviando dados do formulário (incluindo mídias)
/*
  Usa 'multipart/form-data' no cabeçalho, necessário
  para o envio correto de arquivos/imagens.
*/
export const createPost = (formData) => {
  return api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Alterna o estado "curtir/descurtir" (like/unlike) em um post específico
export const toggleLike = (postId) => {
  return api.post(`/posts/${postId}/like`);
};

// Deleta um post específico pelo seu ID
export const deletePost = (postId) => {
  return api.delete(`/posts/${postId}`);
};

// --- Métodos de Serviço de Comentários ---

// Busca todos os comentários de um post específico
export const getComments = (postId) => {
  return api.get(`/posts/${postId}/comments`);
};

// Cria um novo comentário em um post específico, enviando o texto no corpo (data)
export const createComment = (postId, data) => {
  return api.post(`/posts/${postId}/comments`, data);
};
