<template>
  <div>
    <q-input
      class="full-width"
      v-model="formattedDate"
      :label="`${t('period')} *`"
      readonly
      @focus="showPopup = true"
      dense autogrow outlined
      style="min-width: 220px; cursor: pointer;"
      :error-message="t('required')"
    >
    <template v-slot:append>
      <q-icon name="event" />
    </template>
    </q-input>

    <q-popup-proxy
      v-model="showPopup"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-date
        v-model="dateRange"
        range
        mask="YYYY/MM/DD"
        @update:model-value="invokeUpdate"
      />
    </q-popup-proxy>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';


const { t, locale } = useI18n();
const emit = defineEmits(['update']);

const dateRange = ref({
  from: null,
  to: null,
});

const props = defineProps({
  startDate: String,
  endDate: String,
});

const showPopup = ref(false);

const formattedDate = computed({
  get: () => {
    return `${dateRange?.value?.from || '~'} - ${dateRange?.value?.to || '~'}`;
  },
});

const invokeUpdate = (value) => {
  if (value) {
    console.log('value', value, typeof(value));
    if (typeof(value) === 'string') {
      dateRange.value = {
        from: value,
        to: value,
      };
    }
    showPopup.value = false;
    emit('update', dateRange.value);
  }
};

onMounted(() => {
  dateRange.value.from = props.startDate;
  dateRange.value.to = props.endDate;
});
</script>
