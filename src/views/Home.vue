<template>
  <div class="home-page">
    <section class="welcome-section">
      <div class="home-banner">
        <img
          src="@/assets/img/Logo.png"
          alt="Logo GearShop"
          class="home-logo"
        />
      </div>
      <h1>Bem-vindo à GearShop</h1>
      <h3>Acelerando sonhos sobre quatro rodas</h3>
    </section>
    <section class="info-strip">
      <div class="info-box">
        <i class="bi bi-geo-alt-fill icon"></i>
        <p>
          <strong>Encontre uma peça que pode estar do lado da sua casa</strong>
        </p>
      </div>
      <div class="info-box">
        <i class="bi bi-tools icon"></i>
        <p>
          <strong
            >Ache aquela peça que você precisa para seu carro e acabe com a dor
            de cabeça</strong
          >
        </p>
      </div>
      <div class="info-box">
        <i class="bi bi-credit-card-2-front-fill icon"></i>
        <p><strong>Temos várias formas de pagamento pra você</strong></p>
      </div>
    </section>

    <section class="destaques">
      <h2>Peças em destaque</h2>
      <div class="cards-container">
        <ProductCard
          v-for="produto in produtosBaratos"
          :key="produto.id"
          :produto="produto"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ProductCard from "@/components/ProductCard.vue";

const produtosBaratos = ref([]);

const buscarProdutosMaisBaratos = async () => {
  try {
    const resposta = await fetch("http://localhost:5282/api/Product");
    if (!resposta.ok) throw new Error("Erro ao buscar produtos");
    const dados = await resposta.json();
    produtosBaratos.value = dados;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    produtosBaratos.value = [];
  }
};

onMounted(() => {
  buscarProdutosMaisBaratos();
});
</script>

<style scoped>
.home-page {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f4f4;
  color: #1a1a1a;
  padding-top: 10px;
}

.home-logo {
  display: block;
  margin: auto;
  max-width: 300px;
}

.home-banner {
  text-align: center;
  padding: 0px 100px;
}
.welcome-section {
  text-align: center;
  padding: 30px 20px;
  background-color: #000000;
  margin-top: 60px; /* Adicionado para compensar a remoção da navbar */
}

.welcome-section h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #fff;
}

.welcome-section h3 {
  font-size: 1.5rem;
  color: #ff6600;
}

.info-strip {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #1a1a1a;
  padding: 40px 20px;
  color: white;
  border-top: 4px solid orange;
  border-bottom: 4px solid orange;
  flex-wrap: wrap;
}

.info-box {
  text-align: center;
  width: 300px;
  margin: 20px;
}

.icon {
  font-size: 40px;
  color: orange;
  margin-bottom: 15px;
}

.destaques {
  padding: 50px 20px;
  background-color: #fff;
  text-align: center;
}

.destaques h2 {
  font-size: 2rem;
  color: #ff6600;
  margin-bottom: 30px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

@media (max-width: 992px) {
  .cards-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: 1fr;
  }
}
</style>
