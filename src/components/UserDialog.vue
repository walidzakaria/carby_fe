<template>
  <div>
    <q-card>
      <q-card-section class="text-h6 text-white bg-green">
        <div class="text-h6">{{ userId === 0 ? t('addUser') : t('editUser') }}</div>
      </q-card-section>
      <q-form @submit.prevent="saveUser" class="q-gutter-xs">
          <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section side>
                <q-avatar size="80px">
                  <img :src="selectedImageUrl || userInfo.photo">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-btn icon="photo_camera" type="button" class="text-capitalize"  rounded color="blue"
                  @click="browseImage"
                  outline
                  style="max-width: 35px">
                  <q-tooltip class="bg-accent">{{ t('changePhoto') }}</q-tooltip>
                  </q-btn>
              </q-item-section>
              <input type="file" ref="fileInput" @change="onFileChange" accept="image/*"
                style="display: none;">
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="userInfo.username" :label="t('username')"
                lazy-rules
                :rules="[val => !!val || t('required')]"
                :error="!!errors.username"
                :error-message="errors.username"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input type="email" dense v-model="userInfo.email" :label="t('emailAddress')"
                  :error="!!errors.email"
                  :error-message="errors.email"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="userInfo.first_name" :label="t('firstName')"
                  :rules="[val => !!val || t('required')]"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="userInfo.last_name" :label="t('lastName')"
                  :rules="[val => !!val || t('required')]"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input type="tel" dense v-model="userInfo.phone" :label="t('phone')"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input autogrow dense v-model="userInfo.address" :label="t('address')"/>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input type="textarea" dense v-model="userInfo.about" :label="t('about')"/>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12" v-if="userId === 0">
              <q-item-section>
                  <q-input v-model="userInfo.password"
                    :type="isPwd ? 'password' : 'text'" :placeholder="t('enterPassword')"
                    lazy-rules
                    :rules="[val => !!val || t('required')]"
                    :error="!!errors.password"
                    :error-message="errors.password"
                    dense
                    >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12" v-if="userId === 0">
              <q-item-section>
                  <q-input v-model="userInfo.rePass"
                    :type="isRePwd ? 'password' : 'text'" :placeholder="t('retypePassword')"
                    lazy-rules
                    :rules="[val => !!val || t('required')]"
                    :error="!!errors.rePassword"
                    :error-message="errors.rePassword"
                    dense
                    >
                  <template v-slot:append>
                    <q-icon
                      :name="isRePwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isRePwd = !isRePwd"
                    />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn class="text-capitalize text-white"
            type="button"
            color="grey"
            style="min-width: 130px;"
            :label="t('cancel')" @click="handleClose(false);">
          </q-btn>
          <q-btn class="text-capitalize text-white"
            type="submit"
            color="green"
            :loading="loading"
            style="min-width: 130px;"
            :label="t('save')">
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
        </q-form>
      </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from 'src/stores/user-store';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();


const $q = useQuasar();
const userStore = useUserStore();
const emit = defineEmits(['closeMeEvent']);

const props = defineProps({
  userId: Number,
});

const userInfo = ref({
  id: null,
  first_name: null,
  last_name: null,
  username: null,
  email: null,
  phone: null,
  address: null,
  about: null,
  is_active: true,
  photo: 'https://cdn.quasar.dev/img/boy-avatar.png',
  password: null,
  rePass: null,
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
  const saveUser = async() => {
    loading.value = true;
    errors.value = {};
    const formData = new FormData();
    formData.append('username', userInfo.value.username);
    formData.append('first_name', userInfo.value.first_name || '');
    formData.append('last_name', userInfo.value.last_name || '');
    formData.append('email', userInfo.value.email || null);
    formData.append('phone_number', userInfo.value.phone || '');
    formData.append('address', userInfo.value.address || '');
    formData.append('about', userInfo.value.about || '');
    if (selectedImage.value) {
      formData.append('photo', selectedImage.value);
    }
    if (props.userId === 0) {
      formData.append('password', userInfo.value.password || '');
      formData.append('re_password', userInfo.value.rePass || '');
      formData.append('is_active', true)
    } else {
      formData.append('id', props.userId);
      formData.append('user', props.userId);
      formData.append('is_active', userInfo.value.is_active);
    }

    try {
      if (props.userId === 0) {
        const response = await userStore.createNewUser(formData);
        const returnedId = response.id
        await userStore.getUserDetails(returnedId);
      } else {
        await userStore.updateUser(formData);
        await userStore.getUserDetails(props.userId);
      }

      $q.notify({
        type: 'positive',
        position: 'top-right',
        message: t('userSaved'),
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
      handleClose(true);
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data;
        if (error.response.data.email) {
          errors.value.email = error.response.data.email.join(', ');
        }
        if (error.response.data.username) {
          errors.value.username = error.response.data.username.join(', ');
        }
        if (error.response.data.re_password) {
          errors.value.rePassword = error.response.data.re_password;
        }
        if (error.response.data.password) {
          errors.value.password = error.response.data.password.join(', ');
        }
        console.log(errors.value);
      }
      $q.notify({
        color: 'negative',
        position: 'top-right',
        message: t('saveFailed'),
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
  const isPwd = ref(true);
  const isRePwd = ref(true);

  const handleClose = (isSaved) => {
    emit('closeMeEvent', isSaved);
  };

  onMounted(() => {
    if (props.userId > 0) {
      const userData = userStore.getSelectedUser;
      userInfo.value.id = userData.id;
      userInfo.value.first_name = userData.first_name;
      userInfo.value.last_name = userData.last_name;
      userInfo.value.username = userData.username;
      userInfo.value.email = userData.email;
      userInfo.value.phone = userData.phone;
      userInfo.value.address = userData.address;
      userInfo.value.about = userData.about;
      userInfo.value.is_active = userData.is_active;
      userInfo.value.photo = userData.photo;
    }
  });

  
</script>
