import { mount } from '@vue/test-utils';
import Contato from '../src/views/Contato.vue';
import { describe, it, expect, vi } from 'vitest';

describe('Contato.vue', () => {
  it('renders the contact form correctly', () => {
    const wrapper = mount(Contato);

    expect(wrapper.find('h1').text()).toContain('Entre em Contato');
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('#name').exists()).toBe(true);
    expect(wrapper.find('#email').exists()).toBe(true);
    expect(wrapper.find('#message').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('updates input fields correctly', async () => {
    const wrapper = mount(Contato);

    await wrapper.find('#name').setValue('John Doe');
    expect(wrapper.find('#name').element.value).toBe('John Doe');

    await wrapper.find('#email').setValue('john.doe@example.com');
    expect(wrapper.find('#email').element.value).toBe('john.doe@example.com');

    await wrapper.find('#message').setValue('This is a test message.');
    expect(wrapper.find('#message').element.value).toBe('This is a test message.');
  });

  it('calls alert on form submission (placeholder functionality)', async () => {
    const wrapper = mount(Contato);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await wrapper.find('#name').setValue('Test Name');
    await wrapper.find('#email').setValue('test@example.com');
    await wrapper.find('#message').setValue('Hello there!');

    await wrapper.find('form').trigger('submit');

    expect(alertSpy).toHaveBeenCalledWith('Formulário enviado com sucesso! (Funcionalidade a ser implementada)');
    alertSpy.mockRestore();
  });
});