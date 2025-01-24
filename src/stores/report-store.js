import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';


export const useReportStore = defineStore('report', {
  state: () => ({}),
  getters: {},
  actions: {
    async retrieveSupplyOrder(params) {
      try {
        const response = await api.get('/api/reports/supply-orders/', { params: params });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async retrieveQuotation(params) {
      try {
        const response = await api.get('/api/reports/quotation-orders/', { params: params });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },

});
