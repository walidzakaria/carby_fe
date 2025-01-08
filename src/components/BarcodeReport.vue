<template>
  <q-card>
    <q-card-section class="text-h6 ">
      <div class="text-h6">Print Barcode</div>
    </q-card-section>
    <q-card-section class="q-pa-sm">
      <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-item-section side>
          <div ref="doubleLabel" class="pdf-content" @click="reportType = 'doubleLabel'"
          :class="{
              labelSelected: showBorder && reportType === 'doubleLabel',
              labelUnselected: showBorder && reportType !== 'doubleLabel',
            }">
            <div style="height: 1.25cm; background-color: transparent; margin-top: -13px; margin-bottom: 11px;">
              <barcode-label-double :value="code"></barcode-label-double>
              <span style="float: right; margin-top: -13px; margin-right: 5px; position: relative; font-size: 10px;">
                <b v-show="showPrice" >{{ price }}</b>
              </span>
              <div class="dynamic-text-double">
                <p style="margin-top: -3.5px;">{{ name }}</p>
              </div>
            </div>
            <div style="height: 1.25cm; background-color: transparent; margin-top: 0">
              <barcode-label-double :value="code"></barcode-label-double>
              <span style="float: right; margin-top: -13px; margin-right: 5px; position: relative; font-size: 10px;">
                <b v-show="showPrice" >{{ price }}</b>
              </span>
              <div class="dynamic-text-double">
                <p style="margin-top: -3.5px;">{{ name }}</p>
              </div>
            </div>
          </div>
        </q-item-section>
        <q-item-section side>
          <div ref="singleLabel" class="pdf-content" @click="reportType = 'singleLabel'"
            :class="{
              labelSelected: showBorder && reportType === 'singleLabel',
              labelUnselected: showBorder && reportType !== 'singleLabel',
            }">
            <barcode-label-single :value="code"></barcode-label-single>
            <span style="float: right; margin-top: -25px; margin-right: 5px; position: relative;">
              <b v-show="showPrice" >{{ price }}</b>
            </span>
            <div class="dynamic-text">
              <p>{{ name }}</p>
            </div>
          </div>
        </q-item-section>
        <q-item-section side>
          <div ref="qrcodeLabel" class="pdf-content row" @click="reportType = 'qrcodeLabel'"
          :class="{
              labelSelected: showBorder && reportType === 'qrcodeLabel',
              labelUnselected: showBorder && reportType !== 'qrcodeLabel',
            }"
            >
            <div class="col-6">
              <qrcode-label :value="code" :size="65" style="margin: 2px auto auto 3px;"></qrcode-label>
            </div>
            <div class="col-6 qr-text">
              {{ name }}
              <b v-show="showPrice" style="font-size: 12px; display: contents;">
              {{ price }}
            </b>
            </div>
            <b style="font-size: 12px; margin-top: -6px; margin-left: 4px;">
              {{ code }}
            </b>
          </div>
        </q-item-section>
      </q-item>
    </q-card-section>
    <div v-if="pdfUrl">
      <iframe :src="pdfUrl" width="100%" height="400px"></iframe>
    </div>
    <q-item>
      <q-card-section class="q-pa-sm">
        <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-item-section>
            <q-select
              v-model="reportType"
              :options="reportTypeOptions"
              option-label="name"
              option-value="id"
              :label="t('reportType')"
              emit-value
              map-options
              dense
            />
          </q-item-section>
          <q-item-section>
            <q-toggle
              v-model="showPrice"
              checked-icon="check"
              color="green"
              :label="showPrice ? t('showPrice') : t('hidePrice')"
              unchecked-icon="clear"
            />
          </q-item-section>
          <q-item-section>
            <q-input type="number" step="0.01" @keydown="preventArrowKeys"
              dense v-model="numberOfCopies" :label="t('numberOfCopies')"/>
          </q-item-section>
        </q-item>
      </q-card-section>
    </q-item>
    <q-card-actions align="right">
      <q-btn class="text-capitalize text-white"
        type="button"
        color="grey"
        style="min-width: 130px;"
        :label="t('cancel')" @click="handleClose(false);">
      </q-btn>
      <q-btn class="text-capitalize text-white"
        @click="generatePDF"
        type="button"
        color="blue"
        :loading="loading"
        style="min-width: 130px;"
        :label="t('print')"
        icon="print">
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useI18n } from 'vue-i18n';
import { useProductStore } from 'src/stores/product-store';

const productStore = useProductStore();
const { t, locale } = useI18n();

const emit = defineEmits(['closeMeEvent']);
const props = defineProps({
  code: String,
  name: String,
  price: String,
});
import BarcodeLabelSingle from 'components/BarcodeLabelSingle.vue';
import BarcodeLabelDouble from 'components/BarcodeLabelDouble.vue';
import QrcodeLabel from './QrcodeLabel.vue';

const numberOfCopies = ref(1);
const showBorder = ref(true);

const loading = ref(false);
const pdfUrl = ref(null);
const singleLabel = ref();
const doubleLabel = ref();
const qrcodeLabel = ref();
const generated = ref(false);
const showPrice = ref(false);

const generatePDF = async () => {
  loading.value = true;
  const typeDict = {
    doubleLabel: 'barcode_double',
    singleLabel: 'barcode_single',
    qrcodeLabel: 'qr_code',
  };

  const reportInfo = {
    price: showPrice.value ? props.price : '',
    barcode: props.code,
    number_of_copies: numberOfCopies.value,
    product_name: props.name,
    code_type: typeDict[reportType.value],
  };
  const response = await productStore.printBarcode(reportInfo);
  const url = URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));

  pdfUrl.value = url;
  loading.value = false;
  // showBorder.value = false;
  // let element = null;
  // if (reportType.value === 'doubleLabel') {
  //   element = doubleLabel.value;
  // } else if (reportType.value === 'singleLabel') {
  //   element = singleLabel.value;
  // } else {
  //   element = qrcodeLabel.value;
  // }
  // const printTimes = reportType.value === 'doubleLabel' ? Math.ceil(numberOfCopies.value / 2) : numberOfCopies.value;

  // // Create a new jsPDF instance with custom page size
  // const doc = new jsPDF({
  //   orientation: 'l', // Portrait orientation
  //   unit: 'mm', // Use millimeters
  //   format: [400, 250], // Width x Height in mm
  // });

  // const canvas = await html2canvas(element, {
  //   scale: 20, // Higher scale for better quality
  //   useCORS: true, // Ensure CORS is handled if necessary
  //   willReadFrequently: true, // Optimize for frequent readback operations
  // });

  // // Convert canvas to image data
  // const imgData = canvas.toDataURL('image/png');
  // for (let x = 1; x <= printTimes; x++) {
  //   doc.addImage(imgData, 'PNG', 0, 0, 400, 250);
  //   if (x < printTimes) {
  //     doc.addPage();
  //   }
  // }

  // const pdfBlob = doc.output('blob');
  // const newPdfUrl = URL.createObjectURL(pdfBlob);

  // // Clean up old URL if it exists
  // if (pdfUrl.value) {
  //   URL.revokeObjectURL(pdfUrl.value);
  // }

  // pdfUrl.value = newPdfUrl;
  // loading.value = false;
  // generated.value = true;
  // showBorder.value = true;
}

const handleClose = (isSaved) => {
  emit('closeMeEvent', isSaved);
};

const reportType = ref('doubleLabel');
const reportTypeOptions = ref([
  { id: 'doubleLabel', name: t('doubleBarcode') },
  { id: 'singleLabel', name: t('singleBarcode') },
  { id: 'qrcodeLabel', name: t('qrCode') },
]);

const preventArrowKeys = (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
  }
};


</script>

<style scoped>
.dynamic-text {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; /* Adjust as needed */
  font-size: 10px; /* Font size relative to viewport width */
  margin-top: -25px;
  text-align: center;
}

.dynamic-text-double {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; /* Adjust as needed */
  font-size: 9px; /* Font size relative to viewport width */
  text-align: center;
  position: relative;
}

.pdf-content {
  height: 2.5cm;
  width: 4.1cm;
  border: 1px solid white;
  background-color: white;
  color: black;
  padding: 0;
  cursor: pointer;
}

.labelSelected {
  border: 1px solid red;
}

.labelUnselected {
  border: 1px dotted gray;
}

.qr-text {
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 10px;
  position: relative;
  margin: auto;
}
</style>
