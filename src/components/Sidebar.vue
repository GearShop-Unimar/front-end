<template>
  <nav class="sidebar">
    <div class="sidebar-header"></div>

    <ul class="sidebar-nav">
      <li>
        <router-link to="/">
          <i class="fa fa-home"></i> <span>Página Inicial</span>
        </router-link>
      </li>
      <li>
        <router-link to="/explorar">
          <i class="fa fa-search"></i> <span>Explorar</span>
        </router-link>
      </li>
      <li>
        <router-link to="/mensagens">
          <i class="fa fa-envelope"></i> <span>Mensagens</span>
        </router-link>
      </li>
      <li>
        <router-link to="/profile">
          <i class="fa fa-user"></i> <span>Perfil</span>
        </router-link>
      </li>
      <li>
        <router-link to="/mais">
          <i class="fa fa-ellipsis-h"></i> <span>Mais</span>
        </router-link>
      </li>
    </ul>

    <button class="btn btn-primary post-button">Postar</button>

    <div class="sidebar-spacer"></div>
  </nav>
</template>

<script setup>
// Nenhuma lógica JS necessária por enquanto
</script>

<style scoped>
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
}

.sidebar-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

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

.sidebar-nav li a i {
  font-size: 2rem;
  width: 30px;
  text-align: center;
  margin-right: 15px;
}

.sidebar-nav li a:hover {
  background-color: var(--color-background-mute);
  color: var(--color-primary);
}

.sidebar-nav li a.router-link-exact-active {
  color: var(--color-primary);
  font-weight: 700;
}

/* Updated .post-button styles */
.post-button {
  /* Layout specific to sidebar */
  width: 90%;
  margin: 25px auto 10px auto;

  /* Styles copied from Posts.vue .btn-primary */
  padding: 10px 22px; /* Adjusted padding */
  border-radius: 25px; /* Adjusted border-radius */
  text-decoration: none;
  font-weight: bold;
  font-size: 1.5rem; /* Adjusted font-size */
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background-color: var(--color-primary);
  color: white;
  cursor: pointer;
  text-align: center; /* Ensure text is centered */
}

/* Hover state copied from Posts.vue */
.post-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px hsla(24, 100%, 50%, 0.3);
}

/* Disabled state copied from Posts.vue */
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
</style>
