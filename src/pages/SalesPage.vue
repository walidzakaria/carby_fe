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
              <div class="col-xl-6 col-lg-6 col-md-5 col-sm-4 col-xs-12 q-pr-xl q-pl-md q-pt-xs"
                :class="locale === 'en' ? 'text-right' : 'text-left'">{{ t('status') }}:</div>
              <div class="col-xl-6 col-lg-6 col-md-7 col-sm-8 col-xs-12">
                <q-select v-model="invoice.status" :options="statusOptions" option-label="name" option-value="id"
                  emit-value map-options lazy-rules dense outlined filled :disable="invoiceId === 'NEW'"
                  :rules="[val => !!val || t('required')]" />
              </div>
            </div>
            <div class="row text-subtitle1 text-grey-7" style="margin-top: -10px;">
              <div class="col-xl-6 col-lg-6 col-md-5 col-sm-4 col-xs-12 q-pr-xl q-pl-md q-pt-xs"
                :class="locale === 'en' ? 'text-right' : 'text-left'">{{ t('date') }}:</div>
              <div class="col-xl-6 col-lg-6 col-md-7 col-sm-8 col-xs-12">
                <q-input type="date" filled dense v-model="invoice.date_time_issued"
                  :rules="[val => !!val || t('required')]" />
              </div>
            </div>
            <div class="row text-subtitle1 text-grey-7" style="margin-top: -10px;">
              <div class="col-xl-6 col-lg-6 col-md-5 col-sm-4 col-xs-12 q-pr-xl q-pl-md q-pt-xs"
                :class="locale === 'en' ? 'text-right' : 'text-left'">{{ t('profit') }}:</div>
              <div class="col-xl-6 col-lg-6 col-md-7 col-sm-8 col-xs-12">
                <q-input type="number" filled dense v-model="invoice.profit_a" suffix="%" label="A" />
                <q-input type="number" filled dense v-model="invoice.profit_b" suffix="%" label="B" />
                <q-input type="number" filled dense v-model="invoice.profit_c" suffix="%" label="C" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12 q-mt-lg q-pt-xs" :dir="getDir"
          :style="{ order: $q.screen.lt.md || locale === 'ar' ? 1 : 2 }">
          <div class="row text-subtitle1 text-grey-7">
            <div class="col-xl-6 col-lg-6 col-md-5 col-sm-4 col-xs-12 q-pr-xl q-pl-md q-pt-xs"
              :class="locale === 'en' ? 'text-right' : 'text-left'">{{ t('code') }}:</div>
            <div class="col-xl-6 col-lg-6 col-md-7 col-sm-8 col-xs-12">
              <q-input filled dense v-model="invoiceId" prefix="#" disable
                input-style="color: red; font-weight: bold" />
            </div>
          </div>

          <div class="row q-mt-sm text-subtitle1 text-grey-7">
            <div class="col-xl-6 col-lg-6 col-md-5 col-sm-4 col-xs-12 q-pr-xl q-pl-md q-pt-xs"
              :class="locale === 'en' ? 'text-right' : 'text-left'">
              {{ t('customer') }}:
            </div>
            <div class="col-xl-6 col-lg-6 col-md-7 col-sm-8 col-xs-12">
              <person-search :listOptions="customers" :default-selection="invoice.customer" :isOutlined="true" filled
                :is-required="true" :is-clearable="false" @value-update="updateCustomer" />

              <span style="display: inline-flex; margin-top: 3px;"
                :style="{ float: locale === 'ar' ? 'left' : 'right' }">
                <div class="row">
                  <q-btn icon="add" color="green" size="sm" type="button" outline round style="margin: auto;"
                    @click="showAddCustomer(0)">
                    <q-tooltip class="bg-accent">{{ t('addCustomer') }}</q-tooltip>
                  </q-btn>
                  <q-btn icon="edit" color="orange" size="sm" :disable="!invoice.customer" type="button" outline round
                    style="margin: auto;" @click="showAddCustomer(invoice.customer)">
                    <q-tooltip class="bg-accent">{{ t('editCustomer') }}</q-tooltip>
                  </q-btn>
                  <q-btn icon="delete" color="red" size="sm" :disable="!invoice.customer"
                    @click="confirmDeleteCustomer(invoice.customer)" type="button" outline round style="margin: auto;">
                    <q-tooltip class="bg-accent">{{ t('deleteCustomer') }}</q-tooltip>
                  </q-btn>
                </div>
              </span>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="row q-pb-lg" style="border-bottom: 1px solid lightgrey;">

        <div class=" q-mt-sm text-subtitle1 text-grey-7 col-12 row" :dir="getDir">
          <div class="q-table__title q-mr-md text-black col-1 col-xl-1 col-lg-1 col-md-1 col-sm-1 col-xs-12">{{
            t('details') }}
          </div>
          <div :style="{ 'margin-left': locale === 'en' ? 'auto' : '', 'margin-right': locale !== 'en' ? 'auto' : '' }"
            class="row">

            <q-input filled borderless dense debounce="300" v-model="filter" :placeholder="t('search')">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn class="q-ml-sm bg-blue-2 q-ml-sm q-mr-sm" icon="add" outline color="primary" flat
              @click="showAddInvoiceLineDialog(null)" />
            <q-select v-if="invoice.status === 'Quotation'" v-model="selectedLabel" :options="labelOptions"
              option-label="name" option-value="id" emit-value map-options lazy-rules dense outlined label="Label"
              style="min-width: 85px;" />
          </div>

          <q-markup-table flat class="full-width">
            <thead>
              <tr>
                <th :class="locale === 'en' ? 'text-left' : 'text-right'">{{ t('product') }}</th>
                <th :class="locale === 'en' ? 'text-left' : 'text-right'">{{ t('description') }}</th>
                <th class="text-right" v-if="invoice.status === 'Quotation'">{{ t('quotationQuantity') }}</th>
                <th class="text-right" v-else>{{ t('quantity') }}</th>
                <th :class="locale === 'en' ? 'text-left' : 'text-right'">{{ t('unit') }}</th>
                <th :class="locale === 'en' ? 'text-left' : 'text-right'">{{ t('vendor') }}</th>
                <th class="text-right" v-if="invoice.status === 'Quotation' && selectedLabel === 'A'">{{ t('costPrice')
                  }} (A)
                </th>
                <th class="text-right" v-if="invoice.status === 'Quotation' && selectedLabel === 'B'">{{ t('costPrice')
                  }} (B)
                </th>
                <th class="text-right" v-if="invoice.status === 'Quotation' && selectedLabel === 'C'">{{ t('costPrice')
                  }} (C)
                </th>
                <th class="text-right" v-if="invoice.status === 'Quotation' && selectedLabel === 'A'">{{ t('salesPrice')
                  }} (A)
                </th>
                <th class="text-right" v-if="invoice.status === 'Quotation' && selectedLabel === 'B'">{{ t('salesPrice')
                  }} (B)
                </th>
                <th class="text-right" v-if="invoice.status === 'Quotation' && selectedLabel === 'C'">{{ t('salesPrice')
                  }} (C)
                </th>
                <th class="text-right>" v-if="invoice.status === 'Quotation' && selectedLabel === 'A'">{{ t('total') }}
                  (A)</th>
                <th class="text-right>" v-if="invoice.status === 'Quotation' && selectedLabel === 'B'">{{ t('total') }}
                  (B)</th>
                <th class="text-right>" v-if="invoice.status === 'Quotation' && selectedLabel === 'C'">{{ t('total') }}
                  (C)</th>
                <th class="text-right>" v-if="invoice.status !== 'Quotation'">Label</th>
                <th class="text-right>" v-if="invoice.status !== 'Quotation'">{{ t('salesPrice') }}</th>
                <th class="text-right>" v-if="invoice.status !== 'Quotation'">{{ t('total') }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>

              <tr v-for="row in tableRows" :key="row.index">
                <td :class="locale === 'en' ? 'text-left' : 'text-right'">{{ row.product.name }}</td>
                <td :class="locale === 'en' ? 'text-left' : 'text-right'">{{ row.description.name }}</td>
                <td class="text-right" v-if="invoice.status === 'Quotation'">
                  <q-input type="number" input-style="text-align: right;" v-model="row.quotation_quantity" dense
                    autofocus borderless />
                </td>
                <td class="text-right" v-else>
                  <q-input type="number" input-style="text-align: right;" v-model="row.quantity" dense autofocus
                    borderless />
                </td>
                <td class="text-right">{{ row.unit_type.description }}</td>
                <td class="text-right">{{ row.source === 'Vendor' ? row.vendor.name : t('stock') }}</td>
                <td class="text-right" v-if="invoice.status === 'Quotation' && selectedLabel === 'A'">
                  <q-input type="number" input-style="text-align: right;" v-model="row.unit_value_a" dense autofocus
                    borderless />
                </td>
                <td class="text-right" v-if="invoice.status === 'Quotation' && selectedLabel === 'B'">
                  <q-input type="number" input-style="text-align: right;" v-model="row.unit_value_b" dense autofocus
                    borderless />
                </td>
                <td class="text-right" v-if="invoice.status === 'Quotation' && selectedLabel === 'C'">
                  <q-input type="number" input-style="text-align: right;" v-model="row.unit_value_c" dense autofocus
                    borderless />
                </td>
                <td class="text-right" v-if="invoice.status === 'Quotation' && selectedLabel === 'A'">
                  <q-input type="number" input-style="text-align: right;" v-model="row.sales_price_a" dense autofocus
                    borderless />
                </td>
                <td class="text-right" v-if="invoice.status === 'Quotation' && selectedLabel === 'B'">
                  <q-input type="number" input-style="text-align: right;" v-model="row.sales_price_b" dense autofocus
                    borderless />
                </td>
                <td class="text-right" v-if="invoice.status === 'Quotation' && selectedLabel === 'C'">
                  <q-input type="number" input-style="text-align: right;" v-model="row.sales_price_c" dense autofocus
                    borderless />
                </td>
                <td class="text-right" v-if="invoice.status === 'Quotation' && selectedLabel === 'A'">{{
                  row.quotation_quantity *
                  row.sales_price_a }}</td>
                <td class="text-right" v-if="invoice.status === 'Quotation' && selectedLabel === 'B'">{{
                  row.quotation_quantity *
                  row.sales_price_b }}</td>
                <td class="text-right" v-if="invoice.status === 'Quotation' && selectedLabel === 'C'">{{
                  row.quotation_quantity *
                  row.sales_price_c }}</td>
                <td class="text-right" v-if="invoice.status !== 'Quotation'">
                  <q-select v-model="row.label" :options="labelOptions" option-label="name" option-value="id" emit-value
                    map-options lazy-rules dense outlined />
                </td>
                <td class="text-right" v-if="invoice.status !== 'Quotation'">
                  {{ row[`sales_price_${row.label.toLowerCase()}`] }}
                </td>
                <td class="text-right" v-if="invoice.status !== 'Quotation'">{{ row.quantity *
                  row[`sales_price_${row.label.toLowerCase()}`] }}</td>
                <td>
                  <q-btn-group rounded dir="ltr">
                    <q-btn outline rounded glossy icon="delete" size="md" text-color="orange-9"
                      @click="deleteAttachment(attachmentInfo.id)" />
                    <q-btn outline rounded glossy icon="edit" size="md" text-color="blue"
                      @click="showAttachmentDialog(attachmentInfo)" />
                  </q-btn-group>
                </td>
              </tr>
            </tbody>
          </q-markup-table>

        </div>

      </q-card-section>
      <q-card-section class="row q-pb-lg" style="border-bottom: 1px solid lightgrey;" :dir="getDir">
        <div class=" q-mt-sm text-subtitle1 text-grey-7 col-12">
          <div class="q-table__title q-mr-md text-black">{{ t('termsAndConditions') }}
            <q-btn color="primary" round flat outlined icon="star">
              <q-menu anchor="top right" self="bottom right">
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup v-for="condition in conditions" :key="condition.id">
                    <q-item-section @click="addCondition(condition)">{{ condition.name }}</q-item-section>
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

      <q-card-section class="row q-pb-lg" style="border-bottom: 1px solid lightgrey;" :dir="getDir"
        v-if="invoice.status !== 'Quotation'">
        <div class=" q-mt-sm text-subtitle1 text-grey-7 col-12">
          <div class="q-table__title q-mr-md text-black">{{ t('supplyOrder') }}</div>
          <div class="col-12 q-pt-md" style="border-top: 1px solid lightgrey; text-align: center;" dir="ltr">

            <q-input filled dense v-model="invoice.po_number" :rules="[val => !!val || t('required')]"
              :label="t('poNumber')" style="max-width: 200px; margin: 10px auto 0 auto;" outlined />
            <q-select v-model="invoice.bank_account" :options="bankAccounts" option-label="account_name"
              :rules="[val => !!val || t('required')]" option-value="id"
              style="max-width: 200px; margin: 10px auto 0 auto;" emit-value :label="t('bankAccount')" map-options
              lazy-rules filled dense />
          </div>
        </div>
      </q-card-section>


      <q-card class="q-mt-sm no-shadow" bordered :dir="getDir" v-if="invoiceId !== 'NEW'">
        <q-card-section class="row q-pa-sm">
          <q-item class="full-width">
            <q-item-section>
              <div class="q-table__title q-mr-md text-black">{{ t('attachments') }}</div>
              <div class="q-gutter-sm">
                <q-radio v-model="attachmentCategory" val="all" :label="t('all')" />
                <q-radio v-model="attachmentCategory" val="CONDITIONS" :label="t('conditions')" />
                <q-radio v-model="attachmentCategory" val="SUPPLY_ORDER" :label="t('supplyOrder')" />
                <q-radio v-model="attachmentCategory" val="PAYMENT_ORDER" :label="t('paymentOrder')" />
                <q-radio v-model="attachmentCategory" val="OTHER" :label="t('other')" />
              </div>
            </q-item-section>
            <q-item-section side>
              <q-btn class="text-capitalize" outline :label="t('addAttachment')" color="indigo-7"
                @click="showAttachmentDialog(null)"></q-btn>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-separator></q-separator>
        <q-list>
          <div v-for="attachmentInfo in attachmentList" :key="attachmentInfo.id">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="attachment" round />
                </q-avatar>
              </q-item-section>

              <q-item-section>

                <q-item-label lines="1">{{ attachmentInfo.file_type === 'OTHER' ? attachmentInfo.file_name :
                  getFileName(attachmentInfo.file_type) }} ({{ attachmentInfo.file_number
                  }})</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">{{ parseDate(attachmentInfo.creation_date) }}</span>
                  <br>
                  <a :href="attachmentInfo.file" target="_blank">{{ attachmentInfo.file }}</a>
                </q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-btn-group rounded dir="ltr">
                  <q-btn rounded glossy outline icon="delete" color="red"
                    @click="deleteAttachment(attachmentInfo.id)" />
                  <q-btn rounded glossy outline icon="edit" color="blue"
                    @click="showAttachmentDialog(attachmentInfo)" />
                </q-btn-group>
              </q-item-section>
            </q-item>

            <q-separator inset="item" />

          </div>
        </q-list>
      </q-card>

      <q-card-section class="row q-pb-lg" style="border-bottom: 1px solid lightgrey;">

        <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12"
          :style="locale === 'en' ? 'margin-left: auto' : 'margin-right: auto'" :dir="getDir">
          <div class="text-subtitle1 text-grey-7">
            <div class="row q-mt-sm text-subtitle1 text-grey-7">
              <div class="col-6 text-right q-pr-xl q-pt-xs">{{ `${t('totalCost')} ${invoice.status === 'Quotation' ?
                `(${selectedLabel})` : ''}` }}:</div>
              <div class="col-6">
                <q-input filled dense
                  v-model="invoiceSummary.cost[invoice.status !== 'Quotation' ? 'invoice' : selectedLabel.toLowerCase()]"
                  readonly />
              </div>
            </div>
            <div class="row q-mt-sm text-subtitle1 text-grey-7">
              <div class="col-6 text-right q-pr-xl q-pt-xs">{{ `${t('totalSales')} ${invoice.status === 'Quotation' ?
                `(${selectedLabel})` : ''}` }}:</div>
              <div class="col-6">
                <q-input filled dense
                  v-model="invoiceSummary.netSales[invoice.status !== 'Quotation' ? 'invoice' : selectedLabel.toLowerCase()]"
                  readonly />
              </div>
            </div>
            <div class="row q-mt-sm text-subtitle1 text-grey-7">
              <div class="col-6 text-right q-pr-xl q-pt-xs">{{ t('tax') }}:</div>
              <div class="col-6">
                <q-select v-model="invoice.tax" :options="taxOptions" option-label="name" option-value="id" emit-value
                  map-options lazy-rules dense outlined filled :rules="[val => !!val || t('required')]" />
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
                <q-input type="number" filled dense v-model="totalWithTax" readonly />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions class="row q-pb-lg" style="border-bottom: 1px solid lightgrey;" v-if="invoiceId !== 'NEW'">
        <div class="q-pa-md" style="margin: auto;">
          <q-btn color="orange" :label="t('supplyOrder')" rounded outline icon="send"
            v-if="invoice.status !== 'Quotation'">
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <div class="text-h6 q-mb-md">{{ t('supplyOrder') }}</div>
                  <div style="margin-bottom: 10px;">
                    <person-search class="col-12" :label="t('vendor')" :listOptions="uniqueVendors" :isOutlined="true"
                      :is-clearable="false" :default-selection="vendorToPrint" @value-update="updateVendor" />
                  </div>
                  <q-toggle v-model="showTemplate" :label="t('showTemplate')" style="margin-bottom: 10px;" />
                  <div class="row">
                    <q-btn color="primary" :label="t('print')" push size="md" outline rounded icon="print" v-close-popup
                      @click="printSupplyOrder(false)" />
                    <q-btn color="primary" :label="t('view')" push size="md" outline rounded icon="preview"
                      v-close-popup @click="printSupplyOrder(true)" />
                  </div>
                </div>
              </div>
            </q-menu>
          </q-btn>
          <q-btn color="green" :label="t('print')" @click="printQuotation(false)" rounded outline icon="print"
            v-if="invoice.status === 'Quotation'" class="q-mr-sm q-ml-sm"></q-btn>
          <q-btn color="blue" :label="t('view')" @click="printQuotation(true)" rounded outline icon="summarize"
            v-if="invoice.status === 'Quotation'" class="q-mr-sm q-ml-sm"></q-btn>

        </div>

      </q-card-actions>

      <q-card-actions align="left">
        <q-btn class="text-capitalize text-white" type="button" color="red" icon="close" style="min-width: 130px;"
          :label="t('close')" @click="handleClose(false);">
        </q-btn>
        <q-btn class="text-capitalize text-white" type="submit" color="green" :loading="loading"
          style="min-width: 130px;" icon="save" :label="t('save')">
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
      <invoice-line :data="invoiceLineToEdit" @close-me-event="closeInvoiceLine" />
    </q-dialog>
    <q-dialog v-model="attachmentShow">
      <attachment-dialog :attachment="attachmentToEdit" @close-me-event="closeAttachmentDialog" />
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
const AttachmentDialog = defineAsyncComponent(() => import('components/AttachmentDialog.vue'));

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
  po_number: null,
  bank_account: null,
  conditions: '<ul></ul>',
  tax: null,
  tax_amount: null,
  profit_a: null,
  profit_b: null,
  profit_c: null,
  lines: [],
  quotation_net_amount_a: null,
  quotation_net_amount_b: null,
  quotation_net_amount_c: null,
  quotation_total_amount_a: null,
  quotation_total_amount_b: null,
  quotation_total_amount_c: null,
  total_cost: null,
  net_amount: null,
  total_amount: null,
});

const conditions = computed({
  get: () => {
    return orderStore.getConditions;
  },
});

onMounted(async () => {
  console.log(invoiceId.value);
  orderStore.listConditions();
  if (invoiceId.value !== 'NEW') {
    await orderStore.retrieveOrder(invoiceId.value);
    await customerStore.listShortCustomers();
    orderStore.listBankAccounts();
    const currentInvoice = orderStore.getCurrentOrder;
    invoice.value.id = currentInvoice.id;
    invoice.value.status = currentInvoice.status;
    invoice.value.customer = currentInvoice.customer;
    invoice.value.date_time_issued = currentInvoice.date_time_issued.split('T')[0].replaceAll('/', '-');
    invoice.value.supply_order = currentInvoice.supply_order;
    invoice.value.po_number = currentInvoice.po_number;
    invoice.value.bank_account = currentInvoice.bank_account;
    invoice.value.conditions = currentInvoice.conditions;
    invoice.value.tax = currentInvoice.tax;
    invoice.value.tax_amount = parseFloat(currentInvoice.tax_amount);
    invoice.value.profit_a = parseFloat(currentInvoice.profit_a);
    invoice.value.profit_b = parseFloat(currentInvoice.profit_b);
    invoice.value.profit_c = parseFloat(currentInvoice.profit_c);
    invoice.value.quotation_net_amount_a = parseFloat(currentInvoice.quotation_net_amount_a);
    invoice.value.quotation_net_amount_b = parseFloat(currentInvoice.quotation_net_amount_b);
    invoice.value.quotation_net_amount_c = parseFloat(currentInvoice.quotation_net_amount_c);
    invoice.value.quotation_total_amount_a = parseFloat(currentInvoice.quotation_total_amount_a);
    invoice.value.quotation_total_amount_b = parseFloat(currentInvoice.quotation_total_amount_b);
    invoice.value.quotation_total_amount_c = parseFloat(currentInvoice.quotation_total_amount_c);
    invoice.value.net_amount = parseFloat(currentInvoice.net_amount);
    invoice.value.total_amount = parseFloat(currentInvoice.total_amount);
    listAttachments();
    await productStore.listProducts();
    await vendorStore.listShortVendors();
    await unitStore.listUnits();
    const productList = productStore.getProducts;
    const unitList = unitStore.getUnits;
    invoice.value.lines = currentInvoice.lines.map((l, index) => ({
      index,
      id: l.id,
      source: l.source,
      vendor: (() => {
        const vendor = vendors.value.find((v) => v.id === l.vendor);
        return vendor ? { id: vendor.id, name: vendor.name } : null;
      })(),
      product: (() => {
        const product = productList.find((p) => p.id === l.product);
        return product ? { id: product.id, name: product.name } : null;
      })(),
      description: { id: l.description, name: l.description_name },
      unit_type: unitList.find((u) => u.id === l.unit_type),
      quotation_quantity: parseFloat(l.quotation_quantity),
      country_a: l.country_a,
      country_b: l.country_b,
      country_c: l.country_c,
      unit_value_a: parseFloat(l.unit_value_a),
      unit_value_b: parseFloat(l.unit_value_b),
      unit_value_c: parseFloat(l.unit_value_c),
      margin_a: parseFloat(l.margin_a),
      margin_b: parseFloat(l.margin_b),
      margin_c: parseFloat(l.margin_c),
      sales_price_a: parseFloat(l.sales_price_a),
      sales_price_b: parseFloat(l.sales_price_b),
      sales_price_c: parseFloat(l.sales_price_c),
      quotation_total_value_a: parseFloat(l.quotation_total_value_a),
      quotation_total_value_b: parseFloat(l.quotation_total_value_b),
      quotation_total_value_c: parseFloat(l.quotation_total_value_c),
      label: l.label,
      quantity: parseFloat(l.quantity),
      total_value: parseFloat(l.total_value),
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
const showAddInvoiceLineDialog = async (selectedLine) => {
  if (selectedLine === null) {
    invoiceLineToEdit.value = {
      index: -1,
      source: 'Vendor',
      vendor: null,
      product: null,
      description: null,
      unit_type: null,
      quotation_quantity: null,
      country_a: null,
      country_b: null,
      country_c: null,
      unit_value_a: null,
      unit_value_b: null,
      unit_value_c: null,
      margin_a: parseFloat(invoice.value.profit_a),
      margin_b: parseFloat(invoice.value.profit_b),
      margin_c: parseFloat(invoice.value.profit_c),
      sales_price_a: null,
      sales_price_b: null,
      sales_price_c: null,
      quotation_total_value_a: null,
      quotation_total_value_b: null,
      quotation_total_value_c: null,
      label: 'A',
      quantity: null,
      total_value: null,
    };
  } else {
    await productStore.retrieveProduct(selectedLine.product.id);
    invoiceLineToEdit.value = {
      index: selectedLine.index,
      source: selectedLine.source,
      vendor: selectedLine.vendor.id,
      product: selectedLine.product.id,
      description: selectedLine.description.id,
      unit_type: selectedLine.unit_type.id,
      quotation_quantity: parseFloat(selectedLine.quotation_quantity),
      country_a: selectedLine.country_a,
      country_b: selectedLine.country_b,
      country_c: selectedLine.country_c,
      unit_value_a: selectedLine.unit_value_a,
      unit_value_b: selectedLine.unit_value_b,
      unit_value_c: selectedLine.unit_value_c,
      margin_a: parseFloat(selectedLine.margin_a),
      margin_b: parseFloat(selectedLine.margin_b),
      margin_c: parseFloat(selectedLine.margin_c),
      sales_price_a: parseFloat(selectedLine.sales_price_a),
      sales_price_b: parseFloat(selectedLine.sales_price_b),
      sales_price_c: parseFloat(selectedLine.sales_price_c),
      quotation_total_value_a: parseFloat(selectedLine.quotation_total_value_a),
      quotation_total_value_b: parseFloat(selectedLine.quotation_total_value_b),
      quotation_total_value_c: parseFloat(selectedLine.quotation_total_value_c),
      label: selectedLine.label,
      quantity: parseFloat(selectedLine.quotation_quantity),
      total_value: parseFloat(selectedLine.quotation_total_value),
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
      if (newLine.quantity === null || newLine.quantity === 0) newLine.quantity = newLine.quotation_quantity;
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
  { id: 'T2', name: t('tableTax') },
]);


const totalWithTax = computed(() => {
  const salesValue = invoice.value.status === 'Quotation' ? invoiceSummary.value.netSales[selectedLabel.value.toLowerCase()] : invoiceSummary.value.netSales.invoice;
  return Math.round(salesValue * (1 + (invoice.value.tax_amount / 100)));
});

const invoiceSummary = computed(() => {
  return {
    cost: {
      a: Math.round(invoice.value.lines.reduce((acc, line) => acc + parseFloat(line.quotation_quantity * line.unit_value_a || 0), 0)),
      b: Math.round(invoice.value.lines.reduce((acc, line) => acc + parseFloat(line.quotation_quantity * line.unit_value_b || 0), 0)),
      c: Math.round(invoice.value.lines.reduce((acc, line) => acc + parseFloat(line.quotation_quantity * line.unit_value_c || 0), 0)),
      invoice: Math.round(invoice.value.lines.reduce((acc, line) => acc + parseFloat(line.quantity * line[`unit_value_${line.label.toLowerCase()}`] || 0), 0)),
    },
    netSales: {
      a: Math.round(invoice.value.lines.reduce((acc, line) => acc + parseFloat(line.quotation_quantity * line.sales_price_a || 0), 0)),
      b: Math.round(invoice.value.lines.reduce((acc, line) => acc + parseFloat(line.quotation_quantity * line.sales_price_b || 0), 0)),
      c: Math.round(invoice.value.lines.reduce((acc, line) => acc + parseFloat(line.quotation_quantity * line.sales_price_c || 0), 0)),
      invoice: Math.round(invoice.value.lines.reduce((acc, line) => acc + parseFloat(line.quantity * line[`sales_price_${line.label.toLowerCase()}`] || 0), 0)),
    },
  };
});

const saveData = async () => {
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
    po_number: invoice.value.po_number,
    bank_account: invoice.value.bank_account,
    conditions: invoice.value.conditions,
    tax: invoice.value.tax,
    tax_amount: invoice.value.tax_amount,
    profit_a: invoice.value.profit_a,
    profit_b: invoice.value.profit_b,
    profit_c: invoice.value.profit_c,
    quotation_net_amount_a: invoiceSummary.value.netSales.a,
    quotation_net_amount_b: invoiceSummary.value.netSales.b,
    quotation_net_amount_c: invoiceSummary.value.netSales.c,
    quotation_total_amount_a: Math.round(invoiceSummary.value.netSales.a * (1 + (invoice.value.tax_amount / 100))),
    quotation_total_amount_b: Math.round(invoiceSummary.value.netSales.b * (1 + (invoice.value.tax_amount / 100))),
    quotation_total_amount_c: Math.round(invoiceSummary.value.netSales.c * (1 + (invoice.value.tax_amount / 100))),
    total_cost: invoiceSummary.value.cost.invoice,
    net_amount: invoiceSummary.value.netSales.invoice,
    total_amount: totalWithTax.value,

    lines: invoice.value.lines.map((l) => ({
      source: l.source,
      vendor: l.vendor?.id || null,
      product: l.product?.id || null,
      description: l.description?.id || null,
      unit_type: l.unit_type?.id || null,
      quotation_quantity: l.quotation_quantity || 0,
      country_a: l.country_a || null,
      country_b: l.country_b || null,
      country_c: l.country_c || null,
      unit_value_a: l.unit_value_a || 0,
      unit_value_b: l.unit_value_b || 0,
      unit_value_c: l.unit_value_c || 0,
      margin_a: l.margin_a || 0,
      margin_b: l.margin_b || 0,
      margin_c: l.margin_c || 0,
      sales_price_a: l.sales_price_a || 0,
      sales_price_b: l.sales_price_b || 0,
      sales_price_c: l.sales_price_c || 0,
      quotation_total_value_a: Math.round(l.quotation_quantity * l.sales_price_a) || 0,
      quotation_total_value_b: Math.round(l.quotation_quantity * l.sales_price_b) || 0,
      quotation_total_value_c: Math.round(l.quotation_quantity * l.sales_price_c) || 0,
      label: l.label || null,
      country: l[`country_${l.label.toLowerCase()}`] || null,
      quantity: l.quantity || 0,
      unit_value: l[`unit_value_${l.label.toLowerCase()}`] || 0,
      margin: l[`margin_${l.label.toLowerCase()}`] || 0,
      sales_price: l[`sales_price_${l.label.toLowerCase()}`] || 0,
      total_value: Math.round(l.quantity * l[`sales_price_${l.label.toLowerCase()}`] || 0),
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


const printSupplyOrder = async (preview) => {
  if (vendorToPrint.value === null) return;
  const params = {
    vendor: vendorToPrint.value,
    quotation_id: invoiceId.value,
    show_template: showTemplate.value,
  };
  loading.value = true;
  const response = await reportStore.retrieveSupplyOrder(params);
  loading.value = false;
  getReport(preview, response);
};

const printQuotation = async (preview) => {
  const params = {
    quotation_id: invoiceId.value,
    show_template: preview,
    label: selectedLabel.value.toLowerCase(),
  };
  loading.value = true;
  const response = await reportStore.retrieveQuotation(params);
  loading.value = false;
  getReport(preview, response);
};


const addCondition = (condition) => {
  invoice.value.conditions = condition.conditions;
  ensureBulleted();
};

const uniqueVendors = computed(() => {
  const vendors = [];
  invoice.value.lines.forEach((line) => {
    if (!vendors.includes(line.vendor) && line.vendor !== null) {
      vendors.push(line.vendor);
    }
  });
  return vendors;
});

const vendorToPrint = ref(null);
const showTemplate = ref(true);
const updateVendor = (vendor) => {
  vendorToPrint.value = vendor?.id;
}

const selectedLabel = ref('A');
const labelOptions = [
  { id: 'A', name: 'A' },
  { id: 'B', name: 'B' },
  { id: 'C', name: 'C' },
];

const tableRows = computed(() => {
  return filter.value === '' ? invoice.value.lines : invoice.value.lines.filter((l) => {
    return l.product.name.toLowerCase().includes(filter.value.toLowerCase())
      || l.description.name.toLowerCase().includes(filter.value.toLowerCase())
      || l.unit_type.description.toLowerCase().includes(filter.value.toLowerCase())
      || (l.vendor ? l.vendor.name.toLowerCase().includes(filter.value.toLowerCase()) : false);
  });
});

const getTotal = (row) => {
  return row.quantity * row[`sales_price_${selectedLabel.value.toLowerCase()}`];
};

const bankAccounts = computed(() => orderStore.getBankAccounts);

const checkFileType = (files) => {
  return files.filter((f) => f.type === 'application/pdf');
};

const attachmentToEdit = ref(null);
const attachmentShow = ref(false);
const showAttachmentDialog = (attachmentInfo) => {
  attachmentToEdit.value = attachmentInfo === null ? {
    id: null,
    quotation: invoiceId.value,
    file: null,
    file_type: null,
    file_number: null,
  } : attachmentInfo;
  attachmentShow.value = true;
};

const attachmentCategory = ref('all');
const listAttachments = async () => {
  await orderStore.listAttachments(invoiceId.value);
};

const attachmentList = computed(() => {
  const allAttachments = orderStore.getAttachments;
  return attachmentCategory.value === 'all' ? allAttachments : allAttachments.filter((a) => a.file_type === attachmentCategory.value);
});

const closeAttachmentDialog = (isSaved) => {
  if (isSaved) listAttachments();
  attachmentShow.value = false;
};



const getFileName = (str) => {
  const dict = {
    conditions: t('conditions'),
    supply_order: t('supplyOrder'),
    payment_order: t('paymentOrder'),
    other: t('other'),
  };
  return dict[str.toLowerCase()] || str;
};

const parseDate = (date) => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const deleteAttachment = (attachmentId) => {
  $q.dialog({
    title: t('confirm'),
    message: t('confirmDeleteAttachment'),
    cancel: true,
    persistent: false,
  }).onOk(async () => {
    try {
      loading.value = true;
      await orderStore.deleteAttachment(attachmentId);
      await listAttachments();
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
}
</script>
