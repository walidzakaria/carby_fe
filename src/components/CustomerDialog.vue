<template>
  <div>
    <q-card>
      <q-card-section class="text-h6 text-white bg-green">
        <div class="text-h6">{{ customerId === 0 ? t('addCustomer') : t('editCustomer') }}</div>
      </q-card-section>
      <q-form @submit.prevent="saveCustomer" class="q-gutter-md">
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="customerInfo.name" :label="t('customerName')"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                  :error="!!errors.name"
                  :error-message="errors.name"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="customerInfo.governate" :label="t('governate')"
                :rules="[val => !!val || t('required')]" />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="customerInfo.region_city" :label="t('regionCity')"
                  :rules="[val => !!val || t('required')]" />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="customerInfo.street" :label="t('street')"
                :rules="[val => !!val || t('required')]" />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="customerInfo.building_number" :label="t('buildingNumber')"
                  :rules="[val => !!val || t('required')]" />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input type="textarea" rows="4" dense v-model="customerInfo.additional_information" :label="t('additionalInformation')"/>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select dense v-model="customerInfo.type" :options="customerTypes" :label="t('type')" map-options
                :rules="[val => !!val || t('required')]" />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="customerInfo.customer_id" :label="t('customerId')"
                :rules="[val => !!val || t('required')]" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-toggle
            v-model="customerInfo.is_active"
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
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useCustomerStore } from 'src/stores/customer-store';

const { t } = useI18n();
const customerStore = useCustomerStore();
const $q = useQuasar();
const emit = defineEmits(['closeMeEvent']);
const props = defineProps({
  customerId: Number,
});

const customerInfo = ref({
  id: null,
  name: null,
  governate: null,
  region_city: null,
  street: null,
  building_number: null,
  additional_information: null,
  type: 'B',
  customer_id: null,
  is_active: true,
});

const customerTypes = [
  { label: t('person'), value: 'P' },
  { label: t('business'), value: 'B' },
  { label: t('foreigner'), value: 'F' },
];

const loading = ref(false);
const errors = ref({});

const saveCustomer = async () => {
  loading.value = true;
  errors.value = {};

  try {
    let returnedId = 0;
    if (props.customerId === 0) {
      const response = await customerStore.createCustomer(customerInfo.value);
      returnedId = response.id;
    } else {
      const response = await customerStore.updateCustomer(customerInfo.value);
      returnedId = props.customerId;
    }
    await customerStore.listShortCustomers();
    if (props.customerId > 0) {
      await customerStore.retrieveCustomer(props.customerId);
    }

    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: t('customerSaved'),
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
  if (props.customerId > 0) {
    const customerData = customerStore.getCurrentCustomer;

    customerInfo.value.id = props.customerId;
    customerInfo.value.name = customerData.name;
    customerInfo.value.governate = customerData.governate;
    customerInfo.value.region_city = customerData.region_city;
    customerInfo.value.street = customerData.street;
    customerInfo.value.building_number = customerData.building_number;
    customerInfo.value.additional_information = customerData.additional_information;
    customerInfo.value.type = customerData.type;
    customerInfo.value.customer_id = customerData.customer_id;
    customerInfo.value.is_active = customerData.is_active;
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
