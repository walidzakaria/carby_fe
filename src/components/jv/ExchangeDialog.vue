<template>
  <div>
    <q-card style="max-width: 400px;">
      <q-card-section class="text-h6 text-white bg-green">
        <div class="text-h6">
          <q-icon color="white" name="credit_card" />
          {{ voucherId === 0 ? t('addExchange') : t('editExchange') }}
        </div>
      </q-card-section>
      <q-form @submit.prevent="saveVoucher" class="q-gutter-md">
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-lg-4 col-md-4 col-sm-5 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="journalVoucherInfo.fromOption"
                  :options="fromToOptions"
                  option-label="name"
                  option-value="id"
                  :label="`${t('from')} *`"
                  emit-value
                  map-options
                  dense class="full-width"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-8 col-md-8 col-sm-7 col-xs-12">
              <q-item-section>
                <q-select
                  v-if="journalVoucherInfo.fromOption === 'Branch'"
                  v-model="journalVoucherInfo.branch"
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
                <q-select
                  v-if="journalVoucherInfo.fromOption === 'Account'"
                  v-model="journalVoucherInfo.account"
                  :options="accounts"
                  option-label="name"
                  option-value="id"
                  :label="`${t('account')} *`"
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
                <q-input type="number" dense v-model="journalVoucherInfo.valueFrom" :label="t('valueFrom')"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                  @keydown="preventArrowKeys"
                  step="0.01"
                />
              </q-item-section>
              <q-item-section>
                <q-select
                  v-model="journalVoucherInfo.currencyFrom"
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
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input type="number" dense v-model="journalVoucherInfo.valueTo" :label="t('valueTo')"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                  @keydown="preventArrowKeys"
                  step="0.01"
                />
              </q-item-section>
              <q-item-section>
                <q-select
                  v-model="journalVoucherInfo.currencyTo"
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
            color="green"
            :loading="loading"
            style="min-width: 130px;"
            :label="t('save')"
            :disabled="journalVoucherInfo.id > 0 && !tablePermissions.payment.u">
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
import { useAccountStore } from 'src/stores/account-store';
import { useJvStore } from 'src/stores/jv-store';
import { useAuthStore } from 'src/stores/auth-store';


const { t } = useI18n();

const branchStore = useBranchStore();
const currencyStore = useCurrencyStore();
const accountStore = useAccountStore();
const jvStore = useJvStore();
const authStore = useAuthStore();

const $q = useQuasar();
const emit = defineEmits(['closeMeEvent']);

const props = defineProps({
  voucherId: Number,
});

const userBranches = computed({
  get: () => {
    const branches = branchStore.getBranches;
    const validBranches = branchStore.getUserBranches.map((ub) => ub.branch);
    return branches.filter((b) => validBranches.includes(b.id));
  },
});

const accounts = computed({
  get: () => {
    return accountStore.getAccounts;
  },
});

const journalVoucherInfo = ref({
  id: null,
  voucher_number: null,
  voucher_type: 'Exchange',
  fromOption: '',
  branch: null,
  account: null,
  valueFrom: null,
  currencyFrom: null,
  valueTo: null,
  currencyTo: null,
  exchange_rate: 1,
});

const loading = ref(false);

const errors = ref({});
const saveVoucher = async() => {
  const exchangeRateFrom = currency.value.filter((c) => c.id === journalVoucherInfo.value.currencyFrom)[0].rate;
  const exchangeRateTo = currency.value.filter((c) => c.id === journalVoucherInfo.value.currencyTo)[0].rate;
  try {
    const voucherInfo = {
      voucher_type: 'Exchange',
      description: 'Currency Exchange',
      lines: [
        {
          branch: journalVoucherInfo.value.fromOption === 'Branch' ? journalVoucherInfo.value.branch : null,
          account: journalVoucherInfo.value.fromOption === 'Account' ? journalVoucherInfo.value.account : null,
          debit: 0.00,
          credit: journalVoucherInfo.value.valueFrom,
          currency: journalVoucherInfo.value.currencyFrom,
          exchange_rate: exchangeRateFrom,
        },
        {
          branch: journalVoucherInfo.value.fromOption === 'Branch' ? journalVoucherInfo.value.branch : null,
          account: journalVoucherInfo.value.fromOption === 'Account' ? journalVoucherInfo.value.account : null,
          debit: journalVoucherInfo.value.valueTo,
          credit: 0.00,
          currency: journalVoucherInfo.value.currencyTo,
          exchange_rate: exchangeRateTo,
        },
      ],
    };
    console.log(voucherInfo);
    if (props.voucherId > 0) {
      await cashStore.updatePayment(journalVoucherInfo.value);
    } else {
      await jvStore.postJv(voucherInfo);
    }
    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: t('transactionSaved'),
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
  if (accounts.value.length === 0) accountStore.listAccounts();
  if (props.voucherId > 0) {
    await cashStore.retrievePayment(props.voucherId);
    const response = cashStore.getCurrentPayment;
    journalVoucherInfo.value.id = response.id;
    journalVoucherInfo.value.branch = response.branch;
    journalVoucherInfo.value.value = response.value;
    journalVoucherInfo.value.currency = response.currency;
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


const tablePermissions = computed({
  get: () => {
    return authStore.getPermissions.tables;
  },
});

const fromToOptions = ref([
  { id: 'Branch', name: t('aBranch') },
  { id: 'Account', name: t('anAccount') },
]);
</script>
