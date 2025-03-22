<template>
  <q-page class="q-pa-sm">
    <q-card class="bg-transparent no-shadow no-border">
      <div class="q-pa-md q-gutter-sm">
        <q-banner rounded class="bg-white">
          <div class="row">
            <date-range :startDate="startDate" :endDate="endDate" @update="updateDate"
              class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-xs" />
            <q-select v-model="status" :options="statusOptions" option-label="name" option-value="id"
              :label="t('status')" emit-value map-options lazy-rules dense autogrow outlined
              class="col-lg-2 col-md-2 col-sm-6  col-xs-12 q-pa-xs" />
            <div class="col-lg-7 col-md-6 col-sm-12 col-xs-12 q-pa-xs">
              <person-search class="col-12" :label="t('customer')" :listOptions="customerOptions"
                :default-selection="customer" :isOutlined="true" @value-update="updateCustomer" />
            </div>
          </div>

          <template v-slot:action>
            <q-btn color="blue" :label="t('search')" icon="search" :loading="loading" @click="handleSearch">
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </template>
        </q-banner>
      </div>
      <q-card-section class="row">
        <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12" v-for="(data, index) in searchData" :key="index"
          style="cursor: pointer; padding: 4px 2px;">
          <sale-card class="col-lg-4 fit col-md-4 col-sm-12 col-xs-12" :id="data.id" :status="data.status"
            :creationDate="data.date_time_issued" :name="data.name" :customer="data.customer" :total="data.total"
            @deleteMeEvent="confirmDelete"></sale-card>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-pagination v-model="page" :min="1" :max="totalPages" :input="true" input-class="text-red-10"
          @update:model-value="handlePageChange"></q-pagination>
      </q-card-actions>
    </q-card>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="green" @click="addNew" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, defineAsyncComponent, computed, onMounted } from "vue";
import { useQuasar } from 'quasar';
import { useRouter } from "vue-router";
import { getToday } from "src/utils/dateUtils";
import { useI18n } from "vue-i18n";
import { useCustomerStore } from "src/stores/customer-store";
import { useOrderStore } from "src/stores/order-store";

const router = useRouter();
const { t, locale } = useI18n();
const customerStore = useCustomerStore();
const orderStore = useOrderStore();
const $q = useQuasar();

const SaleCard = defineAsyncComponent(() => import("components/cards/SaleCard.vue"));
const DateRange = defineAsyncComponent(() => import("components/DateRange.vue"));
const PersonSearch = defineAsyncComponent(() => import("components/PersonSearch.vue"));

const startDate = ref(getToday());
const endDate = ref(getToday());
const status = ref(null);
const loading = ref(false);
const updateDate = (value) => {
  startDate.value = value.from;
  endDate.value = value.to;
  $q.cookies.set('startDate', startDate.value, { expires: 365 });
  $q.cookies.set('endDate', endDate.value, { expires: 365 });
};

const page = ref(0);
const totalPages = ref(0);
const searchData = ref([]);


const addNew = () => {
  router.push("/sales/new");
};

const statusOptions = computed(() => [
  { id: null, name: t("all") },
  { id: "Quotation", name: t("quotation") },
  { id: "Canceled", name: t("canceled") },
  { id: "Invoice", name: t("invoice") },
  { id: "Closed", name: t("closed") },
]);

const customerOptions = computed(() => {
  return customerStore.getCustomersShort;
});

const customer = ref(null);
const updateCustomer = (customerName) => {
  customer.value = customerName?.id || null;
};

const handleSearch = async () => {
  if (page.value === 0) page.value = 1;

  const params = {
    start_date: startDate.value.replaceAll("/", "-"),
    end_date: endDate.value.replaceAll("/", "-"),
    status: status.value,
    customer: customer.value,
    page: page.value,
  };
  loading.value = true;
  const response = await orderStore.searchOrders(params);
  console.log(response);

  searchData.value = response.results.map((order) => ({
    id: order.id.toString().padStart(5, "0"),
    creation_date: order.creation_date,
    status: order.status,
    name: order.name,
    customer: customerOptions.value.find((c) => c.id === order.customer).name,
    total: order.status === 'Quotation' || order.status === 'Canceled' ? parseFloat(order.quotation_total_amount_a) : parseFloat(order.total_amount),
  }));
  totalPages.value = Math.ceil(response.count / 9)
  if (totalPages.value === 0) page.value = 0;
  loading.value = false;
  console.log('totalPages', totalPages.value);
};

const handlePageChange = (value) => {
  handleSearch();
};

onMounted(async () => {
  await customerStore.listShortCustomers();
  startDate.value = $q.cookies.get('startDate');
  endDate.value = $q.cookies.get('endDate');
  handleSearch();
});

const confirmDelete = (orderId) => {
  console.log('confirm delete', orderId);
  $q.dialog({
    title: t('confirm'),
    message: t('confirmDeleteInvoice'),
    cancel: true,
    persistent: false,
  }).onOk(async () => {
    await orderStore.deleteOrder(orderId);
    await handleSearch();

    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: t('deleteSucceeded'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
  });
};
</script>
