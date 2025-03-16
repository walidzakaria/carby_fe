<template>
  <div>
    <q-card>
      <q-card-section class="text-h6 text-white bg-green">
        <div class="text-h6">{{ insuranceInfo.id === 0 ? t('addInsurance') : t('editInsurance') }}</div>
      </q-card-section>
      <q-form @submit.prevent="saveInsurance" class="q-gutter-md">
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input type="number" step="0.01" dense v-model="insuranceInfo.amount" :label="t('amount')" lazy-rules
                  :rules="[val => !!val || t('required')]" :error="!!errors.amount" :error-message="errors.amount" />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input type="date" dense v-model="insuranceInfo.due_date" :label="t('dueDate')" lazy-rules
                  :rules="[val => !!val || t('required')]" :error="!!errors.due_date"
                  :error-message="errors.due_date" />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-toggle dense v-model="insuranceInfo.is_paid" :label="t('isPaid')" />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input type="date" dense v-model="insuranceInfo.payment_date" :label="t('paymentDate')" lazy-rules
                  :rules="[val => !!val || !insuranceInfo.is_paid || t('required')]" :error="!!errors.payment_date"
                  :error-message="errors.payment_date" v-if="insuranceInfo.is_paid" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn class="text-capitalize text-white" type="button" color="grey" style="min-width: 130px;"
            :label="t('cancel')" @click="handleClose(false);">
          </q-btn>
          <q-btn class="text-capitalize text-white" type="submit" color="green" :loading="loading"
            style="min-width: 130px;" :label="t('save')">
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
import { useOrderStore } from 'src/stores/order-store';
const { t } = useI18n();

const orderStore = useOrderStore();

const $q = useQuasar();
const emit = defineEmits(['closeMeEvent']);

const props = defineProps({
  insurance: Object,
});

const insuranceInfo = ref({
  id: null,
  quotation: null,
  amount: null,
  due_date: null,
  is_paid: false,
  payment_date: null,
});

const loading = ref(false);

const errors = ref({});
const saveInsurance = async () => {

  try {
    if (props.insurance.id > 0) {
      await orderStore.editInsurance(insuranceInfo.value);
    } else {
      await orderStore.addInsurance(insuranceInfo.value);
    }
    handleClose(true);
  } catch (error) {
    console.log(error);
  }
};

const handleClose = (isSaved) => {
  const result = {
    isSaved,
    savedId: insuranceInfo.value.id,
  };
  emit('closeMeEvent', result);
};

onMounted(() => {
  insuranceInfo.value = { ...props.insurance };
});

</script>
