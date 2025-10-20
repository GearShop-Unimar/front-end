<template>
  <div class="home-page">
    <section class="welcome-section">
      <div class="background-overlay"></div>
      <div class="welcome-content">
        <div class="logo-animado-container">
          <img
            src="@/assets/img/velocimetro.png"
            alt="Velocímetro"
            class="velocimetro-base"
          />
          <img
            src="@/assets/img/ponteiro.png"
            alt="Ponteiro"
            class="ponteiro"
          />
        </div>
        <h1>Bem-vindo à GearShop</h1>
        <h3>Acelerando sonhos sobre quatro rodas</h3>
        <router-link to="/produtos" class="cta-button">
          Explorar Peças
        </router-link>
      </div>
    </section>

    <section class="info-strip">
      <div class="info-box">
        <i class="bi bi-geo-alt-fill icon"></i>
        <h4>Peças Perto de Você</h4>
        <p>Encontre vendedores na sua região e economize no frete.</p>
      </div>
      <div class="info-box">
        <i class="bi bi-tools icon"></i>
        <h4>Solução Rápida</h4>
        <p>Ache a peça exata para seu carro e finalize seu projeto.</p>
      </div>
      <div class="info-box">
        <i class="bi bi-credit-card-2-front-fill icon"></i>
        <h4>Pagamento Facilitado</h4>
        <p>Diversas formas de pagamento para sua segurança e conforto.</p>
      </div>
    </section>

    <section class="mission-section">
      <div class="mission-content">
        <div class="mission-text">
          <h2>Conectando Apaixonados por Carros</h2>
          <p>
            É com grande entusiasmo que apresentamos a GearShop, uma empresa que
            nasceu com a missão de conectar apaixonados por carros, mecânicos e
            motoristas, oferecendo uma experiência simples e eficiente na busca
            pela peça certa para cada veículo.
          </p>
          <p>
            Nosso objetivo é proporcionar uma jornada sem complicação, onde a
            busca pela peça ideal vai além de um simples conserto – ela é uma
            oportunidade de reviver memórias, manter uma paixão ou dar nova vida
            a um projeto especial.
          </p>
        </div>
        <div class="mission-image">
          <img
            src="https://images.unsplash.com/photo-1599493356233-a6039c638f0c?q=80&w=2070&auto=format&fit=crop"
            alt="Mecânico trabalhando em um motor"
          />
        </div>
      </div>
    </section>

    <section class="values-section">
      <h2 class="section-title">Nossos Pilares</h2>
      <div class="values-grid">
        <div class="value-card">
          <i class="bi bi-shield-lock-fill"></i>
          <h3>Confiança</h3>
          <p>
            Transações seguras e vendedores verificados para sua tranquilidade.
          </p>
        </div>
        <div class="value-card">
          <i class="bi bi-lightning-charge-fill"></i>
          <h3>Eficiência</h3>
          <p>
            Encontre a peça exata que você precisa com nosso sistema de busca e
            filtros avançados.
          </p>
        </div>
        <div class="value-card">
          <i class="bi bi-people-fill"></i>
          <h3>Comunidade</h3>
          <p>
            Um espaço feito por e para entusiastas, promovendo a troca de
            conhecimento.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Nenhuma lógica de script é necessária para esta página.
</script>

<style scoped>
.home-page {
  background-color: #f8f9fa;
  color: var(--color-text);
  font-family: "Rajdhani", sans-serif;
}

.welcome-section {
  position: relative;
  text-align: center;
  padding: 100px 20px;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: #000;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;
}

.welcome-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-animado-container {
  position: relative;
  width: 250px;
  height: 250px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.velocimetro-base,
.ponteiro {
  width: 100%;
  height: auto;
  position: absolute;
}

.ponteiro {
  transform-origin: 30% 70%;
}

.welcome-section h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
}

.welcome-section h3 {
  font-size: 1.5rem;
  font-weight: 400;
  color: #ff6600;
  margin-top: 10px;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
}

.cta-button {
  display: inline-block;
  margin-top: 40px;
  padding: 15px 35px;
  background-color: #ff6600;
  color: #fff;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(255, 102, 0, 0.3);
}

.cta-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 25px rgba(255, 102, 0, 0.5);
}

.info-strip {
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  background-color: #111111;
  padding: 50px 20px;
  flex-wrap: wrap;
  gap: 20px;
  border-bottom: 1px solid #222222;
  border-top: 1px solid #222222;
}

.info-box {
  text-align: center;
  max-width: 300px;
  padding: 20px;
  transition: transform 0.3s ease;
}

.info-box:hover {
  transform: translateY(-10px);
}

.info-box .icon {
  font-size: 3rem;
  color: #ff6600;
  margin-bottom: 20px;
  display: inline-block;
}

.info-box h4 {
  font-size: 1.25rem;
  margin: 0 0 10px 0;
  color: #f0f0f0;
}

.info-box p {
  font-size: 1rem;
  color: #a0a0a0;
  line-height: 1.6;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 50px;
  color: #212529;
}

.mission-section {
  padding: 80px 20px;
  background-color: #ffffff;
}

.mission-content {
  display: flex;
  align-items: center;
  gap: 50px;
  max-width: 1200px;
  margin: 0 auto;
}

.mission-text {
  flex: 1;
}

.mission-text h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #343a40;
}

.mission-text p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #495057;
  margin-bottom: 20px;
}

.mission-image {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.mission-image img {
  width: 100%;
  display: block;
  transition: transform 0.4s ease;
}

.mission-image img:hover {
  transform: scale(1.05);
}

.values-section {
  padding: 80px 20px;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.value-card {
  text-align: center;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.value-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.value-card i {
  font-size: 3rem;
  color: #ff6600;
  margin-bottom: 20px;
}

.value-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #343a40;
}

.value-card p {
  font-size: 1rem;
  line-height: 1.6;
  color: #6c757d;
}

@media (max-width: 992px) {
  .mission-content {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .welcome-section h1 {
    font-size: 2.5rem;
  }
  .welcome-section h3 {
    font-size: 1.2rem;
  }
  .info-strip {
    flex-direction: column;
    align-items: center;
  }
  .values-grid {
    grid-template-columns: 1fr;
  }
}
</style>
