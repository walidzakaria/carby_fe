import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';


export const useUnitStore = defineStore('unit', {
  state: () => ({
    units: [],
  }),
  getters: {
    getUnits: (state) => {
      return state.units;
    },
  },
  actions: {
    async listUnits() {
      try {
        const response = await api.get('/api/definitions/unit-type/');
        this.units = response.data;
      } catch (error) {
        this.units = [];
      }
    },
    async postUnit(unitInfo) {
      try {
        const response = await api.post('/api/definitions/unit-type/', unitInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async putUnit(unitInfo) {
      try {
        const response = await api.put(`/api/definitions/unit-type/${unitInfo.id}/`, unitInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteUnit(unitId) {
      try {
        const response = await api.delete(`/api/definitions/unit-type/${unitId}/`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
});
