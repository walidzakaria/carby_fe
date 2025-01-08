<template>
  <div class="flex flex-center">
    <StreamBarcodeReader
      @decode="onDecode"
      @loaded="onLoaded"
    />

  </div>
</template>

<script setup>
import { StreamBarcodeReader } from 'vue-barcode-reader';

import { ref } from 'vue';

const scannedData = ref('');
const cameraContainer = ref();

const emit = defineEmits(['codeRead']);

const onDecode = (text) => {
  scannedData.value = text;
  const audio = new Audio('/media/qr_scanner_sound.mp3');
  audio.play();
  emit('codeRead', text);
};
const onLoaded = () => {
  console.log('Ready to start scanning barcodes');
};


</script>
