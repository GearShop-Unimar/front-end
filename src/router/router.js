import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Categoria from "../views/Categoria.vue";
import Contato from "../views/Contato.vue";
import Sobre from "../views/Sobre.vue";
import Login from "../views/Login.vue";
import Cadastro from "../views/Cadastro.vue";
import Anunciar from "../views/Anunciar.vue";
import Carrinho from "../views/Carrinho.vue";
import MeusProdutos from "../views/MeusProdutos.vue";
import Produto from "../views/Produto.vue";
import Pagamento from "../views/Pagamento.vue";
import Sucesso from "../views/Sucesso.vue";

const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/categoria", name: "Categoria", component: Categoria },
  { path: "/contato", name: "Contato", component: Contato },
  { path: "/sobre", name: "Sobre", component: Sobre },
  { path: "/login", name: "Login", component: Login },
  { path: "/cadastro", name: "Cadastro", component: Cadastro },

  // Rotas que exigem autenticação
  {
    path: "/anunciar",
    name: "Anunciar",
    component: Anunciar,
    meta: { requiresAuth: true },
  },
  {
    path: "/meus-produtos",
    name: "MeusProdutos",
    component: MeusProdutos,
    meta: { requiresAuth: true },
  },
  {
    path: "/pagamento",
    name: "Pagamento",
    component: Pagamento,
    meta: { requiresAuth: true },
  },
  {
    path: "/sucesso",
    name: "Sucesso",
    component: Sucesso,
    meta: { requiresAuth: true },
  },

  // Rotas públicas
  {
    path: "/carrinho",
    name: "Carrinho",
    component: Carrinho,
    meta: { requiresAuth: false },
  },
  {
    path: "/produto/:id",
    name: "ProdutoDetalhe",
    component: Produto,
    props: true,
    meta: { requiresAuth: false },
  },

  // Fallback
  { path: "/:catchAll(.*)", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ======================================================================
// 🟢 NAVIGATION GUARD (Proteção de Rota)
// ======================================================================
router.beforeEach((to, from, next) => {
  // 1. Verifica se a rota de destino requer autenticação (usa o meta tag)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // 2. Verifica se o token de autenticação existe (no localStorage)
  const isAuthenticated = localStorage.getItem("userToken");

  if (requiresAuth && !isAuthenticated) {
    // Caso 1: Rota Protegida, mas usuário NÃO logado
    // Redireciona para a página de Login
    console.log("Acesso restrito. Redirecionando para Login.");
    next("/login");
  } else if (
    isAuthenticated &&
    (to.path === "/login" || to.path === "/cadastro")
  ) {
    // Caso 2: Usuário está Logado e tenta acessar as páginas de Login/Cadastro
    // Redireciona para a Home
    console.log("Usuário logado. Acesso a Login/Cadastro bloqueado.");
    next("/");
  } else {
    // Caso 3: Permite a navegação (seja rota pública ou rota protegida com usuário logado)
    next();
  }
});
// ======================================================================

export default router;
