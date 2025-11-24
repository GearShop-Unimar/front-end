import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5282/api";
const API_URL = `${BASE_URL}/cart`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const cartService = {
  getCart: () => {
    return axios.get(API_URL, getAuthHeaders());
  },

  addItem: (productId, quantity) => {
    const payload = {
      productId: productId,
      quantity: quantity,
    };
    return axios.post(`${API_URL}/add`, payload, getAuthHeaders());
  },

  removeItem: (itemId) => {
    return axios.delete(`${API_URL}/item/${itemId}`, getAuthHeaders());
  },
};

export default cartService;
