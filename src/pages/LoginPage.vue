<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10 bg-white">
              <img src="~/assets/login-logo.svg">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              {{ t('login') }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              @submit.prevent="login"
              class="q-gutter-md"
            >
              <q-input
                filled
                v-model="username"
                :label="t('username')"
                lazy-rules
                :rules="[val => !!val || t('required')]"
              />

              <q-input
                type="password"
                filled
                v-model="password"
                :label="t('password')"
                lazy-rules
                :rules="[val => !!val || t('required')]"
              />

              <div>
                <q-btn :label="t('login')" type="submit" :loading="loading" color="primary">
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from 'src/stores/auth-store';
  import { useI18n } from 'vue-i18n';
  const { t, locale } = useI18n();

  const username = ref('');
  const password = ref('');
  const authStore = useAuthStore();
  const loading = ref(false);

  const $q = useQuasar();
  const router = useRouter();

  const login = async() => {
    loading.value = true;
    const credentials = {
      username: username.value,
      password: password.value,
    };
    await authStore.login(credentials);
    if (authStore.isLogged) {
      await authStore.getInfo();
      $q.notify({
        type: 'positive',
        position: 'top-right',
        message: t('loginSucceeded'),
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
      router.push('/')
    } else {
      password.value = null;
      loading.value = false;
      $q.notify({
        color: 'negative',
        position: 'top-right',
        message: t('loginFailed'),
        icon: 'report_problem',
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
    }
    loading.value = false;
  };

  onMounted(() => {
    const savedLocale = localStorage.getItem('locale') || 'ar';
    locale.value = savedLocale;
  });
</script>
<style>

.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
