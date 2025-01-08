import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';


export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
  }),
  getters: {
    getCategories: (state) => {
      return state.categories;
    },
  },
  actions: {
    async listCategories() {
      try {
        const response = await api.get('/api/products/category/');
        this.categories = response.data;
      } catch (error) {
        this.categories = [];
      }
    },
    async postCategory(categoryInfo) {
      try {
        const response = await api.post('/api/products/category/', categoryInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async putCategory(categoryInfo) {
      console.log(categoryInfo);
      try {
        const response = await api.put(`/api/products/category/${categoryInfo.id}/`, categoryInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteCategory(categoryId) {
      try {
        const response = await api.delete(`/api/products/category/${categoryId}/`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
