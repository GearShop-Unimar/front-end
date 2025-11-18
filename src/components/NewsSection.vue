<template>
  <section class="news-section">
    <div class="container">
      <h2 class="section-title">
        <i class="bi bi-newspaper"></i>
        Últimas Notícias do Mundo Automotivo
      </h2>
      <p class="section-subtitle">
        Principais novidades sobre peças, veículos, montadoras e investimentos
      </p>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando notícias...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <i class="bi bi-exclamation-triangle"></i>
        <p>{{ error }}</p>
      </div>

      <div v-else class="news-grid">
        <article
          v-for="(article, index) in news"
          :key="index"
          class="news-card"
          @click="openArticle(article.url)"
        >
          <div class="news-image">
            <img
              :src="article.urlToImage || defaultImage(index)"
              :alt="article.title"
              @error="onImgError($event, index)"
            />
            <div class="news-category">
              <i class="bi bi-tag"></i>
              {{ article.category || category(index) }}
            </div>
          </div>
          <div class="news-content">
            <h3 class="news-title">{{ article.title }}</h3>
            <p class="news-description">
              {{ truncateText(article.description || article.title, 120) }}
            </p>
            <div class="news-meta">
              <span class="news-source">
                <i class="bi bi-building"></i>
                {{ article.source?.name || "Fonte não informada" }}
              </span>
              <span class="news-date">
                <i class="bi bi-calendar"></i>
                {{ formatDate(article.publishedAt) }}
              </span>
            </div>
            <div class="news-footer">
              <span class="read-more">
                <i class="bi bi-arrow-right"></i>
                Ler mais
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {
  getNewsFromBackend,
  formatDate,
  truncateText,
} from "@/services/newsService";

const news = ref([]);
const loading = ref(true);
const error = ref(null);

const categories = [
  "Peças Automotivas",
  "Veículos",
  "Montadoras",
  "Tecnologia",
  "Investimentos",
  "Sustentabilidade",
];

function category(index) {
  return categories[index % categories.length];
}

function defaultImage(index) {
  const images = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=450&fit=crop",
  ];
  return images[index % images.length];
}

function onImgError(e, index) {
  e.target.src = defaultImage(index);
}

function openArticle(url) {
  if (url && url !== "#") window.open(url, "_blank");
}

async function loadNews() {
  try {
    loading.value = true;
    error.value = null;
    news.value = await getNewsFromBackend({ limit: 6 });
    if (!news.value?.length) error.value = "Nenhuma notícia encontrada.";
  } catch (e) {
    console.error(e);
    error.value = "Falha ao carregar notícias.";
  } finally {
    loading.value = false;
  }
}

onMounted(loadNews);
</script>

<style scoped>
.news-section {
  padding: 80px 20px;
  background-color: var(--color-background);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: var(--color-heading);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.section-title i {
  color: var(--color-primary);
  font-size: 2.2rem;
}

.section-subtitle {
  text-align: center;
  font-size: 1.1rem;
  color: var(--color-text);
  margin-bottom: 50px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-container i {
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 20px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.news-card {
  background-color: var(--color-card-background);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px var(--color-card-shadow);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid var(--color-border);
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px var(--color-card-shadow);
}

.news-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}
.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-category {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: var(--color-primary);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.news-content {
  padding: 20px;
}
.news-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 10px;
}
.news-description {
  font-size: 1rem;
  color: var(--color-text);
  line-height: 1.6;
  margin-bottom: 18px;
}
.news-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--color-text);
}
.news-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
.read-more {
  color: var(--color-primary);
  font-weight: 600;
}

@media (max-width: 992px) {
  .news-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
  }
}

@media (max-width: 768px) {
  .news-section {
    padding: 60px 15px;
  }
  .section-title {
    font-size: 2rem;
  }
  .section-subtitle {
    font-size: 1rem;
    margin-bottom: 40px;
  }
  .news-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .news-image {
    height: 180px;
  }
  .news-title {
    font-size: 1.15rem;
  }
  .news-description {
    font-size: 0.95rem;
  }
  .news-meta {
    flex-direction: column;
    gap: 5px;
  }
  .news-source {
    order: 2;
  }
  .news-date {
    order: 1;
  }
}

@media (max-width: 480px) {
  .news-section {
    padding: 40px 10px;
  }
  .section-title {
    font-size: 1.8rem;
    gap: 10px;
  }
  .section-title i {
    font-size: 1.8rem;
  }
  .news-image {
    height: 160px;
  }
  .news-category {
    font-size: 0.8rem;
    padding: 4px 10px;
  }
  .news-content {
    padding: 15px;
  }
}
</style>
