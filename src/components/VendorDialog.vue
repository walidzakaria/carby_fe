<template>
  <div>
    <q-card>
      <q-card-section class="text-h6 text-white bg-green">
        <div class="text-h6">{{ vendorId === 0 ? t('addVendor') : t('editVendor') }}</div>
      </q-card-section>
      <q-form @submit.prevent="saveVendor" class="q-gutter-md">
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="vendorInfo.name" :label="t('vendorName')"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                  :error="!!errors.name"
                  :error-message="errors.name"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input type="tel" dense v-model="vendorInfo.phone" maxlength="11" :label="t('phone')"/>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input type="tel" dense v-model="vendorInfo.instapay" :label="t('instapay')"/>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input type="text" dense v-model="vendorInfo.bank_account" :label="t('bankAccount')"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-toggle
            v-model="vendorInfo.is_active"
            checked-icon="check"
            color="green"
            :label="t('status')"
            unchecked-icon="clear"
          />
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
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useVendorStore } from 'src/stores/vendor-store';
const { t, locale } = useI18n();

const vendorStore = useVendorStore();

const $q = useQuasar();
const emit = defineEmits(['closeMeEvent']);

const props = defineProps({
  vendorId: Number,
});

const vendorInfo = ref({
  id: null,
  name: null,
  phone: null,
  instapay: null,
  bank_account: null,
  is_active: true,
});

const loading = ref(false);

const errors = ref({});
const saveVendor = async() => {
  loading.value = true;
  errors.value = {};

  try {
    let returnedId = 0;
    if (props.vendorId === 0) {
      const response = await vendorStore.createVendor(vendorInfo.value);
      returnedId = response.id
    } else {
      const response = await vendorStore.updateVendor(vendorInfo.value);
      returnedId = props.vendorId;
    }
    await vendorStore.listShortVendors();
    if (props.vendorId > 0) {
      await vendorStore.retrieveVendor(props.vendorId);
    }

    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: t('vendorSaved'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    handleClose(true);
  } catch (error) {
    if (error.status !== 403) {
      console.error(error);
      if (error.response && error.response.data) {
        errors.value = error.response.data;
        if (error.response.data.code) {
          errors.value.code = error.response.data.code.join(', ');
        }
        if (error.response.data.subcodes) {
          errors.value.codes = error.response.data.subcodes;
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
    }
  } finally {
    loading.value = false;
  }

};

const handleClose = (isSaved) => {
  emit('closeMeEvent', isSaved);
};

onMounted(() => {
  if (props.vendorId > 0) {
    const vendorData = vendorStore.getCurrentVendor;

    vendorInfo.value.id = props.vendorId;
    vendorInfo.value.name = vendorData.name;
    vendorInfo.value.phone = vendorData.phone;
    vendorInfo.value.instapay = vendorData.instapay;
    vendorInfo.value.bank_account = vendorData.bank_account;
    vendorInfo.value.is_active = vendorData.is_active;
  }
});
</script>

<style scoped>
.q-toggle {
  position: relative;
  margin-left: auto;
  margin-right: auto;
}
</style>
