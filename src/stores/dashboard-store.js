import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';


export const useDashboardStore = defineStore('dashboard', {
  state: () => ({}),
  getters: {},
  actions: {
    async userCount() {
      try {
        const response = await api.get('/api/dashboard/user-count/');
        return response.data.result;
      } catch (error) {
        return 0;
      }
    },
    async vendorCount() {
      try {
        const response = await api.get('/api/dashboard/vendor-count/');
        return response.data.result;
      } catch (error) {
        return 0;
      }
    },
    async weeklySales() {
      try {
        const response = await api.get('/api/dashboard/weekly-sales/');
        return response.data.result;
      } catch (error) {
        return 0;
      }
    },
    async monthlyIncome() {
      try {
        const response = await api.get('/api/dashboard/monthly-income/');
        return response.data.result;
      } catch (error) {
        return 0;
      }
    },
    async categorySales() {
      try {
        const response = await api.get('/api/dashboard/category-sales/');
        return response.data;
      } catch (error) {
        return [];
      }
    },
    async categoryDailySales() {
      try {
        const response = await api.get('/api/dashboard/category-daily-sales/');
        return response.data;
      } catch (error) {
        return [];
      }
    },
    async annualSales() {
      try {
        const response = await api.get('/api/dashboard/annual-sales/');
        return response.data;
      } catch (error) {
        return {};
      }
    },
  },
});
