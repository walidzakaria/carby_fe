import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';


export const useOrderStore = defineStore('order', {
  state: () => ({
    currentOrder: {},
  }),
  getters: {
    getCurrentOrder: (state) => {
      const orderInfo = state.currentOrder;
      orderInfo.date = orderInfo.date.replaceAll('-', '/');
      return state.currentOrder;
    },
  },
  actions: {
    async postOrder(orderInfo) {
      try {
        const response = await api.post('/api/sales/order/', orderInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async editOrder(orderInfo) {
      try {
        const response = await api.put(`/api/sales/order/${orderInfo.id}/`, orderInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async retrieveOrder(orderId) {
      try {
        const response = await api.get(`/api/sales/order/${orderId}/`);
        this.currentOrder = response.data;
        console.log(response.data);
        return response.data;
      } catch (error) {
        this.currentOrder = {};
        throw error;
      }
    },
    async deleteOrder(orderId) {
      try {
        const response = await api.delete(`/api/sales/order/${orderId}/`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
