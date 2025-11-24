<template>
  <div class="posts-page-layout">
    <Sidebar />

    <div class="posts-page-content">
      <div class="create-post-box">
        <img
          :src="getAvatarUrl(authStore.user?.Avatar)"
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
              :src="getAvatarUrl(post.author.Avatar)"
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
  </div>
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
import Sidebar from "@/components/Sidebar.vue";

const authStore = useAuthStore();
const newPostText = ref("");
const posts = ref([]);
const isSubmitting = ref(false);

const newPostImage = ref(null);
const imagePreview = ref(null);
const fileInputRef = ref(null);

const FALLBACK_AVATAR = "https://picsum.photos/seed/user/50/50";

const getAvatarUrl = (path) => {
  if (!path) {
    return FALLBACK_AVATAR;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const base = baseURL.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");

  return `${base}/${cleanPath}`;
};

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
.posts-page-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  max-width: none;
  width: 100%;
  margin: 0;
  padding: 0;
}

.posts-page-content {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  width: 100%;
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
}

.create-post-box {
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
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.create-post-content-inner textarea {
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
}
.post-item {
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

@media (max-width: 1000px) {
  .posts-page-layout {
    grid-template-columns: 1fr;
  }
  .posts-page-layout > .sidebar {
    display: none;
  }
  .posts-page-content {
    border-left: none;
    border-right: none;
    max-width: 100%;
    margin: 20px auto;
    padding: 0 15px;
  }
}

@media (max-width: 600px) {
  .posts-page-content {
    margin: 10px auto;
    padding: 0 10px;
  }
  .create-post-box {
    padding: 15px;
    gap: 10px;
  }
  .create-post-avatar {
    width: 40px;
    height: 40px;
  }
  .create-post-content-inner textarea {
    font-size: 1.3rem;
    padding: 10px;
  }
  .file-input-label {
    font-size: 1.8rem;
  }
  .btn-primary {
    font-size: 1.3rem;
    padding: 8px 18px;
  }
  .feed-title {
    font-size: 2rem;
  }
  .post-header {
    padding: 15px 15px 10px 15px;
  }
  .post-avatar {
    width: 40px;
    height: 40px;
  }
  .author-name {
    font-size: 1.5rem;
  }
  .post-timestamp {
    font-size: 1.2rem;
  }
  .post-body {
    padding: 0 15px 15px 15px;
  }
  .post-body p {
    font-size: 1.4rem;
  }
  .action-btn {
    font-size: 1.2rem;
    padding: 8px 10px;
    gap: 5px;
  }
  .remove-image-btn {
    width: 20px;
    height: 20px;
    font-size: 1.2rem;
  }
}
</style>
