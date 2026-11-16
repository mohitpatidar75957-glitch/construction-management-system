import { api } from './api';

export const dprService = {
  getAll: (projectId) => {
    const query = projectId ? `?projectId=${projectId}` : '';
    return api.get(`/reports/dpr${query}`);
  },
  create: (data) => api.post('/reports/dpr', data)
};

export default dprService;

