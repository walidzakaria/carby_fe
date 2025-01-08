import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    userList: [],
    onlineUsers: [],
    selectedUser: {},
  }),
  getters: {
    getUserList: (state) => {
      // return state.userList;
      return state.userList.map((u) => ({
        id: u.id,
        name: `${u.first_name} ${u.last_name}`,
        phone: u.phone_number,
        is_active: u.is_active,
        photo: u.photo ? `${process.env.API_BASE_URL}${u.photo}` : 'https://cdn.quasar.dev/img/boy-avatar.png',
      }));
    },
    getSelectedUser: (state) => {
      const selectedUser = {
        id: state.selectedUser?.id,
        first_name: state.selectedUser?.first_name,
        last_name: state.selectedUser?.last_name,
        username: state.selectedUser?.username,
        email: state.selectedUser?.email,
        phone: state.selectedUser?.profile?.phone_number,
        address: state.selectedUser?.profile?.address,
        about: state.selectedUser?.profile?.about,
        is_active: state.selectedUser?.is_active || false,
        status: state.selectedUser?.is_active ? 'Yes' : 'No',
        photo: state.selectedUser?.profile?.photo ? `${process.env.API_BASE_URL}${state.selectedUser?.profile?.photo}` : 'https://cdn.quasar.dev/img/boy-avatar.png',
        user_branch: state.selectedUser?.user_branch || [],
      };
      return selectedUser;
    },
    getOnlineUsers: (state) => {
      return state.onlineUsers;
    },
  },
  actions: {
    async getUsers() {
      try {
        const response = await api.get('/auth/user-manage/');
        this.userList = response.data;
      } catch (error) {
        this.userList = [];
      }
    },
    async getUserDetails(userId) {
      try {
        if (userId === 0) {
          this.selectedUser = {};
          return;
        }
        const response = await api.get(`/auth/user-manage/${userId}/`);
        this.selectedUser = response.data;
      } catch (error) {
        this.selectedUser = {};
        throw error;
      }
    },
    async createNewUser(userInfo) {
      try {
        const response = await api.post('/auth/user-manage/', userInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateUser(userInfo) {
      try {
        const response = await api.put('/auth/user-manage/', userInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async patchUser(userInfo) {
      const userId = userInfo.id;
      delete userInfo.id;
      try {
        const response = await api.patch(`/auth/user-manage/${userId}/`, userInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async setUserPassword(userInfo) {
      const userId = userInfo.id;
      delete userInfo.id;
      try {
        const response = await api.patch(`/auth/user-set-password/${userId}/`, userInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async saveUserBranches(branchInfo) {
      try {
        const response = await api.post('/auth/user-branches/create_all/', branchInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async createUserViews(viewInfo) {
      try {
        const response = await api.post('/auth/user-views/', viewInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async updateUserViews(viewInfo) {
      try {
        const response = await api.put(`/auth/user-views/${viewInfo.user}/`, viewInfo);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async getUserViews(userId) {
      try {
        const response = await api.get(`/auth/user-views/${userId}/`);
        return response.data;
      } catch (error) {
        return null;
        throw error;
      }
    },
    async retrieveOnlineUsers() {
      try {
        const response = await api.get('/auth/online-users/');
        this.onlineUsers = response.data;
      } catch (error) {
        this.onlineUsers = [];
      }
    },
  },
});
