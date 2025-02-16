<template>
  <div>
    <q-card>
      <q-card-section class="text-h6 text-white bg-green">
        <div class="text-h6">{{ attachmentInfo.id === 0 ? t('addAttachment') : t('editAttachment') }}</div>
      </q-card-section>
      <q-form @submit.prevent="saveAttachment" class="q-gutter-md">
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-file dense v-model="attachmentInfo.file" :label="t('attach')" accept="application/pdf" lazy-rules
                  :rules="[val => (!!val || attachmentInfo.id > 0) || t('required')]" :error="!!errors.file"
                  :error-message="errors.file" />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select v-model="attachmentInfo.file_type" :options="fileTypes" option-label="value"
                  option-value="key" :label="t('fileType')" emit-value map-options dense
                  :rules="[val => !!val || t('required')]" />
              </q-item-section>

            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12" v-if="attachmentInfo.file_type === 'OTHER'">
              <q-item-section>
                <q-input type="text" dense v-model="attachmentInfo.file_name" :label="t('fileName')" lazy-rules
                  :rules="[val => !!val || t('required')]" :error="!!errors.file_name"
                  :error-message="errors.file_name" />
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
  attachment: Object,
});

const attachmentInfo = ref({
  id: null,
  quotation: null,
  file: null,
  file_type: null,
  file_number: null,
});

const loading = ref(false);

const errors = ref({});
const saveAttachment = async () => {
  console.log('saveAttachment', attachmentInfo.value);
  const attachmentData = new FormData();
  if (attachmentInfo.value.file) attachmentData.append('file', attachmentInfo.value.file);
  attachmentData.append('file_type', attachmentInfo.value.file_type);
  attachmentData.append('file_number', attachmentInfo.value.file_number);
  attachmentData.append('file_name', attachmentInfo.value.file_name);
  attachmentData.append('quotation', props.attachment.quotation);
  try {
    if (props.attachment.id > 0) {
      attachmentData.append('id', props.attachment.id);
      await orderStore.editAttachment(attachmentData);
    } else {
      await orderStore.addAttachment(attachmentData);
    }
    handleClose(true);
  } catch (error) {
    console.log(error);
  }
};

const handleClose = (isSaved) => {
  const result = {
    isSaved,
    savedId: attachmentInfo.value.id,
  };
  emit('closeMeEvent', result);
};

onMounted(() => {
  if (props.attachment.id > 0) {
    const oldInfo = { ...props.attachment };
    oldInfo.file = null;
    attachmentInfo.value = oldInfo;
  }
});

const fileTypes = computed(() => {
  return [
    { key: 'CONDITIONS', value: t('conditions') },
    { key: 'SUPPLY_ORDER', value: t('supplyOrder') },
    { key: 'PAYMENT_ORDER', value: t('paymentOrder') },
    { key: 'OTHER', value: t('other') },
  ];
});

</script>
