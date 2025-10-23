<template>
  <div class="posts-page-layout">
    <Sidebar />

    <div class="posts-page-content">
      <div class="create-post-box">
        <img
          :src="
            authStore.user?.avatar
              ? `${baseURL}${authStore.user.avatar}`
              : 'https://picsum.photos/seed/user/50/50'
          "
          alt="Meu Avatar"
          class="create-post-avatar"
        />
        <div class="create-post-content-inner">
          <textarea
            v-model="newPostText"
            :placeholder="`Partilhe o seu projeto, ${
              authStore.user?.name || 'entusiasta'
            }...`"
            rows="3"
          ></textarea>

          <div v-if="imagePreview" class="image-preview-container">
            <img
              :src="imagePreview"
              alt="Pré-visualização"
              class="image-preview"
            />
            <button @click="removeImage" class="remove-image-btn">
              &times;
            </button>
          </div>

          <div class="create-post-actions">
            <label class="file-input-label">
              <i class="fa fa-image"></i>
              <input
                type="file"
                @change="handleFileChange"
                accept="image/*"
                class="file-input"
                ref="fileInputRef"
              />
            </label>
            <button
              @click="submitPost"
              class="btn btn-primary"
              :disabled="isPostButtonDisabled || isSubmitting"
            >
              {{ isSubmitting ? "A postar..." : "Postar" }}
            </button>
          </div>
        </div>
      </div>

      <h2 class="feed-title">Feed de Atividades</h2>

      <div class="feed-list">
        <article v-for="post in posts" :key="post.id" class="post-item">
          <header class="post-header">
            <img
              :src="
                post.author.avatarUrl
                  ? `${baseURL}${post.author.avatarUrl}`
                  : 'https://picsum.photos/seed/avatar/50/50'
              "
              alt="Avatar"
              class="post-avatar"
            />
            <div class="author-info">
              <span class="author-name">{{ post.author.name }}</span>
              <span class="post-timestamp">{{
                formatTimestamp(post.createdAt)
              }}</span>
            </div>
          </header>

          <div class="post-body">
            <p>{{ post.content }}</p>
            <img
              v-if="post.imageUrl"
              :src="`${baseURL}${post.imageUrl}`"
              alt="Imagem do post"
              class="post-image"
            />
          </div>

          <footer class="post-actions">
            <button
              @click="toggleLike(post)"
              class="action-btn"
              :class="{ liked: post.isLikedByCurrentUser }"
            >
              <i class="fa fa-heart"></i> {{ post.likeCount }} Gostar
            </button>
            <button class="action-btn">
              <i class="fa fa-comment"></i> {{ post.commentCount }} Comentar
            </button>
            <button class="action-btn">
              <i class="fa fa-share"></i> Partilhar
            </button>
          </footer>
        </article>
      </div>
    </div>
    {/* Fim de posts-page-content */}
  </div>
  {/* Fim de posts-page-layout */}
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import {
  getFeed,
  createPost,
  toggleLike as apiToggleLike,
} from "@/services/postService";
import { baseURL } from "@/services/apiService";
import Sidebar from "@/components/Sidebar.vue"; // 4. Importar Sidebar aqui

const authStore = useAuthStore();
const newPostText = ref("");
const posts = ref([]);
const isSubmitting = ref(false);

const newPostImage = ref(null);
const imagePreview = ref(null);
const fileInputRef = ref(null);

const isPostButtonDisabled = computed(() => {
  return newPostText.value.trim() === "" && !newPostImage.value;
});

onMounted(async () => {
  try {
    const response = await getFeed();
    posts.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar o feed:", error);
  }
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    newPostImage.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  newPostImage.value = null;
  imagePreview.value = null;
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const submitPost = async () => {
  if (isPostButtonDisabled.value) {
    return;
  }
  isSubmitting.value = true;
  const formData = new FormData();
  formData.append("Content", newPostText.value);
  if (newPostImage.value) {
    formData.append("ImageFile", newPostImage.value);
  }
  try {
    const response = await createPost(formData);
    const newPost = response.data;
    posts.value.unshift(newPost);
    newPostText.value = "";
    removeImage();
  } catch (error) {
    console.error("Erro ao criar o post:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const toggleLike = async (post) => {
  try {
    const response = await apiToggleLike(post.id);
    const result = response.data;
    post.likeCount = result.newLikeCount;
    post.isLikedByCurrentUser = result.isLikedByCurrentUser;
  } catch (error) {
    console.error("Erro ao dar like:", error);
  }
};

const formatTimestamp = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
/* 5. Adicionar estilos para o layout DENTRO desta página */
.posts-page-layout {
  display: grid;
  grid-template-columns: auto 1fr; /* Coluna da Sidebar + Coluna do Conteúdo */
  /* Remove margem/padding da div raiz anterior se houver */
  max-width: none; /* Permite ocupar a largura definida no App.vue */
  width: 100%;
  margin: 0;
  padding: 0;
}

.posts-page-content {
  /* Os estilos que antes eram de .posts-page-container agora aplicam-se aqui */
  max-width: 800px; /* Mantém a largura do feed */
  margin: 40px auto;
  padding: 0 20px;
  width: 100%; /* Garante que ocupa a coluna do grid */
  border-left: 1px solid var(--color-border); /* Adiciona borda como no Twitter */
  border-right: 1px solid var(--color-border);
}

/* O resto dos estilos permanece igual, apenas ajuste nomes se necessário */
/* Ex: Renomeei .create-post-content para .create-post-content-inner */
/* para evitar conflito com a classe do layout pai */

.create-post-box {
  /* width: 96%; */ /* Pode remover se .posts-page-content já limita a largura */
  background-color: var(--color-navbar-background);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 8px var(--color-card-shadow);
  padding: 20px;
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
}
.create-post-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}
.create-post-content-inner {
  /* Nome ajustado */
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.create-post-content-inner textarea {
  /* Seletor ajustado */
  /* width: 95%; */ /* Pode remover */
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px;
  font-size: 1.6rem;
  color: var(--color-text);
  resize: vertical;
  min-height: 80px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}
.create-post-content-inner textarea:focus {
  /* Seletor ajustado */
  border-color: var(--color-primary);
  background-color: var(--color-background);
}
.create-post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.btn-primary {
  padding: 10px 22px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background-color: var(--color-primary);
  color: white;
  cursor: pointer;
}
.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px hsla(24, 100%, 50%, 0.3);
}
.btn-primary:disabled {
  background-color: var(--color-border);
  color: var(--color-text);
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.feed-title {
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 10px;
}
.feed-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
  /* width: 100%; */ /* Pode remover */
}
.post-item {
  /* width: 100%; */ /* Pode remover */
  background-color: var(--color-navbar-background);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 15px var(--color-card-shadow);
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.post-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px var(--color-card-shadow);
}
.post-header {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 20px 20px 15px 20px;
}
.post-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}
.author-info {
  display: flex;
  flex-direction: column;
}
.author-name {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--color-heading);
}
.post-timestamp {
  font-size: 1.3rem;
  color: var(--color-text);
  opacity: 0.8;
}
.post-body {
  padding: 0 20px 20px 20px;
}
.post-body p {
  font-size: 1.6rem;
  color: var(--color-text);
  line-height: 1.7;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.post-image {
  width: 100%;
  border-radius: 8px;
  margin-top: 15px;
}
.post-actions {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-background-soft);
  padding: 4px 12px;
}
.action-btn {
  background: none;
  border: none;
  color: var(--color-text);
  opacity: 0.8;
  cursor: pointer;
  padding: 10px 12px;
  font-size: 1.4rem;
  font-weight: 600;
  font-family: inherit;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.action-btn:hover {
  background-color: var(--color-background-mute);
  color: var(--color-primary);
}
.action-btn.liked {
  color: var(--color-primary);
  font-weight: 700;
}
.file-input {
  display: none;
}
.file-input-label {
  color: var(--color-primary);
  font-size: 2.2rem;
  cursor: pointer;
  padding: 5px;
  transition: opacity 0.2s ease;
  margin-right: auto;
}
.file-input-label:hover {
  opacity: 0.7;
}
.image-preview-container {
  position: relative;
  margin-top: 10px;
}
.image-preview {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}
.remove-image-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Media query para esconder a sidebar em telas pequenas */
@media (max-width: 1000px) {
  .posts-page-layout {
    grid-template-columns: 1fr; /* Coluna única */
  }
  .posts-page-layout > .sidebar {
    /* Seleciona a Sidebar dentro do layout */
    display: none; /* Esconde a sidebar */
  }
  .posts-page-content {
    border-left: none; /* Remove bordas */
    border-right: none;
    max-width: 100%; /* Opcional: Ocupa toda a largura */
    margin: 20px auto; /* Reduz margem */
  }
}
</style>
