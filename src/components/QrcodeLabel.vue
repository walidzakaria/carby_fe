<template>
  <qrcode-vue :value="value" :size="size" level="H" />
</template>

<script setup>
import QrcodeVue from 'qrcode.vue';

const props = defineProps({
  value: { type: String, required: true },
  size: { type: Number, default: 60 },
});


</script>
