import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Categoria from '../views/Categoria.vue'
import Contato from '../views/Contato.vue'
import Sobre from '../views/Sobre.vue'
import Login from '../views/Login.vue'
import Cadastro from '../views/Cadastro.vue'
import Anunciar from '../views/Anunciar.vue'
import Carrinho from '../views/Carrinho.vue'
import MeusProdutos from '../views/MeusProdutos.vue'
import Produto from '../views/Produto.vue'
import Pagamento from '../views/Pagamento.vue'
import Sucesso from '../views/Sucesso.vue'


const routes = [
  { path: '/', component: Home },
  { path: '/categoria', name:'categoria', component: Categoria },
  { path: '/contato', component: Contato },
  { path: '/sobre', component: Sobre },
  { path: '/login', component: Login },
  { path: '/cadastro', component: Cadastro },
  { path: '/anunciar', component: Anunciar, meta: { requiresAuth: true } },
  { path: '/carrinho', name:'Carrinho', component: Carrinho },
  { path: '/meus-produtos', name:'MeusProdutos', component: MeusProdutos, meta: { requiresAuth: true } },
  { path: '/produto/:id', name:'produto', component: Produto, props: true, meta: { requiresAuth: true } },

  // Rotas de pagamento
  { path: '/pagamento', name: 'Pagamento', component: Pagamento, meta: { requiresAuth: false } },
  { path: '/sucesso', name: 'Sucesso', component: Sucesso, meta: { requiresAuth: true } },

  // Fallback: redireciona qualquer rota não existente para Home
  { path: '/:catchAll(.*)', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔐 Guardião de rotas para páginas que requerem login
router.beforeEach(async (to, from, next) => {
  const { currentUser } = auth
  const isAuthenticated = !!currentUser

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
