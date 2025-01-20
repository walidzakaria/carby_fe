import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';


export const useVendorStore = defineStore('vendor', {
  state: () => ({
    vendorsShort: [],
    currentVendor: {},
  }),
  getters: {
    getVendorsShort: (state) => {
      return state.vendorsShort;
    },
    getCurrentVendor: (state) => {
      const result = state.currentVendor;
      result['status'] = result.is_active ? 'yes' : 'no';
      return state.currentVendor;
    },
  },
  actions: {
    async listShortVendors() {
      console.log('listing vendors...');
      try {
        const response = await api.get('/api/operation/vendor/');
        this.vendorsShort = response.data || [];
      } catch (error) {
        this.vendorsShort = [];
      }
    },
    async retrieveVendor(vendorId) {
      if (vendorId === 0) {
        this.currentVendor = {};
        return;
      }
      try {
        const response = await api.get(`/api/operation/vendor/${vendorId}/`);
        this.currentVendor = response.data;
      } catch (error) {
        this.currentVendor = {};
        throw(error);
      }
    },
    async createVendor(vendorInfo) {
      try {
        const response = await api.post('/api/operation/vendor/', vendorInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateVendor(vendorInfo) {
      try {
        const id = vendorInfo.id;
        const response = await api.put(`/api/operation/vendor/${id}/`, vendorInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteVendor(vendorId) {
      try {
        const response = await api.delete(`/api/operation/vendor/${vendorId}/`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
