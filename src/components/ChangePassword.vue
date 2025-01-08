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
                <q-input v-model="current_password"
                  :type="isCurrentPwd ? 'password' : 'text'" :placeholder="t('currentPassword')"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                  :error="!!errors.current_password"
                  :error-message="errors.current_password"
                  >
                  <template v-slot:append>
                    <q-icon
                      :name="isCurrentPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isCurrentPwd = !isCurrentPwd"
                    />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input v-model="new_password"
                  :type="isNewPwd ? 'password' : 'text'" :placeholder="t('newPassword')"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                  :error="!!errors.new_password"
                  :error-message="errors.new_password"
                  >
                  <template v-slot:append>
                    <q-icon
                      :name="isNewPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isNewPwd = !isNewPwd"
                    />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input v-model="re_new_password"
                  :type="isReNewPwd ? 'password' : 'text'" :placeholder="t('retypePassword')"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                  :error="!!errors.re_new_password"
                  :error-message="errors.re_new_password"
                  >
                  <template v-slot:append>
                    <q-icon
                      :name="isReNewPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isReNewPwd = !isReNewPwd"
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
import { useAuthStore } from 'src/stores/auth-store';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();

const $q = useQuasar();
const authStore = useAuthStore();
const emit = defineEmits(['closeMeEvent']);


const current_password = ref('');
const new_password = ref('');
const re_new_password = ref('');

const loading = ref(false);

const errors = ref({});
  const changePassword = async() => {
    loading.value = true;
    errors.value = {};
    const info = {
      current_password: current_password.value,
      new_password: new_password.value,
      re_new_password: re_new_password.value,
    };

    try {
      await authStore.changePassword(info);

      $q.notify({
        type: 'positive',
        position: 'top-right',
        message: 'The password is updated successfully.',
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
      handleClose();
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data;
        if (error.response.data.current_password) {
          errors.value.current_password = error.response.data.current_password.join(', ');
        }
        if (error.response.data.new_password) {
          errors.value.new_password = error.response.data.new_password.join(', ');
        }
        if (error.response.data.non_field_errors) {
          errors.value.re_new_password = error.response.data.non_field_errors.join(', ');
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
  const isCurrentPwd = ref(true);
  const isNewPwd = ref(true);
  const isReNewPwd = ref(true);

  const handleClose = () => {
    emit('closeMeEvent');
  };

</script>
