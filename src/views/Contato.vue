<template>
  <div class="contact-page">
    <div class="contact-container">
      <div class="header-section">
        <h1>Entre em Contato</h1>
        <p>
          Tem alguma dúvida, sugestão ou proposta de parceria? Adoraríamos ouvir
          você!
        </p>
      </div>

      <form class="contact-form" @submit.prevent="enviarFormulario">
        <div class="form-group">
          <label for="name">Nome Completo</label>
          <input id="name" type="text" placeholder="Seu nome" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="seu.email@exemplo.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="message">Sua Mensagem</label>
          <textarea
            id="message"
            placeholder="Escreva sua mensagem aqui..."
            rows="6"
            required
          ></textarea>
        </div>

        <button type="submit">Enviar Mensagem</button>
      </form>
    </div>
  </div>
</template>

<script setup>
const enviarFormulario = () => {
  alert("Formulário enviado com sucesso! (Funcionalidade a ser implementada)");
};
</script>

<style scoped>
.contact-page {
  padding: 80px 20px;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background-soft);
}

.contact-container {
  max-width: 600px;
  width: 100%;
  padding: 40px;
  background-color: var(--color-card-background);
  border-radius: 12px;
  box-shadow: 0 8px 30px var(--color-card-shadow);
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.header-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 10px;
}

.header-section p {
  font-size: 1.1rem;
  color: var(--color-text);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--color-heading);
}

input,
textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  font-family: "Rajdhani", sans-serif;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px hsla(24, 100%, 50%, 0.15);
}

textarea {
  resize: vertical;
}

button {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  background-color: var(--color-primary);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Rajdhani", sans-serif;
}

button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px hsla(24, 100%, 50%, 0.3);
}
</style>
