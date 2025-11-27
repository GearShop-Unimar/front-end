import { createRouter, createWebHistory } from "vue-router";

// --- Importação dos Componentes de Rota (Views) ---

import Home from "../views/Home.vue";
import Posts from "../views/Posts.vue";
import Contato from "../views/Contato.vue";
import Login from "../views/Login.vue";
import Cadastro from "../views/Cadastro.vue";
import Anunciar from "../views/Anunciar.vue";
import MeusProdutos from "../views/MeusProdutos.vue";
import Produto from "../views/Produto.vue";
import Pagamento from "../views/Pagamento.vue";
import Sucesso from "../views/Sucesso.vue";
import TelaProdutos from "../views/TelaProdutos.vue";
import Usuario from "../views/Usuario.vue"; // Perfil e informações do usuário
import Fidelidade from "../views/Fidelidade.vue";
import FidelidadeRoadmap from "../views/FidelidadeRoadmap.vue"; // Etapas do programa de fidelidade

// --- Definição das Rotas ---

const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/posts", name: "Posts", component: Posts },
  { path: "/produtos", name: "Produtos", component: TelaProdutos },
  { path: "/contato", name: "Contato", component: Contato },
  { path: "/login", name: "Login", component: Login },
  { path: "/cadastro", name: "Cadastro", component: Cadastro },
  {
    path: "/anunciar",
    name: "Anunciar",
    component: Anunciar,
    meta: { requiresAuth: true }, // Rota que exige autenticação
  },
  {
    path: "/meus-produtos",
    name: "MeusProdutos",
    component: MeusProdutos,
    meta: { requiresAuth: true }, // Rota que exige autenticação
  },
  {
    path: "/fidelidade",
    name: "Fidelidade",
    component: Fidelidade,
    meta: { requiresAuth: true }, // Rota que exige autenticação
  },
  {
    path: "/fidelidade/roadmap",
    name: "FidelidadeRoadmap",
    component: FidelidadeRoadmap,
    meta: { requiresAuth: true }, // Rota que exige autenticação
  },
  {
    path: "/pagamento",
    name: "Pagamento",
    component: Pagamento,
    meta: { requiresAuth: true }, // Rota que exige autenticação
  },
  {
    path: "/sucesso",
    name: "Sucesso",
    component: Sucesso,
    meta: { requiresAuth: true }, // Rota que exige autenticação
  },
  {
    path: "/produto/:id",
    name: "Produto",
    component: Produto,
  },
  {
    path: "/perfil",
    name: "Perfil",
    component: Usuario,
    meta: { requiresAuth: true }, // Rota que exige autenticação
  },
  { path: "/:catchAll(.*)", redirect: "/" }, // Rota coringa para redirecionar caminhos não encontrados
];

// Cria a instância do roteador, usando o histórico HTML5 e as rotas definidas.
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Hook de navegação global (Guarda de Navegação)
/*
  Verifica a autenticação antes de cada mudança de rota.
  Garante que rotas protegidas exijam login e que usuários logados não acessem /login ou /cadastro.
*/
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem("token");

  if (requiresAuth && !isAuthenticated) {
    next("/login"); // Redireciona para login se a rota é protegida e não há token
  } else if (!isAuthenticated && to.path === "/") {
    next("/login"); // Redireciona a home para login se não estiver autenticado
  } else if (
    isAuthenticated &&
    (to.path === "/login" || to.path === "/cadastro")
  ) {
    next("/"); // Redireciona para a home se já estiver logado e tentar acessar login/cadastro
  } else {
    next(); // Permite a navegação
  }
});

export default router;
