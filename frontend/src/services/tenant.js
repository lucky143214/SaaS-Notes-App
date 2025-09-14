import api from './api';

export const tenantService = {
  getStats: async () => {
    const response = await api.get('/tenant/stats');
    return response.data;
  },

  upgrade: async (slug) => {
    const response = await api.post(`/tenant/${slug}/upgrade`);
    return response.data;
  }
};