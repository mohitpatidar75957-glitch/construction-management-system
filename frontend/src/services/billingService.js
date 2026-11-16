import { api } from './api';

export const billingService = {
  getOverview: () => api.get('/accounts/overview'),
  recordTransaction: (data) => api.post('/accounts/transactions', data),
  getInvoices: () => api.get('/accounts/overview').then(res => res.recentTransactions || [])
};

export default billingService;

