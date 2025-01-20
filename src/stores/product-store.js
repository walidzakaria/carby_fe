import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';


export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    currentProduct: {},
    descriptions: [],
  }),
  getters: {
    getProducts: (state) => {
      return state.products;
    },
    getCurrentProduct: (state) => {
      return state.currentProduct?.id > 0 ? state.currentProduct : {};
    },
    getDescriptions: (state) => {
      return state.descriptions;
    },
  },
  actions: {
    async listProducts() {
      try {
        console.log('listing products...');
        const response = await api.get('/api/definitions/product/');
        this.products = response.data || [];
      } catch (error) {
        this.products = [];
      }
    },
    async retrieveProduct(productId) {
      if (productId === 0) {
        this.currentProduct = {};
        return;
      }
      try {
        const response = await api.get(`/api/definitions/product/${productId}/`);
        this.currentProduct = response.data;
      } catch (error) {
        this.currentProduct = {};
        throw(error);
      }
    },
    async createProduct(productInfo) {
      try {
        const response = await api.post('/api/definitions/product/', productInfo, {
          'Content-Type': 'multipart/form-data',
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateProduct(productInfo) {
      try {
        const id = productInfo.id;
        const response = await api.put(`/api/definitions/product/${id}/`, productInfo, {
          'Content-Type': 'multipart/form-data',
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteProduct(productId) {
      try {
        const response = await api.delete(`/api/definitions/product/${productId}/`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async createDescription(descriptionInfo) {
      try {
        const response = await api.post('/api/definitions/description/', descriptionInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateDescription(descriptionInfo) {
      try {
        const id = descriptionInfo.id;
        const response = await api.put(`/api/definitions/description/${id}/`, descriptionInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteDescription(descriptionId) {
      try {
        const response = await api.delete(`/api/definitions/description/${descriptionId}/`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async listDescriptions() {
      try {
        const response = await api.get('/api/definitions/description/');
        this.descriptions = response.data || [];
      } catch (error) {
        this.descriptions = [];
      }
    },
  },
});
