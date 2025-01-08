<template>
  <div>
    <q-item style="max-width: 420px" clickable v-ripple>
      <q-item-section @click="goto('/profile/')">
        <q-item-label>{{ t('showProfile') }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-item style="max-width: 420px" clickable v-ripple>
      <q-item-section @click="showForm = true;">
        <q-item-label>{{ t('changePassword') }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-item style="max-width: 420px" clickable v-ripple>
      <q-item-section @click="logout">
        <q-item-label>{{ t('logout') }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-dialog v-model="showForm">
      <change-password @closeMeEvent="handleCloseDialog"></change-password>
    </q-dialog>
  </div>

</template>

<script setup>

import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { defineAsyncComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();


const ChangePassword = defineAsyncComponent(() => import('components/ChangePassword.vue'));
const showForm = ref(false);

const router = useRouter();
const authStore = useAuthStore();


const goto = (link) => {
  router.push(link);
};


const logout = async() => {
  await authStore.logout();
  router.push('/login/');
};

const handleCloseDialog = () => {
  showForm.value = false;
};
</script>

