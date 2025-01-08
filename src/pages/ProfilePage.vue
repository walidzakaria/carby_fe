<template>
  <q-page class="q-pa-sm">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12 center">
        <q-card class="card-bg text-white no-shadow" bordered>
          <q-card-section class="text-h6 ">
            <div class="text-h6">{{ t('editProfile')}}</div>
            <div class="text-subtitle2">{{ t('profileSub') }}</div>
          </q-card-section>
          <q-form @submit.prevent="updateInfo" class="q-gutter-md">
            <q-card-section class="q-pa-sm">
            <q-list class="row">
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section side>
                  <q-avatar size="100px">
                    <img :src="selectedImageUrl || userProfile">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-btn :label="t('changePhoto')" type="button" class="text-capitalize" rounded color="info"
                    @click="browseImage"
                    style="max-width: 150px"></q-btn>
                </q-item-section>
                <input type="file" ref="fileInput" @change="onFileChange" accept="image/*"
                  style="display: none;">
              </q-item>

              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input dark color="white" dense v-model="userDetails.username" :label="`${t('username')} *`"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                  :error="!!errors.username"
                  :error-message="errors.username"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input dark color="white" dense v-model="userDetails.email" :label="t('emailAddress')"
                    :error="!!errors.email"
                    :error-message="errors.email"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input dark color="white" dense v-model="userDetails.first_name" :label="`${t('firstName')} *`"
                    lazy-rules
                    :rules="[val => !!val || t('required')]"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input dark color="white" dense v-model="userDetails.last_name" :label="`${t('lastName')} *`"
                    lazy-rules
                    :rules="[val => !!val || t('required')]"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input dark color="white" autogrow dense v-model="userDetails.profile.address" :label="t('address')"/>
                </q-item-section>
              </q-item>
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input dark color="white" type="textarea" dense v-model="userDetails.profile.about" :label="t('address')"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn class="text-capitalize bg-info text-white"
              type="submit"
              :loading="loading"
              :label="t('updateProfile')">
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </q-card-actions>
          </q-form>
        </q-card>
        <br>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useAuthStore } from 'src/stores/auth-store';
  const authStore = useAuthStore();
  import { useQuasar } from 'quasar';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();

  const $q = useQuasar();
  const router = useRouter();

  const userDetails = computed({
    get: () => authStore.userInfo,
    set: (value) => { authStore.userInfo = value },
  });

  const userProfile = computed({
    get: () => authStore.profile,
  });

  const selectedImage = ref(null);
  const selectedImageUrl = ref('');
  const fileInput = ref(null);
  const loading = ref(false);

  const browseImage = () => {
    fileInput.value.click();
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      selectedImage.value = file;
      selectedImageUrl.value = URL.createObjectURL(file);
    }
  };

  const errors = ref({});

  const updateInfo = async() => {
    loading.value = true;
    errors.value = {};
    const formData = new FormData();
    formData.append('username', userDetails.value.username);
    formData.append('first_name', userDetails.value.first_name || '');
    formData.append('last_name', userDetails.value.last_name || '');
    formData.append('email', userDetails.value.email || null);
    formData.append('phone_number', userDetails.value.profile.phone_number || '');
    formData.append('address', userDetails.value.profile.address || '');
    formData.append('about', userDetails.value.profile.about || '');
    formData.append('is_active', true);
    if (selectedImage.value) {
      formData.append('photo', selectedImage.value);
    }
    try {
      await authStore.updateInfo(formData);
      await authStore.getInfo();
      router.push('/');
      $q.notify({
        type: 'positive',
        position: 'top-right',
        message: 'Your profile is updated successfully.',
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      })
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data;
        if (error.response.data.email) {
          errors.value.email = error.response.data.email.join(', ');
        }
        if (error.response.data.username) {
          errors.value.username = error.response.data.username.join(', ');
        }
      }
      $q.notify({
        color: 'negative',
        position: 'top-right',
        message: 'Failed to update your profile!',
        icon: 'report_problem',
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
    } finally {
      loading.value = false;
    }

  };

</script>

<style scoped>

  .card-bg {
    background-color: #2a313b;
  }
  .center {
    margin-left: auto;
    margin-right: auto;
  }

</style>
