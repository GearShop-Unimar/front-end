**Visão Geral**
- **Projeto**: GearShop — plataforma de e‑commerce para peças automotivas.
- **Propósito**: Aplicação front‑end construída com Vue 3 e Vite para gerenciar catálogo, anúncios, carrinho e processo de compra.
- **Tipo**: Projeto acadêmico (aplicação SPA)

**Stack Tecnológico**
- **Framework**: `Vue 3` (composition API)
- **Bundler/Dev**: `Vite`
- **State Management**: `Pinia`
- **Router**: `vue-router` (history mode)
- **HTTP**: `axios` / `fetch` em alguns stores
- **UI / utilitários**: `FontAwesome`, `vue-toastification`, `vue-the-mask`
- **Testes / Storybook**: `vitest`, `@vue/test-utils`, `storybook`

**Scripts principais** (arquivo `package.json`)
- **`npm run dev`**: inicia Vite + Storybook (usa `concurrently`).
- **`npm run dev:vite`**: inicia apenas o servidor Vite (abre navegador).
- **`npm run build`**: gera bundle de produção (`vite build`).
- **`npm run preview`**: executa preview do build gerado (`vite preview`).
- **`npm run lint`** / **`lint:fix`**: executa ESLint no projeto.
- **`npm run test:unit`**: executa testes unitários com Vitest.

**Variáveis de ambiente**
- O front depende de `VITE_API_URL` para apontar à API backend. Defina um arquivo `.env` ou variáveis de ambiente no host.

Exemplo mínimo de `.env` (na raiz):
```powershell
# .env
VITE_API_URL=https://api.exemplo.com
```

**Estrutura e Arquivos Principais**
- **`src/main.js`**: ponto de entrada. Registra Pinia, Router, plugin de toast, diretiva `v-mask` e o componente global `Icon`.
- **`src/router/index.js`**: define rotas públicas e protegidas (meta `requiresAuth`). Rota de fallback redireciona para `/`.
- **Stores (`src/stores/`)**:
  - `auth.js`: gerencia autenticação (login, logout, updateProfile), usa `localStorage` para token e user.
  - `cart.js`: gerencia itens do carrinho, integra `cartService` e fornece getters para contagem e total.
  - `product.js`: busca produtos, adiciona produto (formData), gerencia avaliações e busca global.
  - `theme.js`, `user.js`: gerenciam preferências/usuário (consulte os arquivos para detalhes).
- **Services (`src/services/`)** (integração com API):
  - `apiService.js`, `cartService.js`, `messagesService.js`, `newsService.js`, `postService.js` — abstraem chamadas HTTP para o backend.
- **Components** (principais): `Navbar.vue`, `ProductCard.vue`, `Carrinho.vue`, `CreditCardForm.vue`, `ReviewProductCard.vue`, `Sidebar.vue`, `Footer.vue`, `MessagesWidget.vue`, `Icon.vue`.
- **Views** (páginas): `Home.vue`, `TelaProdutos.vue`, `Produto.vue`, `CarrinhoPage.vue`, `Pagamento.vue`, `Sucesso.vue`, `Login.vue`, `Cadastro.vue`, `Anunciar.vue`, `MeusProdutos.vue`, `Usuario.vue`, `Posts.vue`, `Contato.vue`, `Fidelidade.vue`.

**Roteamento e Regras de Autenticação**
- Rotas protegidas (exigem token no `localStorage`): `/anunciar`, `/meus-produtos`, `/fidelidade`, `/pagamento`, `/sucesso`, `/perfil`.
- Guard global implementado em `router.beforeEach` — redireciona para `/login` se não autenticado; bloqueia acesso a `/login` e `/cadastro` quando já autenticado.

**Fluxo de Autenticação**
- `auth.js` faz POST para `VITE_API_URL/Auth/login` usando `fetch` e armazena `token` e `user` no `localStorage`.
- Recomenda-se validar e renovar token no backend (refresh token) quando disponível.

**Integração com API e FormData**
- Upload de produto (em `product.js`) monta `FormData` e envia para `${API_URL}/Product` com `Authorization: Bearer <token>`.
- Erros de API são tratados e repassados via `error` no store para exibição em UI.

**Boas práticas e padrões do projeto**
- State: usar `Pinia` com composition API (stores definidas via `defineStore`).
- Componentes: componentes pequenos e reutilizáveis em `src/components/`.
- Comunicação com backend: centralizar chamadas em `src/services/` para facilitar tratamento de erros e reuso.

**Testes e Storybook**
- Unit tests: `vitest` + `@vue/test-utils`. Execute com:
```powershell
npm run test:unit
```
- Component playground/documentação: Storybook. Para rodar:
```powershell
npm run storybook
```

**Linting / Formatação**
- ESLint está configurado (scripts `lint` e `lint:fix`). Execute:
```powershell
npm run lint
npm run lint:fix
```

**Build & Deploy**
- Build para produção:
```powershell
npm run build
```
- Servir o build localmente para checagem:
```powershell
npm run preview
```
- Recomendações de deploy:
  - Hospedar os arquivos estáticos (diretório `dist`) em Netlify, Vercel, Surge ou S3 + CloudFront.
  - Definir `VITE_API_URL` nas configurações do host para apontar ao backend de produção (não inclua `VITE_API_URL` em runtime sem rebuild, pois Vite injeta no build).

**Observações de segurança**
- Tokens são mantidos no `localStorage` atualmente; avaliar uso de cookies HttpOnly para maior segurança contra XSS quando possível.
- Validar entradas do usuário no frontend e backend (especialmente uploads e campos de anúncio).

**Regras de Contribuição**
- Workflow sugerido:
  1. Criar branch a partir da branch principal para cada tarefa.
  2. Fazer commits atômicos e escrever mensagens claras.
  3. Abrir Pull Request descrevendo mudança e testes realizados.
  4. Adicionar `Gabriel Figueiredo` como reviewer (conforme README).

**Endpoints principais (referência)**
- `POST ${VITE_API_URL}/Auth/login` — autenticar.
- `GET ${VITE_API_URL}/Product/:id` — obter produto.
- `POST ${VITE_API_URL}/Product` — criar produto (FormData com imagem).
- `GET ${VITE_API_URL}/review/product/:id` — avaliações do produto.
- Veja `src/services/*` para mapeamento completo das rotas consumidas.

**Melhorias sugeridas / TODOs**
- Implementar refresh token no `auth.js`.
- Centralizar tratamento de erros em `apiService.js` (retry/backoff).
- Adicionar testes unitários para stores e componentes críticos (cobertura de carrinho, auth e publicação de produto).
- Verificar consistência entre uso de `fetch` e `axios` (preferir apenas uma biblioteca para requests).

**Onde abrir Issues / Contato**
- Repositório e issues: `https://github.com/pedrofonseca1227/Ecommerce-GearShop` (campo `bugs` em `package.json`).

**Arquivo adicionado**
- `DOCUMENTACAO_TECNICA.md` (este arquivo) — localizado na raiz do repositório.

---
Documento gerado automaticamente com base na estrutura do repositório e arquivos fonte.
