<template>
  <q-page class="q-pa-sm bg-white">
    <div class="text-h4">{{ t('salesInvoice') }}</div>
    <div class="row q-col-gutter-sm">
      <div class="col-xl-7 col-lg-7 col-md-7 col-sm-12 col-xs-12">
        <br>
        <q-input dense rounded outlined v-model="searchInvoice" class="full-width"
          :placeholder="t('enterInvoice')" @keyup.enter="findInvoice"
          lazy-rules
          :error="invoiceNotFound"
          :error-message="t('invoiceNotFound')">
          <template v-slot:append>
            <q-btn round flat icon="search" color="blue" @click="findInvoice" />
          </template>
        </q-input>
        <q-card bordered>
          <q-card-section>
            <div class="row">
              <q-item class="col-6 q-pa-xs">
                <q-select
                  v-model="order.branch"
                  :options="userBranches"
                  option-label="name"
                  option-value="id"
                  :label="`${t('branch')} *`"
                  emit-value
                  map-options
                  dense class="full-width"
                />
              </q-item>
              <q-item class="col-6 q-pa-xs">
                <person-search
                  :listOptions="customers"
                  :label="t('customer')"
                  :default-selection="order.customer"
                  :isOutlined="false"
                  @value-update="customerUpdate"/>
              </q-item>
              <q-item class="col-6 q-pa-xs">
                <q-select
                  v-model="order.document_type"
                  :options="docTypes"
                  :label="`${t('docType')} *`"
                  option-label="name"
                  option-value="id"
                  emit-value
                  map-options
                  dense class="full-width"
                />
              </q-item>
              <q-item class="col-6 q-pa-xs">
                <q-input
                  dense autogrow
                  v-model="order.internal_code"
                  class="full-width"
                  :label="t('internalCode')"/>
              </q-item>
              <q-item class="col-6 q-pa-xs">
                <q-input  dense autogrow
                  class="full-width"
                  :label="`${t('date')} *`"
                  v-model="order.date" mask="date" :rules="['date']"
                  :disable="!isAdmin">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="order.date">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-item>
              <q-item class="col-6 q-pa-xs">
                <q-select
                  v-model="order.document_status"
                  :options="docStatus"
                  :label="`${t('docStatus')} *`"
                  option-label="name"
                  option-value="id"
                  emit-value
                  map-options
                  dense class="full-width"
                />
              </q-item>
              <product-search ref="productSearchRef" :autohide="true" @submitProduct="submitProduct" class="col-12"/>
            </div>
          </q-card-section>
        </q-card>















































        <q-card bordered style="margin-top: 9px;">
          <q-card-section class="text-primary">
            <div class="text-subtitle1">Payment Info</div>
          </q-card-section>
          <q-card-section>
            <div class="row" style="margin-top: -30px; margin-left: -24px; margin-right: -24px;">
              <q-item class="flex-container">
                <q-item-section
                  class="flex-item"
                  v-for="(p, index) in order.order_payments" :key="index">
                  <q-input
                      type="number"
                      @keydown="preventArrowKeys"
                      step="0.01"
                      :label="p.label"
                      v-model="p.value"
                      min="1"
                      lazy-rules
                      dense
                      outlined
                      />
                </q-item-section>
              </q-item>
              <q-card-section class="row col-12">
                <div class="  col-12 text-h6 full-width">
                  <div class="float-right q-mr-md" style="position: relative; margin-left: 0;">
                    Rest : <span class="text-blue">L.E. <b>{{ restTotal.toFixed(2) || "0.00" }}</b></span>
                  </div>
                </div>
              </q-card-section>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12" style="margin-top: -40px;">
        <q-card class="bg-grey-2 no-shadow" bordered>
          <q-card-section class="text-center text-h6 text-black ">
            <q-icon name="shopping_cart" color="blue" class="q-mr-sm"/>
            {{ order.id > 0 ? `Order# ${formattedCode}` : 'New Order' }}
            <currency-indicator :total-amount="netTotal" />
          </q-card-section>
          <q-separator />
          <q-card-section id="orderTable" class="q-pa-none q-ma-none" style="max-height: calc(100vh - 330px); overflow-y: auto;">
            <q-table
              style="min-height: calc(100vh - 330px);"
              class="no-shadow q-pa-xs"
              v-model:pagination="pagination"
              :rows="order.order_items"
              :columns="sales_column"
              hide-header hide-bottom>
              <template v-slot:body-cell-Name="props">
                <q-td :props="props">
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar>
                        <img :src="props.row.image"/>
                      </q-avatar>
                    </q-item-section>

                    <q-item-section style="cursor: pointer;" @click="selectProduct(props.row.product)">
                      <q-tooltip
                        transition-show="flip-right"
                        transition-hide="flip-left"
                      >
                        {{ t('updateTooltip') }}
                      </q-tooltip>
                        <q-item-section>
                        <q-item-label>{{ props.row.name }}</q-item-label>
                        <q-item-label caption class="">{{ props.row.quantity }} {{ props.row.unit_name }}s x {{ props.row.unit_price }}</q-item-label>
                      </q-item-section>
                      <q-popup-edit v-model="props.row" :title="t('updateProduct')">
                        <q-item>
                          <q-input type="number" dense outlined
                            step="0.01" @keydown="preventArrowKeys"
                            v-model="props.row.quantity"
                            min="0"
                            style="width: 80px; min-width: 80px;"
                            :label="`${t('quantity')} *`"
                            lazy-rules
                            :rules="[val => !!val || t('required')]"
                            @update:model-value="updatePrice(props.row)"/>
                          <q-select
                            v-model="props.row.unit"
                            :options="productUnits"
                            option-label="name"
                            option-value="id"
                            :label="`${t('unit')} *`"
                            emit-value
                            map-options
                            dense outlined
                            lazy-rules
                            style="min-width: 100px;"
                            :rules="[val => !!val || t('required')]"
                            @update:model-value="updatePrice(props.row)"
                          />
                          <q-select
                            dense outlined
                            v-model="props.row.unit_price"
                            use-input
                            input-debounce="0"
                            @new-value="createValue"
                            :options="priceOptions"
                            @filter="filterFn"
                            :label="`${t('price')} *`"
                            lazy-rules
                            style="max-width: 170px;"
                            hide-bottom-space
                            :rules="[val => !!val || t('required')]"
                            @update:model-value="updatePrice(props.row)"
                          >
                          </q-select>
                        </q-item>
                      </q-popup-edit>
                    </q-item-section>
                  </q-item>
                </q-td>
                <q-td :props="props" class="text-right">
                  <b>L.E. {{ props.row.gross.toFixed(2) }}</b>
                </q-td>
                <q-td :props="props" class="text-right">
                  <q-btn round flat icon="delete" color="red" @click="removeProduct(props.row.id)"></q-btn>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
          <q-separator/>
        </q-card>
        <br><br>
        <q-card class="no-shadow" bordered>
          <q-list>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-avatar color="blue" text-color="white" icon="discount"/>
              </q-item-section>
              <q-input type="number"
                :label="t('discount')"
                dense outlined
                step="0.01" @keydown="preventArrowKeys"
                v-model="order.discount"></q-input>
              <q-item-section side>
                <q-toggle
                  :label="order.discountType ? '%' : '$'"
                  v-model="order.discountType"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
        <div class="space"></div>
      </div>
    </div>
    <q-page-sticky position="bottom-left" :offset="[18, 18]">
      <q-btn fab icon="restart_alt" color="orange" @click="reset" />
      <q-btn fab icon="qr_code" color="blue" @click="showScanner = true" />
      <q-btn
        :disabled="(order.id > 0 && !tablePermissions.sales.u) || (!order.id > 0 && !tablePermissions.sales.c)"
        rounded
        @click="saveOrder"
        :loading="loading"
        :disable="loading"
        fab
        color="green"
        icon="save"
        :label="t('placeOrder')">
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
      <q-btn v-if="order.id > 0" fab icon="print" color="purple" @click="printReceipt" />
      <q-btn v-if="order.id > 0 && tablePermissions.sales.d" fab icon="delete" color="red" @click="deleteInvoice" />
    </q-page-sticky>

    <q-dialog v-model="showScanner">
      <q-card class="q-dialog-plugin">
        <barcode-reader @codeRead="codeRead" />
        <q-card-actions align="right">
          <q-btn color="primary" label="Close" @click="showScanner = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showPrint">
      <q-card class="q-dialog-plugin">
        <div class="row" id="receipt">
          <div class="col-12">
            <q-item class="full-width rounded-borders">
              <q-item-section>
                <q-item-label header class="text-h6">{{ t('orderSummary') }}</q-item-label>
              </q-item-section>
              <q-item-section side header class="text-h6 text-black">
                <barcode-label :value="formattedCode"></barcode-label>
              </q-item-section>
            </q-item>
            <q-item class="full-width rounded-borders" style="border-bottom: 3px dotted blue; margin-top: -13px; margin-bottom: 8px;">
              <q-item-section>
                <table>
                    <tr>
                      <td>{{ t('branch') }}: </td>
                      <td class="text-subtitle2">
                        <b>{{ getBranch() }}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>{{ t('date') }}: </td>
                      <td class="text-subtitle2">
                        <b>{{ order.date }}</b>
                      </td>
                    </tr>
                </table>
              </q-item-section>
              <q-item-section side class="full-width rounded-borders text-black">
                <table>
                  <tr>
                    <td>{{ t('vendor') }}: </td>
                    <td class="text-subtitle1">
                      <b>{{ getCustomer() }}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ t('type') }}: </td>
                    <td class="text-subtitle2">
                      <b>
                        {{ t(order.document_type.toLowerCase()) }} - {{ t(order.document_status.toLowerCase()) }}
                      </b>
                    </td>
                  </tr>
                </table>
              </q-item-section>
            </q-item>
            <q-item class="full-width" style="margin-top: -9px;" v-for="(product, index) in order.order_items" :key="index">
              <q-item-section>
                <q-item-label lines="1">{{ product.name }}</q-item-label>
                <q-item-label caption>{{ product.quantity }} {{ product.unit_name }} x {{ (product.paid_amount / product.quantity).toFixed(2) }}</q-item-label>
              </q-item-section>
              <q-item-section side class="text-black">
                L.E. {{ product.paid_amount.toFixed(2) }}
              </q-item-section>
              <q-separator></q-separator>
            </q-item>
            <q-separator></q-separator>
            <q-item class="full-width" style="border-top: 3px dotted blue">
              <q-item-section>
                <q-item-label lines="1">Total</q-item-label>
              </q-item-section>
              <q-item-section side class="text-black">
                L.E. {{ totalPrint.toFixed(2) }}
              </q-item-section>
            </q-item>
            <!-- <div v-if="order.discount > 0">
              <q-item class="full-width" style="margin-top: 0; margin-bottom: 0;">
                <q-item-section>
                  <q-item-label lines="1">Discount {{ order.discountType ? `${order.discount}%` : '' }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  -L.E. {{ order.discountType ? discountValue : order.discount }}
                </q-item-section>
              </q-item>
              <q-item class="full-width" style="margin-top: 0; margin-bottom: 0;">
                <q-item-section>
                  <q-item-label lines="1">Net Total</q-item-label>
                </q-item-section>
                <q-item-section side>
                  L.E. {{ netTotal.toFixed(2) }}
                </q-item-section>
              </q-item>
            </div> -->
            <div v-for="(payment, index) in order.order_payments" :key="index" >
              <q-item class="full-width" style="margin-top: -23px;"
              v-if="(payment.currency || 0) > 0 && (payment.value || 0) > 0">
                  <q-item-section>
                    <q-item-label v-show="index === 0" lines="1">Paid</q-item-label>
                  </q-item-section>
                  <q-item-section side class="text-black">
                    {{ getCurrencyName(payment.currency).name }}{{ payment.value }}
                  </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
        <q-card-actions align="right" class="no-print">
          <q-btn color="green" label="Print" @click="printOrder" />
          <q-btn color="primary" label="Close" @click="showPrint = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
import { useBranchStore } from 'src/stores/branch-store';
import { useCustomerStore } from 'src/stores/customer-store';
import { useProductStore } from 'src/stores/product-store';
import { useUnitStore } from 'src/stores/unit-store';
import { useCurrencyStore } from 'src/stores/currency-store';
import { useOrderStore } from 'src/stores/order-store';
import { useAuthStore } from 'src/stores/auth-store';
import { getToday } from 'src/utils/dateUtils';
const pagination = ref({
  rowsPerPage: 0,
});
const $q = useQuasar();
const ProductItem = defineAsyncComponent(() => import('components/ProductItem.vue'));
const UserDetailItem = defineAsyncComponent(() => import('components/UserDetailItem.vue'));
const CurrencyIndicator = defineAsyncComponent(() => import('components/CurrencyIndicator.vue'));
const BarcodeLabel = defineAsyncComponent(() => import('src/components/BarcodeLabelSingle.vue'));
const BarcodeReader = defineAsyncComponent(() => import('components/BarcodeReader.vue'));
const PersonSearch = defineAsyncComponent(() => import('components/PersonSearch.vue'));
const ProductSearch = defineAsyncComponent(() => import('components/ProductSearch.vue'));

const branchStore = useBranchStore();
const customerStore = useCustomerStore();
const productStore = useProductStore();
const unitStore = useUnitStore();
const currencyStore = useCurrencyStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();
const search = ref('');
const loading = ref(false);
const showScanner = ref(false);
const codeReading = ref(false);
const codeRead = async(code) => {
  if (codeReading.value) return;
  codeReading.value = true;
  productCode.value = code;
  await handleEnter();
  codeReading.value = false;
};

const route = useRoute();

const userBranches = computed({
  get: () => {
    const branches = branchStore.getBranches;
    const validBranches = branchStore.getUserBranches.map((ub) => ub.branch);
    return branches.filter((b) => validBranches.includes(b.id));
  },
});

const customers = computed({
  get: () => customerStore.getCustomersShort || [],
});

const units = computed({
  get: () => unitStore.getUnits || [],
});

const docTypes = ref([
  { id: 'Invoice', name: t('invoice') },
  { id: 'Return', name: t('return') },
]);

const docStatus = ref([
  { id: 'Active', name: t('active') },
  { id: 'Hold', name: t('hold') },
  { id: 'Canceled', name: t('canceled') },
  { id: 'Depreciation', name: t('depreciation')},
]);

const order = ref({
  id: null,
  branch: localStorage.getItem('selectedBranch') ? parseInt(localStorage.getItem('selectedBranch'), 10) : null,
  customer: null,
  document_type: 'Invoice',
  document_status: 'Active',
  internal_code: null,
  date: getToday(),
  order_items: [],
  order_payments: [],
  discount: 0,
  discountType: false,
  discount_type: 'Percent',
});

const loadProducts = async() => {
  loading.value = true;
  await productStore.listShortProducts();
  loading.value = false;
};

const productList = computed({
  get: () => {
    const activeList = productStore.getProductsShort.filter((p) => p.is_active) || [];
    if (!search.value) return activeList;
    const searchText = search.value.toLowerCase();
    return activeList.filter((p) => p.code.toLowerCase().includes(searchText)
      || p.name.toLowerCase().includes(searchText));

    return activeList;
  },
});

const selectProduct = async(productId) => {
  loading.value = true;
  await productStore.retrieveProduct(productId);
  itemToAdd.value.quantity = 1;
  itemToAdd.value.productUnit = selectedProduct.value?.unit;
  priceOptions.value = selectedProduct.value.prices;
  itemToAdd.value.unit_price = selectedProduct.value.price;
  loading.value = false;
};

onMounted(async() => {
  await currencyStore.listCurrency();
  loadProducts();
  order.value.order_payments = currency.value.map((c) => ({
    id: null,
    currency: c.id,
    label: c.name,
    value: null,
  }));

  const invoiceNumber = route.params.invoiceNumber;
  if (invoiceNumber) {
    searchInvoice.value = invoiceNumber;
    await findInvoice();
  }

});


const selectedProduct = computed({
  get: () => productStore.getCurrentProduct,
});


const getImage = (product) => {
  if (product?.id > 0) {
    if (product.image) {
      if (product.image.includes('http')) {
        return product.image;
      } else {
        return `${process.env.API_BASE_URL}${product.image}`;
      }
    }
  }
  return '/media/product-logo.png';
};

const productUnits = computed({
  get: () => {
    if (!selectedProduct.value?.id > 0) return [];
    const result = [];
    const basicUnit = units.value.find((u) => u.id === selectedProduct.value.unit);
    result.push({
      id: basicUnit.id,
      name: basicUnit.name,
      value: 1,
    });

    selectedProduct.value?.additional_units?.forEach((au) => {
      const additionalUnit = units.value.find((u) => u.id === au.unit);
      result.push({
        id: au.unit,
        name: additionalUnit.name,
        value: au.value,
      });
    });
    return result;
  },
});


const itemToAdd = ref({
  quantity: 1,
  unit_value: 0,
  unit_price: null,
  productUnit: null,
});

const handleInput = () => {
  if (productList.value.length === 1) {
    selectProduct(productList.value[0].id);
  } else if (productList.value.length > 1) {
    const searchText = search.value.toLowerCase();
    const foundProduct = productList.value.find((p) => p.code.toLowerCase() === searchText
      || p.name.toLowerCase() === searchText);
    if (foundProduct) {
      selectProduct(foundProduct.id);
    }
  }
};

const productValue = computed({
  get: () => {
    let value = 0;
    if (selectedProduct.value?.id > 0) {
      const selectedUnit = productUnits.value.find((u) => u.id === itemToAdd.value.productUnit);
      const calc = itemToAdd.value.quantity * itemToAdd.value.unit_price * (selectedUnit?.value || 1);
      value = calc;
    }
    return value;
  }
});

const getProductValue = (product) => {
  return product;
};

const grossTotal = computed({
  get: () => {
    const gross = order.value.order_items.reduce((total, item) => total + item.gross, 0);
    return gross;
  }
});

const netTotal = computed({
  get: () => {
    const gross = grossTotal.value;
    const discountAmount = discountValue.value;
    const netAmount = gross - discountAmount;
    return netAmount;
  }
});

const totalPrint = computed({
  get: () => {
    const result = order.value.order_items.reduce((total, item) => total + item.paid_amount, 0);
    return result;
  },
});

const discountValue = computed({
  get: () => {
    const gross = grossTotal.value;
    const discountAmount = order.value.discountType ? (gross * (order.value.discount || 0) / 100) : (order.value.discount || 0);
    if (discountAmount > 0) {
      return discountAmount;
    }
    return '0.00';
  }
});

const restTotal = computed({
  get: () => {
    let result = netTotal.value;
    order.value.order_payments.forEach((p) => {
      if (p.currency) {
        const selectedCurrency = currency.value.find((c) => c.id === p.currency);
        const paidAmount = selectedCurrency.rate * p.value;
        result -= paidAmount;
      }
    });
    return result;
  },
});

const checkQuantity = async() => {
  const productInfo = {
    product: selectedProduct.value.id,
    branch: order.value.branch,
  };
  const response = await productStore.retrieveQuantity(productInfo);
  const productQuantity = response.quantity;
  const minQuantity = response.min_quantity;
  if (productQuantity <= 0) {
    $q.notify({
      progress: true,
      type: 'negative',
      position: 'bottom',
      message: t('outOfStock'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
  } else if (productQuantity <= minQuantity) {
    $q.notify({
      progress: true,
      type: 'warning',
      position: 'bottom',
      message: t('minQuantityAlarm'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
  } else {
    $q.notify({
      progress: true,
      type: 'info',
      position: 'bottom',
      message: `${t('balance')}: ${productQuantity}`,
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
  }
};

const addProduct = async() => {

  // check if the product exists previously
  let foundProduct = false;
  order.value.order_items.forEach((p) => {
    if (p.id === selectedProduct.value.id && p.unit === itemToAdd.value.productUnit
      && p.unit_price === itemToAdd.value.unit_price) {
        foundProduct = true;
        p.quantity += itemToAdd.value.quantity;
        p.gross += productValue.value;
      }
  });

  if (!foundProduct) {
    checkQuantity();
    order.value.order_items.push({
      id: selectedProduct.value.id,
      product: selectedProduct.value.id,
      name: selectedProduct.value.name,
      quantity: itemToAdd.value.quantity,
      unit: itemToAdd.value.productUnit,
      unit_price: itemToAdd.value.unit_price,
      unit_name: units.value.find((u) => u.id === itemToAdd.value.productUnit).name,
      unit_value: productUnits.value.find((u) => u.id === itemToAdd.value.productUnit).value,
      image: getImage(selectedProduct.value),
      gross: productValue.value,
    });
  }

  itemToAdd.value.quantity = 1;
  itemToAdd.value.unit_value = 1;
  itemToAdd.value.productUnit = null;
  search.value = null;
  selectProduct(0);
  scrollToEnd();
};

const scrollToEnd = () => {
  setTimeout(() => {
    const tableElement = document.getElementById('orderTable');
    if (tableElement) {
      tableElement.scrollTop = tableElement.scrollHeight + 170;
    }
  }, 1000);
};

const removeProduct = (itemId) => {
  let itemIndex = -1;
  let counter = 0;
  order.value.order_items.forEach((o) => {
    if (o.id === itemId) {
      itemIndex = counter;
    }
    counter += 1;
  });
  order.value.order_items.splice(itemIndex, 1);
};

const currency = computed({
  get: () => { return currencyStore.getCurrency },
});

const addPayment = () => {
  order.value.order_payments.push({
    id: null,
    currency: null,
    value: null,
  });
};

const getCurrencyName = (currencyId) => {
  if (currencyId > 0) {
    return currency.value.find((c) => c.id === currencyId);
  }
  return '';
};

const removePayment = (index) => {
  order.value.order_payments.splice(index, 1);
};

const searchInvoice = ref('');
const disableNext = computed({
  get: () => {
    const result = order.value.branch === null;
    return result;
  }
});
const userConfirm = ref(false);
const validOrder = () => {
  if (order.value.order_items.length === 0) {
    $q.notify({
      type: 'negative',
      position: 'top-right',
      message: t('noItems'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    return false;
  }
  const restAmount = restTotal.value;
  if (order.value.document_status === 'Depreciation') return true;
  if (restAmount <= 10 && order.value.order_payments.length > 0) return true;
  if (!order.value.customer > 0) {
    $q.notify({
      type: 'negative',
      position: 'top-right',
      message: t('invalidPayment'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    return false;
  } else {
    if (userConfirm.value) return true;
    $q.dialog({
      title: t('onfirm'),
      message: t('confirmCreditInvoice'),
      cancel: true,
      persistent: false,
    }).onOk(async() => {
      userConfirm.value = true;
      saveOrder();
    });
  }
  return false;
};

const saveOrder = async() => {
  if (loading.value) return;
  if (!order.value.branch > 0) {
    $q.notify({
      type: 'negative',
      position: 'top-right',
      message: t('missingBranch'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    return;
  }
  if (!validOrder()) return;
  loading.value = true;
  userConfirm.value = false;
  order.value['discount_type'] = order.value.discountType ? 'Percent' : 'Value';
  const newOrderPayments = [];
  order.value.order_payments.forEach((p) => {
    if (p.currency !== null && p.value !== null && p.value !== '') {
      newOrderPayments.push(p);
    }
  });
  newOrderPayments.forEach((p) => {
    const selectedCurrency = getCurrencyName(p.currency);
    p.exchange_rate = selectedCurrency.rate;
    p.payment_type = 'Payment';
    p.customer = order.value.customer;
  });
  const orderInfo = { ...order.value };
  orderInfo.order_payments = newOrderPayments;

  try {
    if (order.value.id > 0) {
      orderInfo.date = orderInfo.date.replaceAll('/', '-');
      const response = await orderStore.editOrder(orderInfo);
      order.value.order_items = response.order_items.map((p) => ({
        id: p.id,
        product: p.product,
        name: productList.value.find((i) => i.id === p.product).name,
        quantity: p.quantity,
        unit: p.unit,
        unit_price: p.unit_price,
        unit_name: units.value.find((u) => u.id === p.unit).name,
        image: getImage(productList.value.find((i) => i.id === p.product)),
        unit_value: p.unit_value,
        gross: parseFloat(p.total_amount),
        paid_amount: parseFloat(p.paid_amount),
      }));
    } else {
      if (!isAdmin.value) orderInfo.date = getToday();
      orderInfo.date = orderInfo.date.replaceAll('/', '-');
      const response = await orderStore.postOrder(orderInfo);
      order.value.id = response.order.id;
      localStorage.setItem('selectedBranch', order.value.branch);
      order.value.order_items = response.order_items.map((p) => ({
        id: p.id,
        product: p.product,
        name: productList.value.find((i) => i.id === p.product).name,
        quantity: p.quantity,
        unit: p.unit,
        unit_price: p.unit_price,
        unit_name: units.value.find((u) => u.id === p.unit).name,
        image: getImage(productList.value.find((i) => i.id === p.product)),
        unit_value: p.unit_value,
        gross: parseFloat(p.total_amount),
        paid_amount: parseFloat(p.paid_amount),
      }));
    }
    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: `${t('orderSaved')} (${order.value.id})`,
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    reset();
  } catch(error) {
    if (error.status === 406) {
      const outOfStockItems = error.response.data.data.map((p) => `
        <tr>
          <td>${p.code}</td>
          <td>${p.name}</td>
          <td>${p.requested}</td>
          <td>${p.stock}</td>
        </tr>
      `);
      const errorMessage = `
      <p>${t('outOfStock')}</p>
      <table>
        <tr>
          <th>${t('code')}</th>
          <th>${t('name')}</th>
          <th>${t('requested')}</th>
          <th>${t('available')}</th>
        </tr>
        ${outOfStockItems.join('\n')}
      </table>
      `;
      $q.notify({
        type: 'negative',
        color: 'purple',
        position: 'top-right',
        message: errorMessage,
        caption: t('saveFailed'),
        html: true,
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
    } else if (error.status !== 403) {
      $q.notify({
        type: 'negative',
        position: 'top-right',
        message: t('saveFailed'),
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
    }

    console.error(error);
  } finally {
    loading.value = false;
  }
};
const invoiceNotFound = ref(false);
const findInvoice = async() => {
  const searchId = parseInt(searchInvoice.value, 10);

  try {
    const response = await orderStore.retrieveOrder(searchId);
    order.value.id = response.id;
    order.value.date = response.date;
    order.value.branch = response.branch;
    order.value.customer = response.customer;
    order.value.document_type = response.document_type;
    order.value.document_status = response.document_status;
    order.value.internal_code = response.internal_code;
    order.value.discountType = (response.discount_type !== 'Value');
    order.value.discount = response.discount;
    order.value.order_items = response.order_items.map((p) => ({
      id: p.id,
      product: p.product,
      name: productList.value.find((i) => i.id === p.product).name,
      quantity: p.quantity,
      unit: p.unit,
      unit_price: p.unit_price,
      unit_name: units.value.find((u) => u.id === p.unit).name,
      image: getImage(productList.value.find((i) => i.id === p.product)),
      unit_value: p.unit_value,
      gross: parseFloat(p.total_amount),
      paid_amount: parseFloat(p.paid_amount),
    }));
    order.value.order_payments = [];
    currency.value.forEach((c) => {
      const payment = response.order_payments.find((p) => p.currency === c.id);
      if (payment) {
        order.value.order_payments.push({
          id: payment.id,
          currency: c.id,
          label: c.name,
          value: payment.value,
        });
      } else {
        order.value.order_payments.push({
          id: null,
          currency: c.id,
          label: c.name,
          value: null,
        });
      }
    });
    invoiceNotFound.value = false;
  } catch (error) {
    if (error.status !== 403) {
      invoiceNotFound.value = true;
    }
    console.error('not found error', error);
  }
};

const productSearchRef = ref();
const reset = () => {
  loading.value = false;
  searchInvoice.value = null;
  order.value = {
    id: null,
    branch: localStorage.getItem('selectedBranch') ? parseInt(localStorage.getItem('selectedBranch'), 10) : null,
    customer: null,
    document_type: 'Invoice',
    document_status: 'Active',
    internal_code: null,
    date: getToday(),
    order_items: [],
    order_payments: currency.value.map((c) => ({
      id: null,
      currency: c.id,
      label: c.name,
      value: null,
    })),
    discount: 0,
    discountType: false,
    discount_type: 'Percent',
  };
  route.push('/sales');
  productSearchRef.value.focusSearch();
};


// Define the createValue function
const createValue = (val, done) => {
  if (val > 0) {

    if (val !== null && val !== '') {
      const numberVal = Number(val);
      if (!isNaN(numberVal)) {
        done(numberVal, 'add-unique')
      } else {
        // Optionally, you can handle invalid input here
        console.error('Invalid input, must be a number')
      }
    }
  }
}

// Define the filterFn function
const priceOptions = ref([]);

const filterFn = (val, update) => {
  update(() => {
    if (selectedProduct.value) {
      if (val === '') {
        priceOptions.value = selectedProduct?.value?.prices || [];
      } else {
        const needle = val.toLowerCase()
        priceOptions.value = selectedProduct?.value?.prices.filter(v => v.toLowerCase().includes(needle))
      }
    }
  });
};

const formattedCode = computed({
  get: () => {
    return order.value.id > 0 ? order.value.id.toString().padStart(6, '0') : 'NEW';
  },
});

const preventArrowKeys = (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
  }
};


const searchProduct = ref();

const loadingProducts = ref(false);

const sales_column = [
  {name: "Name", label: "Product", field: "name", sortable: false, align: "left"},
];

const updatePrice = (rowInfo) => {
  const unitId = rowInfo.unit;
  const selectedUnit = productUnits.value.find((u) => u.id === unitId);
  rowInfo.gross = parseFloat(rowInfo.quantity) * parseFloat(selectedUnit.value) * rowInfo.unit_price;
};

const searchProductInput = ref();

const productCode = ref();

const handleEnter = async () => {
  if (!productCode.value) return;
  const filteredProduct = productList.value.find((c) => c.code === productCode.value);
  if (filteredProduct) {
    loadingProducts.value = true;
    await selectProduct(filteredProduct.id);
    addProduct();
    productCode.value = null;
    searchProduct.value = null;
    loadingProducts.value = false;
    productSearchRef.value.focusSearch();
  } else {
    searchProductInput.value.select();
    $q.notify({
      type: 'negative',
      position: 'top-right',
      message: `${productCode.value} ${t('invalidCode')}`,
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
  }
};

const showPrint = ref(false);

const printReceipt = () => {
  showPrint.value = true;
}

const printOrder = () => {
  const headContent = document.head.innerHTML;
  const elementHtml = document.getElementById('receipt').innerHTML;

  // Create a new window or iframe
  var printWindow = window.open('', '_blank', 'height=600,width=800');

  printWindow.document.write(`
    <html>
      <head>${headContent}</head>
      <body><div dir="${locale.value === 'ar' ? 'rtl' : 'ltr'}">${elementHtml}</div></body>
    </html>
  `);

  printWindow.focus();

  // Close the document and trigger the print
  printWindow.document.close();
  printWindow.print();
  showPrint.value = false;
  reset();
  // Close the print window after printing (optional)
};

const getBranch = () => {
  const branches = branchStore.getBranches;
  const selectedBranch = branches.find((b) => b.id === order.value.branch);
  return selectedBranch?.name || '';
};

const getCustomer = () => {
  const customer = customers.value.find((v) => v.id === order.value.customer);
  return customer?.name || '';
};

const customerUpdate = (customerName) => {
  order.value.customer = customerName?.id;
}

const submitProduct = (submittedProduct) => {
  productCode.value = submittedProduct.code;
  handleEnter();
};

const deleteInvoice = async() => {
  $q.dialog({
      title: t('onfirm'),
      message: t('confirmDeleteInvoice'),
      cancel: true,
      persistent: false,
    }).onOk(async() => {
      try {
        await orderStore.deleteOrder(order.value.id);
        reset();
        $q.notify({
        type: 'positive',
        position: 'top-right',
        message: t('invoiceDeleted'),
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
      } catch(error) {
        if (error.status === 403) return;
        $q.notify({
          progress: true,
          type: 'negative',
          position: 'top-right',
          message: t('invoiceNotDeleted'),
          progress: true,
          actions: [
            { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
          ],
        });
      }
    });
};

const tablePermissions = computed({
  get: () => {
    return authStore.getPermissions.tables;
  },
});

const isAdmin = computed({
  get: () => {
    return authStore.getPermissions.is_admin;
  },
});
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* Adjust as needed */
}

.flex-item {
  flex: 1 1 10%; /* 16% ensures 6 items fit on large screens */
  box-sizing: border-box;
  padding: 2px 0; /* Optional: For spacing */
}

/* Medium Screens */
@media (max-width: 600px) {
  .flex-item {
    flex: 1 1 30%; /* 31% ensures 3 items fit per row */
  }
}

/* Small Screens */
@media (max-width: 300px) {
  .flex-item {
    flex: 1 1 50%; /* 48% ensures 2 items fit per row */
  }
}

.q-item__section {
  margin: 0;
}

@media print {
  .no-print {
    display: none;
  }
}

th, td {
  padding: 0 4px; /* Adjust padding for smaller rows */
  line-height: 0.8; /* Adjust line height for text */
  height: 18px; /* Set a fixed height for each row */
}

tr {
  height: 18px; /* You can set the height for each row here as well */
}

@media (max-width: 1023px) {
  .space {
    min-height: 90px;
  }
}
</style>
