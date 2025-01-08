<template>
  <q-select
      dense :outlined="isOutlined"
      class="full-width"
      style="padding: 0"
      v-model="selectedPerson"
      :options="personOptions"
      :label="label"
      :clearable="isClearable"
      use-input
      input-debounce="0"
      @filter="filterFnProd"
      option-label="name"
      option-value="id"
      options-selected-class="text-deep-orange"
      :loading="loadingNames"
      @update:model-value="setName"
      :rules="[val => !isRequired || !!val  || t('required')]"
      :autofocus="isAutofocus"
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>{{ scope.opt.name }} ({{ scope.opt.id }})</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const emit = defineEmits(['valueUpdate']);

const props = defineProps({
  listOptions: Array,
  label: String,
  defaultSelection: {},
  isRequired: {
    type: Boolean,
    default: false,
  },
  isAutofocus: {
    type: Boolean,
    default: false,
  },
  isOutlined: {
    type: Boolean,
    default: true,
  },
  isClearable: {
    type: Boolean,
    default: true,
  },
});

const selectedPerson = ref();

const loadingNames = ref(false);
const personOptions = ref([]);

// Filter function for the search input
const filterFnProd = (val, update, abort) => {
  if (val === '') {
    update(() => {
      personOptions.value = props.listOptions;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    personOptions.value = props.listOptions.filter(v =>
      v.name.toLowerCase().includes(needle) ||
      v.id.toString().toLowerCase().includes(needle)
    );
  });
};

// On mount, set initial options and selected value
onMounted(() => {
  personOptions.value = props.listOptions;
  matchName(props.defaultSelection);
});

// Emit the selected person value when changed
const setName = (val) => {
  emit('valueUpdate', val);
};

const matchName = (nameId) => {
  const selection = props.listOptions.filter((n) => n.id === nameId);
  if (selection.length > 0) {
    selectedPerson.value = selection[0];
  } else {
    selectedPerson.value = null;
  }
};

watch(() => props.defaultSelection, (newVal) => {
  matchName(newVal);
}, { immediate: true });

</script>
