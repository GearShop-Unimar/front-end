import api from "./apiService"; // Assumo que já tens o axios configurado aqui

export default {
  getCart() {
    return api.get("/cart");
  },

  // Adicionar item
  addItem(productId, quantity) {
    return api.post("/cart/add", { productId, quantity });
  },

  // Remover item
  removeItem(cartItemId) {
    return api.delete(`/cart/item/${cartItemId}`);
  },
};
