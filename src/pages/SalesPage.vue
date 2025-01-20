<template>
  <q-page class="q-pa-sm bg-white">

    <div class="text-h4" style="text-align: center;">
      <q-avatar size="45px" class="shadow-10">
        <q-icon :name="getIcon(invoice.status)" :color="getColor(invoice.status)" />
      </q-avatar>
      {{ t(invoice.status.toLowerCase()) }}
    </div>
    <q-form @submit.prevent="saveData">
      <q-card-section class="row q-pb-lg flex-container" style="border-bottom: 1px solid lightgrey;">
        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
          :style="{ order: $q.screen.lt.md || locale === 'ar' ? 2 : 1 }">
          <div class="text-subtitle1 text-grey-7" style="margin-top: 38px;" :dir="getDir">
            <div class="row q-mt-sm text-subtitle1 text-grey-7">
              <div class="col-xl-6 col-lg-6 col-md-5 col-sm-4 col-xs-12 q-pr-xl q-pl-md q-pt-xs" :class="locale === 'en' ? 'text-right' : 'text-left'">{{ t('status') }}:</div>
              <div class="col-xl-6 col-lg-6 col-md-7 col-sm-8 col-xs-12">
                <q-select
                  v-model="invoice.status"
                  :options="statusOptions"
                  option-label="name"
                  option-value="id"
                  emit-value
                  map-options
                  lazy-rules
                  dense
                  outlined
                  filled
                  :disable="invoiceId === 'NEW'"
                  :rules="[val => !!val || t('required')]"
                />
              </div>
            </div>
            <div class="row text-subtitle1 text-grey-7" style="margin-top: -10px;">
                <div class="col-xl-6 col-lg-6 col-md-5 col-sm-4 col-xs-12 q-pr-xl q-pl-md q-pt-xs" :class="locale === 'en' ? 'text-right' : 'text-left'">{{ t('date') }}:</div>
                <div class="col-xl-6 col-lg-6 col-md-7 col-sm-8 col-xs-12">
                  <q-input type="date" filled dense v-model="invoice.date_time_issued"
                  :rules="[val => !!val || t('required')]" />
                </div>
              </div>
              <div class="row text-subtitle1 text-grey-7" style="margin-top: -10px;">
                <div class="col-xl-6 col-lg-6 col-md-5 col-sm-4 col-xs-12 q-pr-xl q-pl-md q-pt-xs" :class="locale === 'en' ? 'text-right' : 'text-left'">{{ t('profit') }}:</div>
                <div class="col-xl-6 col-lg-6 col-md-7 col-sm-8 col-xs-12">
                  <q-input type="number" filled dense v-model="invoice.profit" suffix="%"
                  :rules="[val => !!val || t('required')]" />
                </div>
              </div>
          </div>
        </div>
        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12 q-mt-lg q-pt-xs"
          :dir="getDir"
          :style="{ order: $q.screen.lt.md || locale === 'ar' ? 1 : 2 }">
          <div class="row text-subtitle1 text-grey-7">
            <div class="col-xl-6 col-lg-6 col-md-5 col-sm-4 col-xs-12 q-pr-xl q-pl-md q-pt-xs" :class="locale === 'en' ? 'text-right' : 'text-left'">{{ t('code') }}:</div>
            <div class="col-xl-6 col-lg-6 col-md-7 col-sm-8 col-xs-12">
              <q-input filled dense v-model="invoiceId" prefix="#" disable input-style="color: red; font-weight: bold" />
            </div>
          </div>

          <div class="row q-mt-sm text-subtitle1 text-grey-7">
            <div class="col-xl-6 col-lg-6 col-md-5 col-sm-4 col-xs-12 q-pr-xl q-pl-md q-pt-xs" :class="locale === 'en' ? 'text-right' : 'text-left'">
              {{ t('customer') }}:
            </div>
            <div class="col-xl-6 col-lg-6 col-md-7 col-sm-8 col-xs-12">
              <person-search
                :listOptions="customers"
                :default-selection="invoice.customer"
                :isOutlined="true"
                filled
                :is-required="true"
                :is-clearable="false"
                @value-update="updateCustomer" />

              <span style="display: inline-flex; margin-top: 3px;" :style="{ float: locale === 'ar' ? 'left' : 'right' }">
                <div class="row">
                  <q-btn icon="add" color="green" size="sm" type="button" outline round
                    style="margin: auto;" @click="showAddCustomer(0)">
                    <q-tooltip class="bg-accent">{{ t('addCustomer') }}</q-tooltip>
                  </q-btn>
                  <q-btn icon="edit" color="orange" size="sm" :disable="!invoice.customer"
                    type="button" outline round style="margin: auto;"
                    @click="showAddCustomer(invoice.customer)">
                    <q-tooltip class="bg-accent">{{ t('editCustomer') }}</q-tooltip>
                  </q-btn>
                  <q-btn icon="delete" color="red" size="sm"
                    :disable="!invoice.customer"
                    @click="confirmDeleteCustomer(invoice.customer)"
                    type="button" outline round style="margin: auto;">
                    <q-tooltip class="bg-accent">{{ t('deleteCustomer') }}</q-tooltip>
                  </q-btn>
                </div>
              </span>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="row q-pb-lg" style="border-bottom: 1px solid lightgrey;">
        <q-table square class="no-shadow full-width"
          :title="t('details')"
          :rows="invoice.lines"
          :columns="columns"
          row-key="name"
          :filter="filter"
          :dir="getDir">
          <template v-slot:top-right>
            <q-input filled borderless dense debounce="300" v-model="filter" :placeholder="t('search')">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>

            <q-btn class="q-ml-sm bg-blue-2" icon="add" outline color="primary" flat
              v-if="invoice.status === 'Quotation'"
              @click="showAddInvoiceLineDialog(null)" />
          </template>
          <template v-slot:body-cell-quotation_quantity="props">
            <q-td :props="props">
              <q-input type="number"
                input-style="text-align: right;"
                @change="updateQuotationTotal(props.row)"
                v-model="props.row.quotation_quantity"
                dense autofocus borderless />
            </q-td>
          </template>
          <template v-slot:body-cell-quantity="props">
            <q-td :props="props">
              <q-input type="number"
                input-style="text-align: right;"
                @change="updateTotal(props.row)"
                v-model="props.row.quantity"
                dense autofocus borderless />
            </q-td>
          </template>
          <template v-slot:body-cell-unit_value="props">
            <q-td :props="props">
              <q-input type="number"
                input-style="text-align: right;"
                v-model="props.row.unit_value"
                dense autofocus borderless />
            </q-td>
          </template>
          <template v-slot:body-cell-sales_price="props">
            <q-td :props="props">
              <q-input type="number"
                input-style="text-align: right;"
                @change="updateTotal(props.row)"
                v-model="props.row.sales_price"
                dense autofocus borderless />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn outline round icon="edit" size="sm" text-color="blue" @click="showAddInvoiceLineDialog(props.row)" />
              <q-btn outline round icon="delete" size="sm" text-color="orange-9" @click="deleteRow(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-section class="row q-pb-lg" style="border-bottom: 1px solid lightgrey;" :dir="getDir">
        <div class=" q-mt-sm text-subtitle1 text-grey-7 col-12">
          <div class="q-table__title q-mr-md text-black">{{ t('termsAndConditions') }}
            <q-btn color="primary" round flat outlined icon="star">
              <q-menu>
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup v-for="condition in conditions" :key="condition.id">
                    <q-item-section @click="addCondition(condition)">{{ condition.name}}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>

          <div class="col-6">
              <q-editor v-model="invoice.conditions" :toolbar="[]" @input="ensureBulleted" />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="row q-pb-lg" style="border-bottom: 1px solid lightgrey;"
        :dir="getDir" v-if="invoice.status !== 'Quotation'">
        <div class=" q-mt-sm text-subtitle1 text-grey-7 col-12">
          <div class="q-table__title q-mr-md text-black">{{ t('supplyOrder') }}</div>
          <div class="col-12 q-pt-md" style="border-top: 1px solid lightgrey; text-align: center;" dir="ltr">


            <q-btn :label="t('upload')" type="button" class="text-capitalize" rounded color="blue"
              icon="cloud"
              outline
              @click="browsePdf"
              style="max-width: 150px; margin: 3px;" />
              <q-btn :label="t('open')" type="button" class="text-capitalize" rounded color="green"
                outline
                icon="visibility"
                :disable="!invoice.supply_order"
                :href="invoice.supply_order" target="_blank"
                style="max-width: 150px; margin: 3px;" />
            <input type="file" ref="fileInput" @change="onFileChange" accept="application/pdf" style="display: none;" >
          </div>
        </div>
      </q-card-section>

      <q-card-section class="row q-pb-lg" style="border-bottom: 1px solid lightgrey;">

        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12"
          :style="locale === 'en' ? 'margin-left: auto' : 'margin-right: auto'" :dir="getDir">
          <div class="text-subtitle1 text-grey-7">
            <div class="row q-mt-sm text-subtitle1 text-grey-7">
              <div class="col-6 text-right q-pr-xl q-pt-xs">{{ t('netTotal') }}:</div>
              <div class="col-6">
                <q-input v-if="invoice.status === 'Quotation' || invoice.status === 'Canceled'" filled dense v-model="quotationNetTotal" readonly :rules="[val => !!val || t('required')]" />
                <q-input v-else filled dense v-model="netTotal" readonly :rules="[val => !!val || t('required')]" />
              </div>
            </div>
            <div class="row q-mt-sm text-subtitle1 text-grey-7">
              <div class="col-6 text-right q-pr-xl q-pt-xs">{{ t('tax') }}:</div>
              <div class="col-6">
                <q-select
                  v-model="invoice.tax"
                  :options="taxOptions"
                  option-label="name"
                  option-value="id"
                  emit-value
                  map-options
                  lazy-rules
                  dense
                  outlined
                  filled
                  :rules="[val => !!val || t('required')]"
                />
              </div>
            </div>
            <div class="row q-mt-sm text-subtitle1 text-grey-7">
              <div class="col-6 text-right q-pr-xl q-pt-xs">{{ t('taxValue') }}:</div>
              <div class="col-6">
                <q-input type="number" filled dense v-model="invoice.tax_amount" suffix="%"
                :rules="[val => !!val || t('required')]" />
              </div>
            </div>
            <div class="row q-mt-sm text-subtitle1 text-grey-7">
              <div class="col-6 text-right q-pr-xl q-pt-xs">{{ t('totalValue') }}:</div>
              <div class="col-6">
                <q-input v-if="invoice.status === 'Quotation' || invoice.status === 'Canceled'" type="number" filled dense v-model="quotationTotalValue" readonly />
                <q-input v-else type="number" filled dense v-model="totalValue" readonly />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="left">
        <q-btn class="text-capitalize text-white"
          type="button"
          color="red"
          icon="close"
          style="min-width: 130px;"
          :label="t('close')" @click="handleClose(false);">
        </q-btn>
        <q-btn class="text-capitalize text-white"
          type="submit"
          color="green"
          :loading="loading"
          style="min-width: 130px;"
          icon="save"
          :label="t('save')">
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>

    </q-form>

    <q-dialog v-model="showCustomerDialog">
      <customer-dialog :customerId="customerToEdit" @closeMeEvent="handleCloseDialog"></customer-dialog>
    </q-dialog>
    <q-dialog v-model="showInvoiceLineDialog">
      <invoice-line
        :index="invoiceLineToEdit.index"
        :vendor="invoiceLineToEdit.vendor"
        :description="invoiceLineToEdit.description"
        :unit_type="invoiceLineToEdit.unit_type"
        :quotation_quantity="invoiceLineToEdit.quotation_quantity"
        :unit_value="invoiceLineToEdit.unit_value"
        :sales_price="invoiceLineToEdit.sales_price"
        :margin="invoiceLineToEdit.margin"
        :product="invoiceLineToEdit.product"
        @close-me-event="closeInvoiceLine"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useCustomerStore } from 'src/stores/customer-store';
import { useVendorStore } from 'src/stores/vendor-store';
import { useOrderStore } from 'src/stores/order-store';
import { useProductStore } from 'src/stores/product-store';
import { useUnitStore } from 'src/stores/unit-store';
import { useReportStore } from 'src/stores/report-store';
import { getToday } from 'src/utils/dateUtils';
import { getReport } from 'src/utils/reportUtils';

const { t, locale } = useI18n();
const $q = useQuasar();
const loading = ref(false);
const router = useRouter();
const route = useRoute();

const customerStore = useCustomerStore();
const vendorStore = useVendorStore();
const orderStore = useOrderStore();
const productStore = useProductStore();
const unitStore = useUnitStore();
const reportStore = useReportStore();

const PersonSearch = defineAsyncComponent(() => import('components/PersonSearch.vue'));
const CustomerDialog = defineAsyncComponent(() => import('components/CustomerDialog.vue'));
const InvoiceLine = defineAsyncComponent(() => import('components/InvoiceLine.vue'));

const invoiceId = computed({
  get: () => {
    return route.params.invoiceNumber.toUpperCase();
  },
  set: (newValue) => {
    router.push(`/sales/${newValue}`);
  }
});

const customers = computed({
  get: () => {
    return customerStore.getCustomersShort;
  },
});

const vendors = computed({
  get: () => {
    return vendorStore.getVendorsShort;
  },
});

const showConditionsMenu = ref(false);

const handleClose = () => {
  $q.dialog({
    title: t('confirm'),
    message: t('confirmClose'),
    cancel: true,
    persistent: false,
  }).onOk(() => {
    router.push('/sales');
  });
};

const invoice = ref({
  id: null,
  status: 'Quotation',
  customer: null,
  date_time_issued: getToday().replaceAll('/', '-'),
  supply_order: null,
  conditions: '<ul></ul>',
  tax: null,
  tax_amount: null,
  profit: null,
  lines: [],
  quotation_net_amount: null,
  quotation_total_amount: null,
  net_amount: null,
  total_amount: null,
});

const conditions = computed({
  get: () => {
    return orderStore.getConditions;
  },
});

onMounted(async() => {
  console.log(invoiceId.value);
  orderStore.listConditions();
  if (invoiceId.value !== 'NEW') {
    await orderStore.retrieveOrder(invoiceId.value);
    await customerStore.listShortCustomers();
    const currentInvoice = orderStore.getCurrentOrder;
    invoice.value.id = currentInvoice.id;
    invoice.value.status = currentInvoice.status;
    invoice.value.customer = currentInvoice.customer;
    invoice.value.date_time_issued = currentInvoice.date_time_issued.split('T')[0].replaceAll('/', '-');
    invoice.value.supply_order = currentInvoice.supply_order;
    invoice.value.conditions = currentInvoice.conditions;
    invoice.value.tax = currentInvoice.tax;
    invoice.value.tax_amount = parseFloat(currentInvoice.tax_amount);
    invoice.value.profit = parseFloat(currentInvoice.profit);
    invoice.value.quotation_net_amount = parseFloat(currentInvoice.quotation_net_amount);
    invoice.value.quotation_total_amount = parseFloat(currentInvoice.quotation_total_amount);
    invoice.value.net_amount = parseFloat(currentInvoice.net_amount);
    invoice.value.total_amount = parseFloat(currentInvoice.total_amount);
    await productStore.listProducts();
    await vendorStore.listShortVendors();
    await unitStore.listUnits();
    const productList = productStore.getProducts;
    const unitList = unitStore.getUnits;
    invoice.value.lines = currentInvoice.lines.map((l, index) => ({
      index,
      id: l.id,
      vendor: (() => {
        const vendor = vendors.value.find((v) => v.id === l.vendor);
        return vendor ? { id: vendor.id, name: vendor.name } : null;
      })(),
      product: (() => {
        const product = productList.find((p) => p.id === l.product);
        return product ? { id: product.id, name: product.name } : null;
      })(),
      description: { id: l.description, name: l.description_name },
      quantity: parseFloat(l.quantity),
      quotation_quantity: parseFloat(l.quotation_quantity),
      unit_type: unitList.find((u) => u.id === l.unit_type),
      unit_value: parseFloat(l.unit_value),
      margin: parseFloat(l.margin),
      sales_price: parseFloat(l.sales_price),
      total_value: parseFloat(l.total_value),
      quotation_total_value: parseFloat(l.quotation_total_value),
    }));
  }

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

const updateCustomer = (customerName) => {
  invoice.value.customer = customerName?.id;
}

const columns = computed(() => [
  {
    name: 'product',
    label: t('product'),
    align: locale.value === 'en' ? 'left' : 'right',
    field: row => row.product.name,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'description',
    label: t('description'),
    align: locale.value === 'en' ? 'left' : 'right',
    field: row => row.description.name,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: invoice.value.status === 'Quotation' || invoice.value.status === 'Canceled' ? 'quotation_quantity' : 'quantity',
    label: t('quantity'),
    align: 'right',
    field: row => invoice.value.status === 'Quotation' || invoice.value.status === 'Canceled' ? row.quotation_quantity : row.quantity,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'unit',
    label: t('unit'),
    align: locale.value === 'en' ? 'left' : 'right',
    field: row => row.unit_type.description,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'vendor',
    label: t('vendor'),
    align: locale.value === 'en' ? 'left' : 'right',
    field: row => row.vendor.name,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'unit_value',
    label: t('costPrice'),
    align: 'right',
    field: row => row.unit_value,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'sales_price',
    label: t('salesPrice'),
    align: 'right',
    field: row => row.sales_price,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: invoice.value.status === 'Quotation' || invoice.value.status === 'Canceled' ? 'quotation_total_value' : 'total_value',
    label: t('total'),
    align: 'right',
    field: row => invoice.value.status === 'Quotation' || invoice.value.status === 'Canceled' ? row.quotation_total_value : row.total_value,
    format: val => `${val}`,
    sortable: true
  },
  ...(invoice.value.status !== 'Quotation' ? [] : [
    {
      name: 'actions',
      label: ' ',
      align: 'center',
      field: 'actions',
      sortable: false
    }
  ]),
]);

const filter = ref('');

const deleteRow = (row) => {

  $q.dialog({
    title: t('confirm'),
    message: t('confirmDeleteRow'),
    cancel: true,
    persistent: false,
  }).onOk(() => {
    invoice.value.lines = invoice.value.lines.filter(item => item !== row);
  });
};

const showCustomerDialog = ref(false);
const customerToEdit = ref(0);
const showAddCustomer = async (customerId) => {
  customerToEdit.value = customerId;
  await customerStore.retrieveCustomer(customerId);
  showCustomerDialog.value = true;
};

const confirmDeleteCustomer = (customerId) => {
  $q.dialog({
    title: t('confirm'),
    message: t('confirmDeleteCustomer'),
    cancel: true,
    persistent: false,
  }).onOk(async () => {
    try {
      loading.value = true;
      await customerStore.deleteCustomer(customerId);
      await customerStore.listShortCustomers();
      invoice.value.customer = null;
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

const handleCloseDialog = async (isSaved) => {
  showCustomerDialog.value = false;
  if (isSaved) {
    await customerStore.listShortCustomers();
    invoice.value.customer = null;
  };
};

const updateTotal = (rowInfo) => {
  rowInfo.total_value = (rowInfo.quantity * rowInfo.sales_price).toFixed(0);
};

const updateQuotationTotal = (rowInfo) => {
  rowInfo.quotation_total_value = (rowInfo.quotation_quantity * rowInfo.sales_price).toFixed(0);
};

const invoiceLineToEdit = ref(null);
const showAddInvoiceLineDialog = async(selectedLine) => {
  if (selectedLine === null) {
    invoiceLineToEdit.value = {
      index: -1,
      vendor: null,
      product: null,
      description: null,
      unit_type: null,
      quotation_quantity: null,
      quantity: null,
      unit_value: null,
      margin: parseFloat(invoice.value.profit),
      sales_price: null,
      quotation_total_value: null,
      total_value: null,
    };
  } else {
    await productStore.retrieveProduct(selectedLine.product.id);
    invoiceLineToEdit.value = {
      index: selectedLine.index,
      vendor: selectedLine.vendor.id,
      product: selectedLine.product.id,
      description: selectedLine.description.id,
      unit_type: selectedLine.unit_type.id,
      quantity: parseFloat(selectedLine.quotation_quantity),
      quotation_quantity: parseFloat(selectedLine.quotation_quantity),
      unit_value: parseFloat(selectedLine.unit_value),
      margin: parseFloat(selectedLine.margin),
      sales_price: parseFloat(selectedLine.sales_price),
      total_value: parseFloat(selectedLine.quotation_total_value),
      quotation_total_value: parseFloat(selectedLine.quotation_total_value),
    };
  }
  console.log('invoiceLineToEdit', invoiceLineToEdit.value);
  showInvoiceLineDialog.value = true;
};

const showInvoiceLineDialog = ref(false);
const closeInvoiceLine = (lineInfo) => {
  if (lineInfo.isSaved) {
    const newLine = lineInfo.output;
    if (newLine.index === -1) {
      newLine.index = invoice.value.lines.length;
      invoice.value.lines.push(newLine);
      console.log('newLine', newLine);
    } else {
      invoice.value.lines[newLine.index] = newLine;
      console.log('lineInfo', newLine.index, newLine, invoice.value.lines);
    }

  }
  showInvoiceLineDialog.value = false;
};

const statusOptions = computed(() => [
  { id: 'Quotation', name: t('quotation') },
  { id: 'Canceled', name: t('canceled') },
  { id: 'Invoice', name: t('invoice') },
  { id: 'Closed', name: t('closed') },
]);


const ensureBulleted = () => {
  if (!invoice.value.conditions?.startsWith('<ul>')) {
    invoice.value.conditions = `<ul><li>${invoice.value.conditions.replace(/\n/g, '</li><li>')}</li></ul>`;
  }
};

const taxOptions = computed(() => [
  { id: 'T1', name: t('taxAddedValue') },
  { id: 'T2', name: t('tableTax')},
]);

const netTotal = computed(() => {
  return invoice.value.lines.reduce((acc, line) => acc + parseFloat(line.total_value || 0), 0);
});

const totalValue = computed(() => {
  return (netTotal.value * (1 + (invoice.value.tax_amount / 100))).toFixed(0);
});

const quotationNetTotal = computed(() => {
  return invoice.value.lines.reduce((acc, line) => acc + parseFloat(line.quotation_total_value || 0), 0);
});

const quotationTotalValue = computed(() => {
  return (quotationNetTotal.value * (1 + (invoice.value.tax_amount / 100))).toFixed(0);
});

const saveData = async() => {
  if (invoice.value.lines.length === 0) {
    $q.notify({
      type: 'negative',
      position: 'top-right',
      message: t('atLeastOneLineRequired'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    return;
  }

  // Proceed with saving data
  loading.value = true;
  // Your save logic here
  ensureBulleted();
  const dataToSave = {
    id: invoiceId.value,
    status: invoice.value.status,
    customer: invoice.value.customer,
    date_time_issued: invoice.value.date_time_issued,
    conditions: invoice.value.conditions,
    net_amount: netTotal.value,
    quotation_net_amount: quotationNetTotal.value,
    tax: invoice.value.tax,
    tax_amount: invoice.value.tax_amount,
    quotation_total_amount: quotationTotalValue.value,
    total_amount: totalValue.value,
    profit: invoice.value.profit,
    lines: invoice.value.lines.map((l) => ({
      vendor: l.vendor?.id || null,
      product: l.product?.id || null,
      description: l.description?.id || null,
      unit_type: l.unit_type?.id || null,
      quantity: l.quantity || 0,
      quotation_quantity: l.quotation_quantity || 0,
      unit_value: l.unit_value || 0,
      margin: l.margin || 0,
      sales_price: l.sales_price || 0,
      quotation_total_value: l.quotation_total_value || 0,
      total_value: l.total_value || 0,
    })),
  };

  if (invoiceId.value === 'NEW') {
    const response = await orderStore.postOrder(dataToSave);
    invoiceId.value = response.quotation.id;
  } else {
    await orderStore.editOrder(dataToSave);
  }
  console.log(invoiceId.value);
  loading.value = false;
  $q.notify({
    type: 'positive',
    position: 'top-right',
    message: t('orderSaved'),
    progress: true,
    actions: [
      { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
    ],
  });
};

const getDir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr');

const uploadSupplyOrder = () => {
  console.log('uploading');
};

const fileInput = ref(null);

const browsePdf = () => {
  fileInput.value.click();
};

const onFileChange = async(event) => {
  const file = event.target.files[0];
  if (file) {

    const formData = new FormData();
    formData.append('id', invoiceId.value);
    formData.append('supply_order', file);
    const response = await orderStore.uploadSupplyOrder(formData);
    invoice.value.supply_order = `${process.env.API_BASE_URL}/media/${response.file}`;
  }
};

const printReport = async() => {

  const params = {
    vendor: 1,
    quotation_id: '00006',
  };
  loading.value = true;
  const response = await reportStore.retrieveSupplyOrder(params);
  loading.value = false;
  getReport(false, response);
};

const addCondition = (condition) => {
  invoice.value.conditions = condition.conditions;
  ensureBulleted();
}
</script>
