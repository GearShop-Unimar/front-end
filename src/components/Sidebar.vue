<template>
  <nav class="sidebar">
    <div class="sidebar-header"></div>

    <ul class="sidebar-nav">
      <li>
        <router-link to="/">
          <Icon lib="fa" name="home" /> <span>Página Inicial</span>
        </router-link>
      </li>
      <li>
        <router-link to="/produtos">
          <Icon lib="fa" name="search" /> <span>Explorar</span>
        </router-link>
      </li>
      <li>
        <router-link to="/mensagens">
          <Icon lib="fa" name="envelope" /> <span>Mensagens</span>
        </router-link>
      </li>
      <li>
        <router-link to="/perfil">
          <Icon lib="fa" name="user" /> <span>Perfil</span>
        </router-link>
      </li>
    </ul>

    <button class="btn btn-primary post-button">
      <Icon lib="fa" name="feather-alt" /> <span>Postar</span>
    </button>

    <div class="sidebar-spacer"></div>
  </nav>
</template>

<script setup>
// O script permanece vazio, pois os imports são globais ou automáticos
</script>

<style scoped>
/* --- Estilos Gerais --- */
.sidebar {
  width: 275px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
  border-right: 1px solid var(--color-border);
  background-color: var(--color-background);
  overflow-y: auto;
}

.sidebar-header {
  margin-bottom: 20px;
  min-height: 30px;
}

.sidebar-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Links de Navegação */
.sidebar-nav li a {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  margin-bottom: 5px;
  border-radius: 99px;
  text-decoration: none;
  color: var(--color-heading);
  font-size: 1.8rem;
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* --- Ícones --- */
/* Ajuste importante: garante que o ícone esteja centralizado e visível */
.sidebar-nav li a :deep(i),
.sidebar-nav li a :deep(svg) {
  font-size: 1.8rem; /* Tamanho ligeiramente ajustado */
  width: 30px;
  text-align: center;
  margin-right: 15px;
  color: white;
  display: inline-flex; /* Melhora o alinhamento */
  justify-content: center;
  align-items: center;
}

.sidebar-nav li a:hover {
  background-color: var(--color-background-mute);
  color: var(--color-primary);
}

.sidebar-nav li a.router-link-exact-active {
  color: var(--color-primary);
  font-weight: 700;
}

/* Mantém o ícone da página ativa branco */
.sidebar-nav li a.router-link-exact-active :deep(i) {
  color: white;
}

/* Botão Postar */
.post-button {
  width: 90%;
  margin: 25px auto 10px auto;
  padding: 10px 22px;
  border-radius: 25px;
  border: none;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  background-color: var(--color-primary);
  color: white;
  cursor: pointer;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

/* Garante cor branca no ícone do botão */
.post-button :deep(i) {
  color: white;
}

.post-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px hsla(24, 100%, 50%, 0.3);
}

.post-button:disabled {
  background-color: var(--color-border);
  color: var(--color-text);
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.sidebar-spacer {
  flex-grow: 1;
}

/* --- Responsividade: Tablet (< 1200px) --- */
@media (max-width: 1200px) {
  .sidebar {
    width: 90px;
    padding: 10px 5px;
  }

  .sidebar-nav li a {
    padding: 12px;
    justify-content: center;
  }
  .sidebar-nav li a span {
    display: none;
  }
  /* Remove margem quando está em modo tablet (apenas ícone) */
  .sidebar-nav li a :deep(i) {
    margin-right: 0;
  }

  .post-button {
    width: 50px;
    height: 50px;
    padding: 0;
    border-radius: 50%;
    margin: 25px auto 10px auto;
  }

  .post-button :deep(i),
  .post-button span {
    display: none;
  }

  /* Ícone "Pen" (Postar) no modo tablet */
  .post-button::before {
    content: "\f303"; /* Código unicode para 'pen' no FontAwesome 6, ou f040 no FA 5 */
    font-weight: 900;
    font-size: 1.5rem;
    color: white;
  }
}

/* --- Responsividade: Mobile (< 600px) --- */
@media (max-width: 600px) {
  .sidebar {
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 0;
    top: auto;
    flex-direction: row;
    justify-content: space-around;
    padding: 0 5px;
    border-right: none;
    border-top: 1px solid var(--color-border);
    z-index: 1000;
  }

  .sidebar-header,
  .sidebar-spacer {
    display: none;
  }

  .sidebar-nav {
    display: flex;
    justify-content: space-around;
    flex-grow: 1;
  }

  .sidebar-nav li {
    flex: 1;
    text-align: center;
  }

  .sidebar-nav li a {
    padding: 10px 0;
    height: 100%;
    border-radius: 0;
    justify-content: center;
  }

  /* No mobile, também removemos a margem direita do ícone */
  .sidebar-nav li a :deep(i) {
    margin-right: 0;
  }

  .post-button {
    position: absolute;
    top: -30px;
    right: 15px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  }
}
</style>
