<template>
  <div>
    <q-card style="max-width: 400px;">
      <q-card-section class="text-h6 text-white bg-primary">
        <div class="text-h6">
          <q-icon color="white" name="sell" />
          {{ collectionId === 0 ? t('addCollection') : t('editCollection') }}
        </div>
      </q-card-section>
      <q-form @submit.prevent="saveCollection" class="q-gutter-md">
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="collectionInfo.payment_type"
                  :options="paymentTypeOptions"
                  option-label="name"
                  option-value="id"
                  :label="`${t('paymentType')} *`"
                  emit-value
                  map-options
                  dense class="full-width"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="collectionInfo.branch"
                  :options="userBranches"
                  option-label="name"
                  option-value="id"
                  :label="`${t('branch')} *`"
                  emit-value
                  map-options
                  dense class="full-width"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <person-search
                  :listOptions="customers"
                  :label="`${t('customer')} *`"
                  :default-selection="collectionInfo.customer"
                  :is-required="true"
                  :is-autofocus="true"
                  :is-outlined="false"
                  :is-clearable="false"
                  @value-update="updateCustomer"/>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input type="number" dense v-model="collectionInfo.value" :label="`${t('value')} *`"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                  @keydown="preventArrowKeys"
                  step="0.01"
                />
              </q-item-section>
              <q-item-section>
                <q-select
                  v-model="collectionInfo.currency"
                  :options="currency"
                  option-label="name"
                  option-value="id"
                  :label="`${t('currency')} *`"
                  emit-value
                  map-options
                  lazy-rules
                  dense
                  :rules="[val => !!val || t('required')]"
                />
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
            color="primary"
            :loading="loading"
            style="min-width: 130px;"
            :label="t('save')"
            :disabled="collectionInfo.id > 0 && !tablePermissions.collection.u">
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
import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useBranchStore } from 'src/stores/branch-store';
import { useCurrencyStore } from 'src/stores/currency-store';
import { useCustomerStore } from 'src/stores/customer-store';
import { useCashStore } from 'src/stores/cash-store';
import { useAuthStore } from 'src/stores/auth-store';

const PersonSearch = defineAsyncComponent(() => import('components/PersonSearch.vue'));

const { t } = useI18n();

const branchStore = useBranchStore();
const currencyStore = useCurrencyStore();
const customerStore = useCustomerStore();
const cashStore = useCashStore();
const authStore = useAuthStore();

const $q = useQuasar();
const emit = defineEmits(['closeMeEvent']);

const props = defineProps({
  collectionId: Number,
});

const userBranches = computed({
  get: () => {
    const branches = branchStore.getBranches;
    const validBranches = branchStore.getUserBranches.map((ub) => ub.branch);
    return branches.filter((b) => validBranches.includes(b.id));
  },
});


const collectionInfo = ref({
  id: null,
  branch: localStorage.getItem('selectedBranch') ? parseInt(localStorage.getItem('selectedBranch'), 10) : null,
  value: null,
  currency: null,
  exchange_rate: 1,
  customer: null,
  payment_type: 'Collection'
});

const loading = ref(false);

const errors = ref({});
const saveCollection = async() => {
  const exchangeRate = currency.value.filter((c) => c.id === collectionInfo.value.currency)[0].rate;
  collectionInfo.value.exchange_rate = exchangeRate;
  try {
    if (props.collectionId > 0) {
      console.log(collectionInfo.value);
      await cashStore.updateCollection(collectionInfo.value);
    } else {
      await cashStore.createCollection(collectionInfo.value);
    }
    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: t('collectionSaved'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    handleClose(true);
  } catch (error) {
    console.log(error);
  }
};

const handleClose = (isSaved) => {
  emit('closeMeEvent', isSaved);
};

onMounted(async() => {
  if (props.collectionId > 0) {
    await cashStore.retrieveCollection(props.collectionId);
    const response = cashStore.getCurrentCollection;
    collectionInfo.value.id = response.id;
    collectionInfo.value.branch = response.branch;
    collectionInfo.value.value = response.value;
    collectionInfo.value.currency = response.currency;
    collectionInfo.value.customer = response.customer;
    collectionInfo.value.payment_type = response.payment_type;
  }
});

const preventArrowKeys = (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
  }
};

const currency = computed({
  get: () => { return currencyStore.getCurrency },
});

const customers = computed({
  get: () => customerStore.getCustomersShort || [],
});

const updateCustomer = (customerName) => {
  collectionInfo.value.customer = customerName.id;
};

const tablePermissions = computed({
  get: () => {
    return authStore.getPermissions.tables;
  },
});

const paymentTypeOptions = ref([
  { id: 'Collection', name: t('collection') },
  { id: 'Discount', name: t('discount') },
]);
</script>
