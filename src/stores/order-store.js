import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const useOrderStore = defineStore('order', {
  state: () => ({
    currentOrder: {},
    conditions: [],
    countries: [],
    bankAccounts: [],
    attachments: [],
  }),
  getters: {
    getCurrentOrder: (state) => {
      const orderInfo = state.currentOrder;
      orderInfo.date_time_issued = orderInfo.date_time_issued.replaceAll('-', '/');
      return state.currentOrder;
    },
    getStartDate: (state) => {
      return state.startDate;
    },
    getEndDate: (state) => {
      return state.endDate;
    },
    getConditions: (state) => {
      return state.conditions;
    },
    getCountries: (state) => {
      return state.countries;
    },
    getBankAccounts: (state) => {
      return state.bankAccounts;
    },
    getAttachments: (state) => {
      return state.attachments;
    },
  },
  actions: {
    async postOrder(orderInfo) {
      try {
        const response = await api.post('/api/operation/quotation/', orderInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async editOrder(orderInfo) {
      try {
        const response = await api.put(`/api/operation/quotation/${orderInfo.id}/`, orderInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    // async uploadSupplyOrder(supplyInfo) {
    //   try {
    //     const productId = supplyInfo.get('id')
    //     const response = await api.post(`/api/operation/quotation/${productId}/upload-supply-order/`, supplyInfo, {
    //       'Content-Type': 'multipart/form-data',
    //     });
    //     return response.data;
    //   } catch (error) {
    //     throw error;
    //   }
    // },
    async listAttachments(orderId) {
      try {
        const response = await api.get(`/api/operation/attachment/${orderId}/get-by-quotation/`);
        this.attachments = response.data;
        return response.data;
      } catch (error) {
        this.attachments = [];
        throw error;
      }
    },
    async addAttachment(attachmentInfo) {
      try {
        const response = await api.post('/api/operation/attachment/', attachmentInfo, {
          'Content-Type': 'multipart/form-data',
        });
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteAttachment(attachmentId) {
      try {
        const response = await api.delete(`/api/operation/attachment/${attachmentId}/`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async editAttachment(attachmentInfo) {
      try {
        const attachmentId = attachmentInfo.get('id');
        const response = await api.patch(`/api/operation/attachment/${attachmentId}/`, attachmentInfo, {
          'Content-Type': 'multipart/form-data',
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async retrieveOrder(orderId) {
      try {
        const response = await api.get(`/api/operation/quotation/${orderId}/`);
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
        const response = await api.delete(`/api/operation/quotation/${orderId}/`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async searchOrders(orderParams) {
      try {
        const response = await api.get('/api/operation/quotation/search/', { params: orderParams });
        console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async listConditions() {
      try {
        const response = await api.get('/api/definitions/condition/');
        this.conditions = response.data;
      } catch (error) {
        this.conditions = [];
        throw error;
      }
    },
    async listCountries() {
      try {
        const response = await api.get('/api/definitions/country/');
        this.countries = response.data;
      } catch (error) {
        this.countries = [];
        throw error;
      }
    },
    async listBankAccounts() {
      try {
        const response = await api.get('/api/definitions/bank-account/');
        this.bankAccounts = response.data;
      } catch (error) {
        this.bankAccounts = [];
        throw error;
      }
    },
  },
});
