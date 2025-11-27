<template>
  <!-- Estrutura principal do rodapé -->
  <footer class="footer">
    <!-- Contêiner para o conteúdo do rodapé -->
    <div class="footer-content">
      <!-- Seção de informações sobre a GearShop -->
      <div class="footer-section">
        <h3>GearShop</h3>
        <p>Acelerando sonhos, conectando peças.</p>
      </div>

      <!-- Seção com links de navegação rápida -->
      <div class="footer-section">
        <h4>Links Rápidos</h4>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/produtos">Produtos</router-link></li>
          <li><router-link to="/contato">Contato</router-link></li>
          <li><router-link to="/sobre">Sobre Nós</router-link></li>
          <li><router-link to="/pagamento">Pagamento</router-link></li>
        </ul>
      </div>

      <!-- Seção de informações de contato -->
      <div class="footer-section">
        <h4>Contato</h4>
        <p>Email: gear.shopuni@gmail.com</p>
        <p>Telefone: (14) 99999-9999</p>
      </div>
    </div>

    <!-- Seção inferior do rodapé com direitos autorais -->
    <div class="footer-bottom">
      <p>&copy; 2025 GearShop. Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
/* Estilo geral do componente de rodapé */
.footer {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  padding: 40px 20px 20px;
  border-top: 1px solid var(--color-border);
}

/* Organiza o conteúdo do rodapé em um layout flexível */
.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Define o estilo de cada seção individual do rodapé */
.footer-section {
  flex: 1;
  min-width: 200px;
}

/* Estiliza o texto dos parágrafos dentro do rodapé */
.footer-section p {
  font-size: 1.5rem;
}

/* Estiliza os títulos (h3 e h4) das seções */
.footer-section h3,
.footer-section h4 {
  color: var(--color-primary);
  margin-bottom: 10px;
  font-size: 2rem;
}

/* Remove marcadores de lista e preenchimento padrão */
.footer-section ul {
  list-style: none;
  padding: 0;
}

/* Adiciona margem inferior aos itens da lista */
.footer-section ul li {
  margin-bottom: 8px;
}

/* Estiliza os links de navegação no rodapé */
.footer-section ul li a {
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.3s;
  font-size: 1.5rem;
}

/* Muda a cor do link ao passar o mouse */
.footer-section ul li a:hover {
  color: var(--color-primary);
}

/* Estiliza a seção inferior do rodapé */
.footer-bottom {
  text-align: center;
  margin-top: 30px;
  font-size: 1.5rem;
  border-top: 1px solid var(--color-border);
  padding-top: 15px;
}

/* Ajustes de layout para telas menores (tablets) */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 30px;
  }

  .footer-section {
    min-width: 100%;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 15px;
  }

  .footer-section:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
  }

  .footer-section h3,
  .footer-section h4 {
    font-size: 1.8rem;
  }

  .footer-section p,
  .footer-section ul li a,
  .footer-bottom p {
    font-size: 1.3rem;
  }
}

/* Ajustes de layout para telas muito pequenas (smartphones) */
@media (max-width: 480px) {
  .footer {
    padding: 30px 15px 15px;
  }

  .footer-section h3,
  .footer-section h4 {
    font-size: 1.6rem;
  }

  .footer-bottom {
    margin-top: 20px;
  }
}
</style>
