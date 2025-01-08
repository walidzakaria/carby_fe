import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';


export const usePurchaseStore = defineStore('purchase', {
  state: () => ({
    // branches: [],
    currentPurchase: {},
    lastCosts: [],
  }),
  getters: {
    getCurrentPurchase: (state) => {
      const purchaseInfo = state.currentPurchase;
      purchaseInfo.date = purchaseInfo.date.replaceAll('-', '/');
      return state.currentPurchase;
    },
    getLastCosts: (state) => {
      return state.lastCosts;
    },
    // getBranches: (state) => {
    //   return state.branches;
    // },
  },
  actions: {
    async postPurchase(purchaseInfo) {
      try {
        const response = await api.post('/api/purchases/purchase/', purchaseInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async editPurchase(purchaseInfo) {
      try {
        const response = await api.put(`/api/purchases/purchase/${purchaseInfo.id}/`, purchaseInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async retrievePurchase(purchaseId) {
      try {
        const response = await api.get(`/api/purchases/purchase/${purchaseId}/`);
        this.currentPurchase = response.data;
        return response.data;
      } catch (error) {
        this.currentPurchase = {};
        throw error;
      }
    },
    // async putBranch(branchInfo) {
    //   try {
    //     const response = await api.put(`/api/definitions/branch/${branchInfo.id}/`, branchInfo);
    //     return response.data;
    //   } catch (error) {
    //     throw error;
    //   }
    // },
    async deletePurchase(purchaseId) {
      try {
        const response = await api.delete(`/api/purchases/purchase/${purchaseId}/`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async retrieveLastCost() {
      try {
        const response = await api.get('/api/purchases/last-cost/');
        this.lastCosts = response.data;
        return response.data;
      } catch (error) {
        this.lastCosts = [];
        throw error;
      }
    },
  },
});
