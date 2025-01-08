<template>
  <div>
    <q-card style="max-width: 400px;">
      <q-card-section class="text-h6 text-white bg-red">
        <div class="text-h6">
          <q-icon color="white" name="credit_card" />
          {{ paymentId === 0 ? t('addTransfer') : t('editTransfer') }}
        </div>
      </q-card-section>
      <q-form @submit.prevent="savePayment" class="q-gutter-md">
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="paymentInfo.branch"
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
                  :listOptions="vendors"
                  :label="`${t('vendor')} *`"
                  :default-selection="paymentInfo.vendor"
                  :is-required="true"
                  :is-autofocus="true"
                  :is-outlined="false"
                  :is-clearable="false"
                  @value-update="updateVendor"/>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input type="number" dense v-model="paymentInfo.value" :label="t('value')"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                  @keydown="preventArrowKeys"
                  step="0.01"
                />
              </q-item-section>
              <q-item-section>
                <q-select
                  v-model="paymentInfo.currency"
                  :options="currency"
                  option-label="name"
                  option-value="id"
                  :label="t('currency')"
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
            color="red"
            :loading="loading"
            style="min-width: 130px;"
            :label="t('save')"
            :disabled="paymentInfo.id > 0 && !tablePermissions.payment.u">
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
import { useVendorStore } from 'src/stores/vendor-store';
import { useCashStore } from 'src/stores/cash-store';
import { useAuthStore } from 'src/stores/auth-store';

const PersonSearch = defineAsyncComponent(() => import('components/PersonSearch.vue'));

const { t } = useI18n();

const branchStore = useBranchStore();
const currencyStore = useCurrencyStore();
const vendorStore = useVendorStore();
const cashStore = useCashStore();
const authStore = useAuthStore();

const $q = useQuasar();
const emit = defineEmits(['closeMeEvent']);

const props = defineProps({
  paymentId: Number,
});

const userBranches = computed({
  get: () => {
    const branches = branchStore.getBranches;
    const validBranches = branchStore.getUserBranches.map((ub) => ub.branch);
    return branches.filter((b) => validBranches.includes(b.id));
  },
});


const paymentInfo = ref({
  id: null,
  branch: localStorage.getItem('selectedBranch') ? parseInt(localStorage.getItem('selectedBranch'), 10) : null,
  value: null,
  currency: null,
  exchange_rate: 1,
  vendor: null,
  payment_type: 'Collection'
});

const loading = ref(false);

const errors = ref({});
const savePayment = async() => {
  const exchangeRate = currency.value.filter((c) => c.id === paymentInfo.value.currency)[0].rate;
  paymentInfo.value.exchange_rate = exchangeRate;
  try {
    if (props.paymentId > 0) {
      console.log(paymentInfo.value);
      await cashStore.updatePayment(paymentInfo.value);
    } else {
      await cashStore.createPayment(paymentInfo.value);
    }
    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: t('paymentSaved'),
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
  if (props.paymentId > 0) {
    await cashStore.retrievePayment(props.paymentId);
    const response = cashStore.getCurrentPayment;
    paymentInfo.value.id = response.id;
    paymentInfo.value.branch = response.branch;
    paymentInfo.value.value = response.value;
    paymentInfo.value.currency = response.currency;
    paymentInfo.value.vendor = response.vendor;
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

const vendors = computed({
  get: () => vendorStore.getVendorsShort || [],
});

const updateVendor = (vendorName) => {
  paymentInfo.value.vendor = vendorName.id;
}

const tablePermissions = computed({
  get: () => {
    return authStore.getPermissions.tables;
  },
});

</script>
