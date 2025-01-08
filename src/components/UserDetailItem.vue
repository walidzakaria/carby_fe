<template>
  <q-item clickable v-ripple>
    <q-item-section avatar top>
      <q-avatar :icon="icon" color="grey-2" :text-color="text_color"/>
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{ showValue() }}</q-item-label>
      <q-item-label caption class="text-grey-8">{{ label }}</q-item-label>
    </q-item-section>

  </q-item>
</template>

<script setup>

const props = defineProps({
  icon: String,
  text_color: String,
  value: [String, Number, Boolean],
  label: String,
});
const showValue = () => {
  if (typeof props.value === 'boolean') {
    return props.value ? 'Yes' : 'No';
  }
  return props.value ?? '';
};
</script>

