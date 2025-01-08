<template>
  <div>
    <q-card>
      <q-card-section class="text-h6 text-white bg-green">
        <div class="text-h6">{{ transaction.id === 0 ? t('addTransaction') : t('editTransaction') }}</div>
      </q-card-section>
      <q-form @submit.prevent="saveTransaction" class="q-gutter-md">
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="transactionInfo.branch"
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
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select dense v-model="transactionInfo.transaction_type" :label="`${t('type')} *`"
                  :options="transactionTypeOptions"
                  option-label="name"
                  option-value="id"
                  emit-value
                  map-options
                  :rules="[val => !!val || t('required')]"
                  :error="!!errors.transaction_type"
                  :error-message="errors.transaction_type"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="transactionInfo.value" :label="`${t('value')} *`"
                  type="number"
                  :rules="[val => !!val || t('required')]"
                  :error="!!errors.value"
                  :error-message="errors.value"
                  @focus="calculateSalary"
                />
              </q-item-section>
            </q-item>

            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="transactionInfo.comment" :label="t('comment')"
                  type="textarea" />
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
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useEmployeeStore } from 'src/stores/employee-store';
import { useBranchStore } from 'src/stores/branch-store';
const { t } = useI18n();

const employeeStore = useEmployeeStore();
const branchStore = useBranchStore();

const $q = useQuasar();
const emit = defineEmits(['closeMeEvent']);
const props = defineProps({
  transaction: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      transactionType: '',
      transactionValue: 0,
      transactionComment: '',
      transactionBranch: null,
    })
  }
});

const transactionInfo = ref({
  id: null,
  transaction_type: null,
  value: null,
  comment: null,
  branch: null,
});

const loading = ref(false);

const errors = ref({});
const saveTransaction = async() => {

  const transactionDetails = {
    id: transactionInfo.value.id,
    employee: props.transaction.employee,
    transaction_date: new Date().toISOString(),
    transaction_type: transactionInfo.value.transaction_type,
    value: transactionInfo.value.value,
    comment: transactionInfo.value.comment,
    branch: transactionInfo.value.branch,
  };

  try {
    if (props.transaction.id > 0) {
      console.log(transactionInfo.value);
      const response = await employeeStore.updateTransaction(transactionDetails);
    } else {
      const response = await employeeStore.createNewTransaction(transactionDetails);
    }
    handleClose(true);
  } catch (error) {
    console.log(error);
  }
};

const handleClose = (isSaved) => {
  emit('closeMeEvent', isSaved);
};

onMounted(() => {
  console.log(props.transaction);
  if (props.transaction.id > 0) {
    transactionInfo.value.id = props.transaction.id;
    transactionInfo.value.employee = props.transaction.employee;
    transactionInfo.value.transaction_type = props.transaction.transactionType;
    transactionInfo.value.value = props.transaction.transactionValue;
    transactionInfo.value.comment = props.transaction.transactionComment;
    transactionInfo.value.branch = props.transaction.transactionBranch;
  }
  console.log(transactionInfo.value);
});

const transactionTypeOptions = ref([
  { name: t('salary'), id: 'Salary' },
  { name: t('bonus'), id: 'Bonus' },
  { name: t('withdrawal'), id: 'Withdrawal' },
  { name: t('deduction'), id: 'Deduction' },
  { name: t('loan'), id: 'Loan' },
  { name: t('reimbursement'), id: 'Reimbursement' },
]);

const userBranches = computed({
  get: () => {
    const branches = branchStore.getBranches;
    const validBranches = branchStore.getUserBranches.map((ub) => ub.branch);
    return branches.filter((b) => validBranches.includes(b.id));
  },
});


const calculateSalary = async() => {
  if (!transactionInfo.value.salary && transactionInfo.value.transaction_type === 'Salary') {
    loading.value = true;
    const d = new Date();
    console.log(d);
    d.setDate(1);
    const params = {
      employee: props.transaction.employee,
      input_date: d.toISOString().split('T')[0],
    };
    const salary = await employeeStore.calculateSalary(params);
    transactionInfo.value.value = salary.result;
    loading.value = false;
  }
};
</script>
