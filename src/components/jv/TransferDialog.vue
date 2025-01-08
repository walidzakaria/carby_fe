<template>
  <div>
    <q-card style="max-width: 400px;">
      <q-card-section class="text-h6 text-white bg-primary">
        <div class="text-h6">
          <q-icon color="white" name="credit_card" />
          {{ voucherId === 0 ? t('addTransfer') : t('editTransfer') }}
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
                  v-model="journalVoucherInfo.from_banch"
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
                  v-model="journalVoucherInfo.from_account"
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
            <q-item class="col-lg-4 col-md-4 col-sm-5 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="journalVoucherInfo.toOption"
                  :options="fromToOptions"
                  option-label="name"
                  option-value="id"
                  :label="`${t('to')} *`"
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
                  v-if="journalVoucherInfo.toOption === 'Branch'"
                  v-model="journalVoucherInfo.to_branch"
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
                  v-if="journalVoucherInfo.toOption === 'Account'"
                  v-model="journalVoucherInfo.to_account"
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
                <q-input type="number" dense v-model="journalVoucherInfo.value" :label="t('value')"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                  @keydown="preventArrowKeys"
                  step="0.01"
                />
              </q-item-section>
              <q-item-section>
                <q-select
                  v-model="journalVoucherInfo.currency"
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
            color="primary"
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
  voucher_type: 'Transfer',
  fromOption: '',
  from_banch: null,
  from_account: null,
  toOption: '',
  to_branch: null,
  to_account: null,
  value: null,
  currency: null,
  exchange_rate: 1,
});

const loading = ref(false);

const errors = ref({});
const saveVoucher = async() => {
  const exchangeRate = currency.value.filter((c) => c.id === journalVoucherInfo.value.currency)[0].rate;
  journalVoucherInfo.value.exchange_rate = exchangeRate;
  try {
    const voucherInfo = {
      voucher_type: 'Transfer',
      description: `Transfer from ${journalVoucherInfo.value.fromOption} to ${journalVoucherInfo.value.toOption}`,
      lines: [
        {
          branch: journalVoucherInfo.value.fromOption === 'Branch' ? journalVoucherInfo.value.from_banch : null,
          account: journalVoucherInfo.value.fromOption === 'Account' ? journalVoucherInfo.value.from_account : null,
          debit: 0.00,
          credit: journalVoucherInfo.value.value,
          currency: journalVoucherInfo.value.currency,
          exchange_rate: journalVoucherInfo.value.exchange_rate,
        },
        {
          branch: journalVoucherInfo.value.toOption === 'Branch' ? journalVoucherInfo.value.to_branch : null,
          account: journalVoucherInfo.value.toOption === 'Account' ? journalVoucherInfo.value.to_account : null,
          debit: journalVoucherInfo.value.value,
          credit: 0.00,
          currency: journalVoucherInfo.value.currency,
          exchange_rate: journalVoucherInfo.value.exchange_rate,
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
