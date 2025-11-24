import api, { baseURL } from "./apiService";

const computeBasePath = () => {
  const b = (baseURL ?? api.defaults.baseURL ?? "").replace(/\/+$/, "");
  if (!b) return "/api/premiumaccount";
  if (b.toLowerCase().endsWith("/api")) return "/premiumaccount";
  return "/api/premiumaccount";
};

const basePath = computeBasePath();

export default {
  async getDetails() {
    const res = await api.get(`${basePath}/details`);
    return res.data;
  },

  async getStatus() {
    const res = await api.get(`${basePath}/status`);
    return res.data;
  },

  async activate(durationDays) {
    const res = await api.post(`${basePath}/activate`, { durationDays });
    return res.data;
  },

  async cancel() {
    const res = await api.post(`${basePath}/cancel`);
    return res.data;
  },
};
