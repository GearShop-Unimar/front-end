import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Posts from "../views/Posts.vue"; // ADICIONADO
import Contato from "../views/Contato.vue";
import Login from "../views/Login.vue";
import Cadastro from "../views/Cadastro.vue";
import Anunciar from "../views/Anunciar.vue";
import Carrinho from "../views/Carrinho.vue";
import MeusProdutos from "../views/MeusProdutos.vue";
import Produto from "../views/Produto.vue";
import Pagamento from "../views/Pagamento.vue";
import Sucesso from "../views/Sucesso.vue";
import TelaProdutos from "../views/TelaProdutos.vue";

const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/posts", name: "Posts", component: Posts }, // ADICIONADO
  { path: "/produtos", name: "Produtos", component: TelaProdutos },
  { path: "/contato", name: "Contato", component: Contato },
  { path: "/login", name: "Login", component: Login },
  { path: "/cadastro", name: "Cadastro", component: Cadastro },
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
  {
    path: "/carrinho",
    name: "Carrinho",
    component: Carrinho,
  },
  {
    path: "/produto/:id",
    name: "Produto",
    component: Produto,
  },
  { path: "/:catchAll(.*)", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem("token");

  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (
    isAuthenticated &&
    (to.path === "/login" || to.path === "/cadastro")
  ) {
    next("/");
  } else {
    next();
  }
});

export default router;
