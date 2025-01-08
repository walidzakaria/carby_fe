<template>
  <div>
    <q-card>
      <q-card-section class="text-h6 ">
        <div class="text-h6">{{ t('changePassword') }}</div>
      </q-card-section>
      <q-form @submit.prevent="changePassword" class="q-gutter-md">
          <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input v-model="password"
                  :type="isPwd ? 'password' : 'text'" :placeholder="t('password')"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                  :error="!!errors.password"
                  :error-message="errors.password"
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
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input v-model="re_password"
                  :type="isRePwd ? 'password' : 'text'" :placeholder="t('retypePassword')"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                  :error="!!errors.re_password"
                  :error-message="errors.re_password"
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
import { ref } from 'vue';
import { useUserStore } from 'src/stores/user-store';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();

const props = defineProps({
  userId: Number,
});


const $q = useQuasar();
const userStore = useUserStore();
const emit = defineEmits(['closeMeEvent']);


const password = ref('');
const re_password = ref('');


const loading = ref(false);

const errors = ref({});
  const changePassword = async() => {
    loading.value = true;
    errors.value = {};
    const info = {
      id: props.userId,
      password: password.value,
      re_password: re_password.value,
    };

    try {
      await userStore.setUserPassword(info);

      $q.notify({
        type: 'positive',
        position: 'top-right',
        message: 'The password is changed successfully.',
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
      handleClose();
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data;
        if (error.response.data.password) {
          errors.value.password = error.response.data.password.join(', ');
        }
        if (error.response.data.re_password) {
          errors.value.re_password = error.response.data.re_password.join(', ');
        }

        console.log(errors.value);
      }
      $q.notify({
        color: 'negative',
        position: 'top-right',
        message: 'Password change failed!',
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

  const handleClose = () => {
    emit('closeMeEvent');
  };

</script>
