<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>GearShop</h3>
        <p>Acelerando sonhos, conectando peças.</p>
      </div>

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

      <div class="footer-section">
        <h4>Contato</h4>
        <p>Email: gear.shopuni@gmail.com</p>
        <p>Telefone: (14) 99999-9999</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 GearShop. Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  padding: 40px 20px 20px;
  border-top: 1px solid var(--color-border);
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.footer-section p {
  font-size: 1.5rem;
}

.footer-section h3,
.footer-section h4 {
  color: var(--color-primary);
  margin-bottom: 10px;
  font-size: 2rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section ul li a {
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.3s;
  font-size: 1.5rem;
}

.footer-section ul li a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  text-align: center;
  margin-top: 30px;
  font-size: 1.5rem;
  border-top: 1px solid var(--color-border);
  padding-top: 15px;
}

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
