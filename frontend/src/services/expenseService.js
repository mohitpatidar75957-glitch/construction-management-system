import { api } from './api';

export const expenseService = {
  getExpenses: () => api.get('/accounts/overview').then(res => res.recentTransactions || []),
  createExpense: (data) => api.post('/accounts/transactions', data)
};

export default expenseService;

