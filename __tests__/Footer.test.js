import Footer from '@/components/Footer.vue';
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';

// Precisamos de um router para que os componentes <router-link> funcionem
const routes = [
  { path: '/', component: { template: '<div>Home</div>' } },
  { path: '/produtos', component: { template: '<div>Produtos</div>' } },
  { path: '/contato', component: { template: '<div>Contato</div>' } },
  { path: '/sobre', component: { template: '<div>Sobre Nós</div>' } },
  { path: '/pagamento', component: { template: '<div>Pagamento</div>' } },
];
const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

describe('Footer.vue', () => {
  // Helper para montar o componente com o router
  const mountFooter = () => {
    return mount(Footer, {
      global: {
        plugins: [router],
      },
    });
  };

  it('renderiza o nome da loja e o slogan', () => {
    const wrapper = mountFooter();
    expect(wrapper.text()).toContain('GearShop');
    expect(wrapper.text()).toContain('Acelerando sonhos, conectando peças.');
  });

  it('exibe todos os links rápidos com as rotas corretas', () => {
    const wrapper = mountFooter();
    const links = wrapper.findAll('a');
    const linkData = links.map(link => ({
      text: link.text(),
      href: link.attributes('href'),
    }));

    expect(linkData).toEqual(
      expect.arrayContaining([
        { text: 'Home', href: '/' },
        { text: 'Produtos', href: '/produtos' },
        { text: 'Contato', href: '/contato' },
        { text: 'Sobre Nós', href: '/sobre' },
        { text: 'Pagamento', href: '/pagamento' },
      ])
    );
  });

  it('exibe as informações de contato', () => {
    const wrapper = mountFooter();
    expect(wrapper.text()).toContain('Email: gear.shopuni@gmail.com');
    expect(wrapper.text()).toContain('Telefone: (14) 99999-9999');
  });

  it('exibe a mensagem de direitos autorais', () => {
    const wrapper = mountFooter();
    expect(wrapper.text()).toContain('© 2025 GearShop. Todos os direitos reservados.');
  });

  it('mantém a estrutura visual esperada (snapshot)', () => {
    const wrapper = mountFooter();
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<!-- Estrutura principal do rodapé -->
      <footer data-v-4896eafd="" class="footer">
        <!-- Contêiner para o conteúdo do rodapé -->
        <div data-v-4896eafd="" class="footer-content">
          <!-- Seção de informações sobre a GearShop -->
          <div data-v-4896eafd="" class="footer-section">
            <h3 data-v-4896eafd="">GearShop</h3>
            <p data-v-4896eafd="">Acelerando sonhos, conectando peças.</p>
          </div><!-- Seção com links de navegação rápida -->
          <div data-v-4896eafd="" class="footer-section">
            <h4 data-v-4896eafd="">Links Rápidos</h4>
            <ul data-v-4896eafd="">
              <li data-v-4896eafd=""><a data-v-4896eafd="" aria-current="page" href="/" class="router-link-active router-link-exact-active">Home</a></li>
              <li data-v-4896eafd=""><a data-v-4896eafd="" href="/produtos" class="">Produtos</a></li>
              <li data-v-4896eafd=""><a data-v-4896eafd="" href="/contato" class="">Contato</a></li>
              <li data-v-4896eafd=""><a data-v-4896eafd="" href="/sobre" class="">Sobre Nós</a></li>
              <li data-v-4896eafd=""><a data-v-4896eafd="" href="/pagamento" class="">Pagamento</a></li>
            </ul>
          </div><!-- Seção de informações de contato -->
          <div data-v-4896eafd="" class="footer-section">
            <h4 data-v-4896eafd="">Contato</h4>
            <p data-v-4896eafd="">Email: gear.shopuni@gmail.com</p>
            <p data-v-4896eafd="">Telefone: (14) 99999-9999</p>
          </div>
        </div><!-- Seção inferior do rodapé com direitos autorais -->
        <div data-v-4896eafd="" class="footer-bottom">
          <p data-v-4896eafd="">© 2025 GearShop. Todos os direitos reservados.</p>
        </div>
      </footer>"
    `);
  });
});
