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

export default router;
