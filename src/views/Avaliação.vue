<template>
  <div class="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">

    <h2 class="text-2xl font-bold mb-4 text-gray-800">Avaliações e Comentários</h2>

    <div class="flex items-center mb-6">
      <div class="flex items-center">
        <span v-for="star in 5" :key="star" class="text-yellow-400">
          <svg
            v-if="star <= averageRating"
            class="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.956c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.287-3.956a1 1 0 00-.364-1.118L2.033 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z"/>
          </svg>
          <svg
            v-else
            class="w-6 h-6 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.956c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.287-3.956a1 1 0 00-.364-1.118L2.033 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z"/>
          </svg>
        </span>
      </div>
      <span class="ml-2 text-gray-600 font-medium">{{ averageRating.toFixed(1) }} de 5</span>
    </div>

    <button
      @click="showModal = true"
      class="bg-yellow-400 text-white px-6 py-2 rounded-lg hover:bg-yellow-500 transition mb-6"
    >
      Avaliar Produto
    </button>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button @click="showModal = false" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800">&times;</button>
        <h3 class="text-xl font-semibold mb-4">Deixe sua Avaliação</h3>
        <div class="flex mb-4">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="newReview.rating = star"
            class="focus:outline-none"
          >
            <svg
              :class="star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'"
              class="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.956c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.287-3.956a1 1 0 00-.364-1.118L2.033 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z"/>
            </svg>
          </button>
        </div>
        <textarea
          v-model="newReview.comment"
          placeholder="Seu comentário..."
          class="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          rows="4"
        ></textarea>
        <button
          @click="submitReview"
          class="bg-yellow-400 text-white px-6 py-2 rounded-lg hover:bg-yellow-500 transition"
        >
          Enviar Avaliação
        </button>
      </div>
    </div>

    <div v-if="reviews.length">
      <div v-for="review in reviews" :key="review.id" class="border-t border-gray-200 py-4">
        <div class="flex items-center justify-between mb-1">
          <span class="font-medium text-gray-700">{{ review.userName }}</span>
          <div class="flex">
            <svg
              v-for="star in 5"
              :key="star"
              class="w-5 h-5"
              :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.956c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.287-3.956a1 1 0 00-.364-1.118L2.033 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z"/>
            </svg>
          </div>
        </div>
        <p class="text-gray-600 mb-2">{{ review.comment }}</p>
        <div class="flex items-center space-x-4 text-gray-500 text-sm">
          <button @click="vote(review.id, 'up')">👍 {{ review.upvotes }}</button>
          <button @click="vote(review.id, 'down')">👎 {{ review.downvotes }}</button>
        </div>
      </div>
    </div>
    <div v-else class="text-gray-500">Nenhum comentário ainda. Seja o primeiro!</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      reviews: [],
      showModal: false,
      newReview: {
        rating: 0,
        comment: '',
      },
    };
  },
  computed: {
    averageRating() {
      if (!this.reviews.length) return 0;
      const sum = this.reviews.reduce((a, r) => a + r.rating, 0);
      return sum / this.reviews.length;
    },
  },
  methods: {
    async fetchReviews() {
      try {
        const res = await axios.get('/api/reviews');
        this.reviews = res.data;
      } catch (err) {
        console.error('Erro ao buscar avaliações', err);
      }
    },
    async submitReview() {
      if (!this.newReview.rating || !this.newReview.comment.trim()) return;

      try {
        const res = await axios.post('/api/reviews', this.newReview);
        this.reviews.push(res.data);
        this.newReview.rating = 0;
        this.newReview.comment = '';
        this.showModal = false;
      } catch (err) {
        console.error('Erro ao enviar avaliação', err);
      }
    },
    async vote(reviewId, type) {
      try {
        const res = await axios.post(`/api/reviews/${reviewId}/vote`, { type });
        const index = this.reviews.findIndex(r => r.id === reviewId);
        this.reviews[index] = res.data;
      } catch (err) {
        console.error('Erro ao votar', err);
      }
    },
  },
  mounted() {
    this.fetchReviews();
  },
};
</script>

<style scoped>
textarea { resize: none; }
</style>
