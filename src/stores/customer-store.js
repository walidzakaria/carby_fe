import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';


export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customersShort: [],
    currentCustomer: {},
  }),
  getters: {
    getCustomersShort: (state) => {
      return state.customersShort;
    },
    getCurrentCustomer: (state) => {
      const result = state.currentCustomer;
      result['status'] = result.is_active ? 'yes' : 'no';
      return state.currentCustomer;
    },
  },
  actions: {
    async listShortCustomers() {
      try {
        const response = await api.get('/api/operation/customer/');
        this.customersShort = response.data || [];
      } catch (error) {
        this.customersShort = [];
      }
    },
    async retrieveCustomer(customerId) {
      if (customerId === 0) {
        this.currentCustomer = {};
        return;
      }
      try {
        const response = await api.get(`/api/operation/customer/${customerId}/`);
        this.currentCustomer = response.data;
      } catch (error) {
        this.currentCustomer = {};
        throw(error);
      }
    },
    async createCustomer(customerInfo) {
      try {
        const response = await api.post('/api/operation/customer/', customerInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateCustomer(customerInfo) {
      try {
        const id = customerInfo.id;
        const response = await api.put(`/api/operation/customer/${id}/`, customerInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteCustomer(customerId) {
      try {
        const response = await api.delete(`/api/operation/customer/${customerId}/`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async listOpeningBalances(customerId) {
      try {
        const response = await api.get(`/api/operation/opening-balance/${customerId}/get_all/`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async createOpeningBalances(balanceInfo) {
      try {
        const response = await api.post('/api/operation/opening-balance/create_all/', balanceInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
