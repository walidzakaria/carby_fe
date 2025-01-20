<template>
  <div>
    <q-card>
      <!-- Card Header -->
      <q-card-section class="text-h6 text-white bg-blue">
        <div class="text-h6">{{ lineInfo.index === -1 ? t('addLine') : t('editLine') }}</div>
      </q-card-section>

      <!-- Form Section -->
      <q-form @submit.prevent="saveLine" class="q-gutter-md">
        <q-card-section class="q-pa-sm">
          <q-list class="row q-col-gutter-md">
            <!-- Vendor Input -->
            <div style="display: flex; flex-direction: row; flex-wrap: wrap; width: 100%; padding-bottom: 19px;">
              <person-search
                class="person-search"
                :listOptions="vendors"
                :default-selection="lineInfo.vendor"
                :isOutlined="true"
                :label="t('vendor')"
                :rules="[val => !!val || t('required')]"
                @value-update="updateVendor"
                :is-autofocus="true"
                :emit-value="true"
                :map-options="true"
                :is-clearable="false"
              />

              <span class="side-buttons">
                <div class="row">
                  <q-btn icon="add" color="green" size="sm" type="button" outline round
                    style="margin: auto;" @click="showAddVendor(0)">
                    <q-tooltip class="bg-accent">{{ t('addVendor') }}</q-tooltip>
                  </q-btn>
                  <q-btn icon="edit" color="orange" size="sm" :disable="!lineInfo.vendor"
                    type="button" outline round style="margin: auto;"
                    @click="showAddVendor(lineInfo.vendor)">
                    <q-tooltip class="bg-accent">{{ t('editVendor') }}</q-tooltip>
                  </q-btn>
                  <q-btn icon="delete" color="red" size="sm"
                    :disable="!lineInfo.vendor"
                    @click="confirmDeleteVendor(lineInfo.vendor)"
                    type="button" outline round style="margin: auto;">
                    <q-tooltip class="bg-accent">{{ t('deleteVendor') }}</q-tooltip>
                  </q-btn>
                </div>
              </span>
            </div>

            <div style="display: flex; flex-direction: row; flex-wrap: wrap; width: 100%; padding-bottom: 19px;">
              <person-search
                class="person-search"
                :listOptions="products"
                :default-selection="lineInfo.product"
                :isOutlined="true"
                :label="t('product')"
                :rules="[val => !!val || t('required')]"
                @value-update="updateProduct"
                :is-clearable="false"
              />
              <span class="side-buttons">
                <div class="row">
                  <q-btn icon="add" color="green" size="sm" type="button" outline round
                    style="margin: auto;" @click="showAddProduct(0)">
                    <q-tooltip class="bg-accent">{{ t('addProduct') }}</q-tooltip>
                  </q-btn>
                  <q-btn icon="edit" color="orange" size="sm" :disable="!lineInfo.product"
                    type="button" outline round style="margin: auto;"
                    @click="showAddProduct(lineInfo.product)">
                    <q-tooltip class="bg-accent">{{ t('editProduct') }}</q-tooltip>
                  </q-btn>
                  <q-btn icon="delete" color="red" size="sm"
                    :disable="!lineInfo.product"
                    @click="confirmDeleteProduct(lineInfo.product)"
                    type="button" outline round style="margin: auto;">
                    <q-tooltip class="bg-accent">{{ t('deleteProduct') }}</q-tooltip>
                  </q-btn>
                </div>
              </span>
            </div>

            <!-- Description Input -->
            <div style="display: flex; flex-direction: row; flex-wrap: wrap; width: 100%; padding-bottom: 19px;">
              <person-search
                class="person-search"
                :listOptions="descriptions"
                :default-selection="lineInfo.description"
                :isOutlined="true"
                :label="t('description')"
                :rules="[val => !!val || t('required')]"
                @value-update="updateDescription"
                :key="optionsKey"
                :is-clearable="false"
              />
              <span class="side-buttons">
                <div class="row">
                  <q-btn icon="add" color="green" size="sm" type="button" outline round
                    style="margin: auto;" @click="showAddDescription(0)"
                    :disable="!lineInfo.product">
                    <q-tooltip class="bg-accent">{{ t('addDescription') }}</q-tooltip>
                  </q-btn>
                  <q-btn icon="edit" color="orange" size="sm" :disable="!lineInfo.description"
                    type="button" outline round style="margin: auto;"
                    @click="showAddDescription(lineInfo.description)">
                    <q-tooltip class="bg-accent">{{ t('editDescription') }}</q-tooltip>
                  </q-btn>
                  <q-btn icon="delete" color="red" size="sm"
                    :disable="!lineInfo.description"
                    @click="confirmDeleteDescription(lineInfo.description)"
                    type="button" outline round style="margin: auto;">
                    <q-tooltip class="bg-accent">{{ t('deleteDescription') }}</q-tooltip>
                  </q-btn>
                </div>
              </span>
            </div>

            <!-- Quantity Input -->
            <q-item class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-input type="number" dense outlined v-model="lineInfo.quotation_quantity" :label="t('quantity')"
                  lazy-rules :rules="[val => !!val || t('required')]" />
              </q-item-section>
            </q-item>
            <!-- Unit Type Input -->
            <q-item class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="lineInfo.unit_type"
                  :options="units"
                  option-label="description"
                  option-value="id"
                  :label="t('unit')"
                  emit-value
                  map-options
                  lazy-rules
                  dense
                  outlined
                  :rules="[val => !!val || t('required')]"
                />
              </q-item-section>
            </q-item>


            <!-- Unit Value Input -->
            <q-item class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <q-item-section>
                <q-input type="number" dense outlined v-model="lineInfo.unit_value" :label="t('unitValue')"
                  lazy-rules :rules="[val => !!val || t('required')]"
                  @change="calculateSales" />
              </q-item-section>
            </q-item>

            <!-- Margin Input -->
            <q-item class="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-xs-12">
              <q-item-section>
                <q-input type="number" dense outlined v-model="lineInfo.margin" :label="t('profit')"
                  suffix="%"
                  lazy-rules :rules="[val => !!val || t('required')]"
                  @blur="calculateSales" @change="calculateSales" />
              </q-item-section>
            </q-item>

            <!-- Sales Price Input -->
            <q-item class="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-xs-12">
              <q-item-section>
                <q-input type="number" dense outlined v-model="lineInfo.sales_price" :label="t('salesPrice')"
                  lazy-rules :rules="[val => !!val || t('required')]"
                  :hint="`${t('total')}: ${totalValue || 0}`"
                  @change="calculateMargin" />
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>

        <!-- Form Actions -->
        <q-card-actions align="right">
          <q-btn class="text-capitalize text-white" type="button" color="grey" style="min-width: 130px;" :label="t('cancel')" @click="handleClose(false);"></q-btn>
          <q-btn class="text-capitalize text-white" type="submit" color="blue" :loading="loading" style="min-width: 130px;" :label="t('save')">
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-form>

      <q-dialog v-model="showVendorDialog">
        <vendor-dialog :vendorId="vendorToEdit" @closeMeEvent="handleCloseVendorDialog" />
      </q-dialog>

      <q-dialog v-model="showProductDialog">
        <product-dialog :productId="productToEdit" @closeMeEvent="handleCloseProductDialog" />
      </q-dialog>

      <q-dialog v-model="showDescriptionDialog">
        <description-dialog :description-id="descriptionToEdit" @closeMeEvent="handleCloseDescriptionDialog" />
      </q-dialog>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { useVendorStore } from 'src/stores/vendor-store';
import { useProductStore } from 'src/stores/product-store';
import { useUnitStore } from 'src/stores/unit-store';

const vendorStore = useVendorStore();
const productStore = useProductStore();
const unitStore = useUnitStore();

const PersonSearch = defineAsyncComponent(() => import('components/PersonSearch.vue'));
const VendorDialog = defineAsyncComponent(() => import('components/VendorDialog.vue'));
const ProductDialog = defineAsyncComponent(() => import('components/ProductDialog.vue'));
const DescriptionDialog = defineAsyncComponent(() => import('components/DescriptionDialog.vue'));
const UnitDialog = defineAsyncComponent(() => import('components/UnitDialog.vue'));

const { t } = useI18n();

const $q = useQuasar();
const emit = defineEmits(['closeMeEvent']);
const props = defineProps({
  index: Number,
  vendor: Number,
  product: Number,
  description: Number,
  unit_type: Number,
  quotation_quantity: Number,
  unit_value: Number,
  margin: Number,
  sales_price: Number,
});

const vendors = computed({
  get: () => {
    return vendorStore.getVendorsShort;
  },
});

const products = computed({
  get: () => {
    return productStore.getProducts;
  },
});

const units = computed({
  get: () => {
    return unitStore.getUnits;
  },
});

const lineInfo = ref({
  index: null,
  vendor: null,
  product: null,
  description: null,
  unit_type: null,
  quotation_quantity: null,
  unit_value: null,
  margin: null,
  sales_price: null,
  quotation_total_value: null,
  quantity: null,
  total_value: null,
});

const totalValue = computed({
  get: () => {
    return Math.round(lineInfo.value.quotation_quantity * lineInfo.value.sales_price) || 0;
  },
});

const loading = ref(false);
const errors = ref({});

const saveLine = () => {
  handleClose(true);
};

const handleClose = (isSaved) => {
  const result = {
    isSaved,
    output: isSaved ? {
      index: lineInfo.value.index,
      vendor: vendorStore.getVendorsShort.find((v) => v.id === lineInfo.value.vendor),
      product: productStore.getProducts.find((p) => p.id === lineInfo.value.product),
      description: productStore.getCurrentProduct.descriptions.find((d) => d.id === lineInfo.value.description),
      unit_type: unitStore.getUnits.find((u) => u.id === lineInfo.value.unit_type),
      quotation_quantity: lineInfo.value.quotation_quantity,
      quantity: lineInfo.value.quotation_quantity,
      unit_value: lineInfo.value.unit_value,
      margin: lineInfo.value.margin,
      sales_price: lineInfo.value.sales_price,
      total_value: totalValue.value,
      quotation_total_value: totalValue.value,
    } : null,
  };
  emit('closeMeEvent', result);
};

onMounted(() => {
  lineInfo.value.index = props.index;
  lineInfo.value.vendor = props.vendor;
  lineInfo.value.product = props.product;
  lineInfo.value.description = props.description;
  lineInfo.value.unit_type = props.unit_type;
  lineInfo.value.quotation_quantity = props.quotation_quantity;
  lineInfo.value.quantity = props.quotation_quantity;
  lineInfo.value.unit_value = props.unit_value;
  lineInfo.value.margin = props.margin;
  lineInfo.value.sales_price = props.sales_price;
  lineInfo.value.quotation_total_value = totalValue.value;
  lineInfo.value.total_value = totalValue.value;
});

const updateVendor = (vendorName) => {
  lineInfo.value.vendor = vendorName?.id;
}

const updateProduct = async(productName) => {
  lineInfo.value.product = productName?.id;
  lineInfo.value.description = null;
  await productStore.retrieveProduct(productName?.id || 0);
};

const updateDescription = async(descriptionName) => {
  lineInfo.value.description = descriptionName?.id;
};

const descriptions = computed({
  get: () => {
    return productStore.getCurrentProduct?.descriptions || [];
  },
});

const showVendorDialog = ref(false);
const vendorToEdit = ref(0);
const showAddVendor = async(vendorId) => {
  vendorToEdit.value = vendorId;
  await vendorStore.retrieveVendor(vendorId);
  showVendorDialog.value = true;
};

const showProductDialog = ref(false);
const productToEdit = ref(0);
const showAddProduct = async(productId) => {
  productToEdit.value = productId;
  await productStore.retrieveProduct(productId);
  await productId.listProducts();
  showProductDialog.value = true;
};

const showDescriptionDialog = ref(false);
const descriptionToEdit = ref(0);
const showAddDescription = async(descriptionId) => {
  descriptionToEdit.value = descriptionId;
  showDescriptionDialog.value = true;
};

const handleCloseVendorDialog = async(isSaved) => {
  showVendorDialog.value = false;
  if (isSaved) {
    await vendorStore.listShortVendors();
    lineInfo.value.vendor = null;
  };
};

const handleCloseProductDialog = async(isSaved) => {
  showProductDialog.value = false;
  if (isSaved) {
    await productStore.listProducts();
    lineInfo.value.product = null;
  };
};

const optionsKey = ref(0);
const handleCloseDescriptionDialog = async(saveInfo) => {
  showDescriptionDialog.value = false;
  if (saveInfo.isSaved) {
    await productStore.retrieveProduct(lineInfo.value.product);
    lineInfo.value.description = saveInfo.savedId;
    optionsKey.value++;
  };
};

const confirmDeleteVendor = (vendorId) => {
  $q.dialog({
    title: t('onfirm'),
    message: t('confirmDeleteVendor'),
    cancel: true,
    persistent: false,
  }).onOk(async() => {
    try {
      loading.value = true;
      await vendorStore.deleteVendor(vendorId);
      await vendorStore.listShortVendors();
      lineInfo.value.vendor = null;
      loading.value = false;
      $q.notify({
        type: 'positive',
        position: 'top-right',
        message: t('deleteSucceeded'),
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
    } catch (error) {
      if (error.status === 403) return;
      console.error(error);
      $q.notify({
        type: 'positive',
        position: 'top-right',
        message: t('failedToDelete'),
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
    }
  });
};

const confirmDeleteProduct = (productId) => {
  $q.dialog({
    title: t('confirm'),
    message: t('confirmDeleteProduct'),
    cancel: true,
    persistent: false,
  }).onOk(async () => {
    try {
      loading.value = true;
      await productStore.deleteProduct(productId);
      await productStore.listProducts();
      lineInfo.value.product = null;
      loading.value = false;
      $q.notify({
        type: 'positive',
        position: 'top-right',
        message: t('deleteSucceeded'),
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
    } catch (error) {
      console.error(error);
      $q.notify({
        type: 'positive',
        position: 'top-right',
        message: t('failedToDelete'),
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
    }
  });
};

const confirmDeleteDescription = (descriptionId) => {
  $q.dialog({
    title: t('confirm'),
    message: t('confirmDeleteDescription'),
    cancel: true,
    persistent: false,
  }).onOk(async () => {
    try {
      loading.value = true;
      await productStore.deleteDescription(descriptionId);
      await productStore.retrieveProduct(lineInfo.value.product);
      lineInfo.value.description = null;
      loading.value = false;
      $q.notify({
        type: 'positive',
        position: 'top-right',
        message: t('deleteSucceeded'),
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
    } catch (error) {
      console.error(error);
      $q.notify({
        type: 'positive',
        position: 'top-right',
        message: t('failedToDelete'),
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
    }
  });
};

const calculateSales = () => {
  lineInfo.value.sales_price = Math.round(lineInfo.value.unit_value * (1 + (lineInfo.value.margin / 100)));
};

const calculateMargin = () => {
  if (lineInfo.value.unit_value && lineInfo.value.sales_price) {
    lineInfo.value.margin = Math.round((lineInfo.value.sales_price / lineInfo.value.unit_value - 1) * 100);
  }
};
</script>

<style scoped>
  .side-buttons {
    margin-top: 3px;
    margin-left: auto;
    padding-left: 5px;
    display: flex;
  }

  .person-search {
    width: calc(100% - 100px);
  }
  @media (max-width: 440px) {
    .person-search {
      width: 100%;
    }
  }
</style>
