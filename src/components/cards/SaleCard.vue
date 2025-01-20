<template>
  <q-card bordered class="no-shadow">
    <q-item>
      <q-item-section avatar>
        <q-avatar size="60px" class="shadow-10">
          <q-icon :name="getIcon(status)" :color="getColor(status)"/>
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-grey-8 text-weight-bold">{{ id }}</q-item-label>
        <q-item-label caption>
          {{ t(status.toLowerCase()) }}
        </q-item-label>
        <q-item-label class="text-grey-8">
          {{ creationDate }}
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-item-label>
          <q-btn size="sm" flat round icon="edit" class="bg-blue-7 text-white" @click="showEdit" />
        </q-item-label>
        <q-item-label>
          <q-btn size="sm" flat round icon="delete" class="bg-red text-white" @click="handleClose" />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator></q-separator>
    <q-card-section :dir="locale === 'ar' ? 'rtl' : 'ltr'">
      <div class="q-pa-xs text-grey-8">
        <table style="width: 100%;">
          <tr>
            <td style="padding-right: 10px;">{{ t('customer') }}:</td>
            <td style="font-weight: 300;">{{ customer }}</td>
          </tr>
          <tr>
            <td style="padding-right: 10px;">{{ t('amount') }}:</td>
            <td style="font-weight: 300;">{{ total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}</td>
          </tr>
        </table>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from "vue-router";

const { t, locale } = useI18n();
const router = useRouter();

const props = defineProps({
  id: String,
  status: String,
  creationDate: String,
  customer: String,
  total: Number,
  user: Number,
});

const getIcon = (status) => {
  switch (status) {
    case 'Quotation':
      return 'local_offer';
    case 'Canceled':
      return 'not_interested';
    case 'Invoice':
      return 'description';
    case 'Closed':
      return 'lock';
    default:
      return 'help';
  }
};


const getColor = (status) => {
  switch (status) {
    case 'Quotation':
      return 'blue';
    case 'Canceled':
      return 'red';
    case 'Invoice':
      return 'green';
    case 'Closed':
      return 'grey';
    default:
      return 'black';
  }
};

const showEdit = () => {
  router.push(`/sales/${props.id}`);
}

const emit = defineEmits(['deleteMeEvent']);

const handleClose = () => {
  console.log('delete', props.id);
  emit('deleteMeEvent', props.id);
};
</script>

<style scoped>

</style>
