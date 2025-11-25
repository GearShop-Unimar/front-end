import api from "./apiService";

const orderService = {
  async getOrders() {
    try {
      // Esta é uma implementação mock para fins de demonstração.
      // Em um ambiente real, você faria uma requisição para sua API de backend.
      const mockOrders = [
        {
          id: "ORDER001",
          date: "2023-10-26T10:00:00Z",
          total: 150.75,
          status: "Concluído",
          items: [
            { productId: 1, name: "Teclado Mecânico", quantity: 1, price: 99.99 },
            { productId: 2, name: "Mouse Gamer", quantity: 1, price: 50.76 },
          ],
        },
        {
          id: "ORDER002",
          date: "2023-11-15T14:30:00Z",
          total: 80.00,
          status: "Pendente",
          items: [
            { productId: 3, name: "Headset com Microfone", quantity: 1, price: 80.00 },
          ],
        },
      ];

      // Simula um atraso da rede
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Em um cenário real, você usaria algo como:
      // const response = await api.get('/orders');
      // return response.data;

      return { data: mockOrders };
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      throw error;
    }
  },
};

export default orderService;
