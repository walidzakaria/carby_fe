<template>
  <div class="barcode-parent" dir="ltr">
    <svg ref="barcode"/>
  </div>
</template>

<script setup>
import JsBarcode from 'jsbarcode';
import { onMounted, ref } from 'vue';

const props = defineProps({
  value: { type: String, required: true },
  format: { type: String, default: 'CODE128' },
  displayValue: { type: Boolean, default: true },
});

const barcode = ref(null);

const generateBarcode = () => {
  JsBarcode(barcode.value, props.value, {
    format: props.format,
    width: 2,
    height: 40,
    displayValue: props.displayValue,
    textAlign: 'left',
    fontSize: 15,
  });
};

onMounted(() => {
  generateBarcode();
});

</script>


<style scoped>
  .barcode-parent svg {
    width: 100%;
    margin-top: 0;
    padding-right:0;
  }

  .barcode-parent {
    margin-top: -8px;
    margin-bottom: -10px;
    padding: 0;
  }
</style>
