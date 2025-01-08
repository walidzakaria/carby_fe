<template>
  <q-page class="q-pa-sm bg-white">
    <div class="text-h4">{{ t('purchaseInvoice') }}</div>
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
                  v-model="purchase.branch"
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
                  :listOptions="vendors"
                  :label="t('vendor')"
                  :default-selection="purchase.vendor"
                  :isOutlined="false"
                  @value-update="updateVendor"/>
              </q-item>
              <q-item class="col-6 q-pa-xs">
                <q-select
                  v-model="purchase.document_type"
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
                  v-model="purchase.internal_code"
                  class="full-width"
                  :label="t('internalCode')"/>
              </q-item>
              <q-item class="col-6 q-pa-xs">
                <q-input  dense autogrow
                  class="full-width"
                  :label="`${t('date')} *`"
                  v-model="purchase.date" mask="date" :rules="['date']"
                  :disable="!isAdmin">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="purchase.date">
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
                  v-model="purchase.document_status"
                  :options="docStatus"
                  :label="`${t('docStatus')} *`"
                  option-label="name"
                  option-value="id"
                  emit-value
                  map-options
                  dense class="full-width"
                />
              </q-item>
              <product-search
                :autohide="false"
                :showSearch="true"
                :allow-add="true"
                ref="productSearchRef"
                @submitProduct="submitProduct" class="col-12"/>
              <q-form @submit.prevent="addProduct" class="row q-pa-xs">
                <q-item class="col-3 q-pa-xs">
                  <q-input type="number" dense outlined class="full-width" v-model="itemToAdd.quantity"
                    @keydown="preventArrowKeys"
                    min="0"
                    step="0.01"
                    :label="`${t('quantity')} *`"
                    lazy-rules
                    :rules="[val => !!val || t('required')]" />
                </q-item>
                <q-item class="col-3 q-pa-xs">
                  <q-input type="number" dense outlined class="full-width" v-model="itemToAdd.product_value"
                    @keydown="preventArrowKeys"
                    @focus="getProductCost"
                    min="0"
                    step="0.01"
                    :label="`${t('totalCost')} *`"
                    lazy-rules
                    :rules="[val => !!val || t('required')]"
                    :hint="`${t('value')}: ${unit_price}`"
                    />
                </q-item>
                <q-item class="col-3 q-pa-xs">
                  <q-select
                    v-model="itemToAdd.productUnit"
                    :options="productUnits"
                    option-label="name"
                    option-value="id"
                    :label="`${t('unit')} *`"
                    emit-value
                    map-options
                    dense outlined class="full-width"
                    lazy-rules
                    :rules="[val => !!val || t('required')]"
                  />
                </q-item>
                <q-item class="col-3 q-pa-xs">
                  <q-btn class="text-capitalize text-white"
                    style="height: 42px; width: 100%;"
                    type="submit"
                    icon="add"
                    rounded
                    label="Add"
                    color="green">
                  </q-btn>
                </q-item>
              </q-form>
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
                  v-for="(p, index) in purchase.purchase_payments" :key="index">
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
            <q-icon name="local_mall" color="blue" class="q-mr-sm"/>
            {{ purchase.id > 0 ? `Purchase# ${formattedCode}` : 'New Purchase' }}
            <currency-indicator :total-amount="netTotal" />
          </q-card-section>
          <q-separator />
          <q-card-section id="orderTable" class="q-pa-none q-ma-none" style="max-height: calc(100vh - 330px); overflow-y: auto;">
            <q-table
              style="min-height: calc(100vh - 330px);"
              class="no-shadow q-pa-xs"
              v-model:pagination="pagination"
              :rows="purchase.purchase_items"
              :columns="purchase_column"
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
                      <q-item-section>
                      <q-item-label>{{ props.row.name }}</q-item-label>
                      <q-item-label caption class="">{{ props.row.quantity }} {{ props.row.unit_name }}s x {{ props.row.unit_price }}</q-item-label>
                    </q-item-section>
                  </q-item-section>
                </q-item>
              </q-td>
              <q-td :props="props" class="text-right">
                <b>L.E. {{ props.row.value.toFixed(2) }}</b>
              </q-td>
              <q-td :props="props" class="text-right">
                <q-btn round flat icon="delete" color="red" @click="removeProduct(props.row.id)"></q-btn>
              </q-td>
            </template>
            </q-table>
          </q-card-section>

















































          <q-separator/>
        </q-card>
        <br>
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
                v-model="purchase.discount"></q-input>
              <q-item-section side>
                <q-toggle
                  :label="purchase.discountType ? '%' : '$'"
                  v-model="purchase.discountType"
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
      <q-btn
        :disabled="(purchase.id > 0 && !tablePermissions.purchases.u) || (!purchase.id > 0 && !tablePermissions.purchases.c)"
        rounded
        @click="savePurchase"
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
      <q-btn v-if="purchase.id > 0" fab icon="print" color="purple" @click="printReceipt" />
      <q-btn v-if="purchase.id > 0 && tablePermissions.purchases.d" fab icon="delete" color="red" @click="deleteInvoice" />
    </q-page-sticky>

    <q-dialog v-model="showPrint">
      <q-card class="q-dialog-plugin">
        <div class="row" :dir="locale === 'ar' ? 'rtl' : 'ltr'" id="receipt">
          <div class="col-12">
            <q-item class="full-width rounded-borders">
              <q-item-section>
                <q-item-label header class="text-h6">{{ t('purchaseSummary') }}</q-item-label>
              </q-item-section>
              <q-item-section side header class="text-h6">
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
                        <b>{{ purchase.date }}</b>
                      </td>
                    </tr>
                </table>
              </q-item-section>
              <q-item-section side class="full-width rounded-borders text-black">
                <table>
                  <tr>
                    <td>{{ t('vendor') }}: </td>
                    <td class="text-subtitle1">
                      <b>{{ getVendor() }}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ t('type') }}: </td>
                    <td class="text-subtitle2">
                      <b>
                        {{ t(purchase.document_type.toLowerCase()) }} - {{ t(purchase.document_status.toLowerCase()) }}
                      </b>
                    </td>
                  </tr>
                </table>
              </q-item-section>
            </q-item>
            <q-item class="full-width" style="margin-top: -9px;" v-for="(product, index) in purchase.purchase_items" :key="index">
              <q-item-section>
                <q-item-label lines="1">{{ product.name }}</q-item-label>
                <q-item-label caption>{{ product.quantity }} {{ product.unit_name }} x ${{ product.unit_price }}</q-item-label>
              </q-item-section>
              <q-item-section side class="text-black">
                L.E. {{ product.value.toFixed(2) }}
              </q-item-section>
              <q-separator></q-separator>
            </q-item>
            <q-separator></q-separator>
            <q-item class="full-width" style="border-top: 3px dotted blue">
              <q-item-section>
                <q-item-label lines="1">{{ t('total') }}</q-item-label>
              </q-item-section>
              <q-item-section side class="text-black">
                L.E. {{ grossTotal.toFixed(2) }}
              </q-item-section>
            </q-item>
            <div v-if="purchase.discount > 0">
              <q-item class="full-width" style="margin-top: -23px;">
                <q-item-section>
                  <q-item-label lines="1">{{ t('discount') }} {{ purchase.discountType ? `${purchase.discount}%` : '' }}</q-item-label>
                </q-item-section>
                <q-item-section side class="text-black">
                  -L.E. {{ purchase.discountType ? discountValue : purchase.discount }}
                </q-item-section>
              </q-item>
              <q-item class="full-width" style="margin-top: -23px;">
                <q-item-section>
                  <q-item-label lines="1">{{ t('netTotal') }}</q-item-label>
                </q-item-section>
                <q-item-section side class="text-black">
                  L.E. {{ netTotal.toFixed(2) }}
                </q-item-section>
              </q-item>
            </div>
            <div v-for="(payment, index) in purchase.purchase_payments" :key="index" >
              <q-item class="full-width" style="margin-top: -23px;"
                v-if="(payment.currency || 0) > 0 && (payment.value || 0) > 0">
                  <q-item-section>
                    <q-item-label v-show="index === 0" lines="1">{{ t('paid') }}</q-item-label>
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
import { useVendorStore } from 'src/stores/vendor-store';
import { useProductStore } from 'src/stores/product-store';
import { useUnitStore } from 'src/stores/unit-store';
import { useCurrencyStore } from 'src/stores/currency-store';
import { usePurchaseStore } from 'src/stores/purchase-store';
import { getToday } from 'src/utils/dateUtils';
import { useAuthStore } from 'src/stores/auth-store';

const ProductItem = defineAsyncComponent(() => import('components/ProductItem.vue'));
const UserDetailItem = defineAsyncComponent(() => import('components/UserDetailItem.vue'));
const CurrencyIndicator = defineAsyncComponent(() => import('components/CurrencyIndicator.vue'));
const BarcodeLabel = defineAsyncComponent(() => import('src/components/BarcodeLabelSingle.vue'));
const PersonSearch = defineAsyncComponent(() => import('components/PersonSearch.vue'));
const ProductSearch = defineAsyncComponent(() => import('components/ProductSearch.vue'));

const $q = useQuasar();
const branchStore = useBranchStore();
const vendorStore = useVendorStore();
const productStore = useProductStore();
const unitStore = useUnitStore();
const currencyStore = useCurrencyStore();
const purchaseStore = usePurchaseStore();
const authStore = useAuthStore();
const search = ref('');
const loading = ref(false);



const pagination = ref({
  rowsPerPage: 0,
});

const userBranches = computed({
  get: () => {
    const branches = branchStore.getBranches;
    const validBranches = branchStore.getUserBranches.map((ub) => ub.branch);
    return branches.filter((b) => validBranches.includes(b.id));
  },
});

const getBranch = () => {
  const branches = branchStore.getBranches;
  const selectedBranch = branches.find((b) => b.id === purchase.value.branch);
  return selectedBranch?.name || '';
};

const getVendor = () => {
  const vendor = vendors.value.find((v) => v.id === purchase.value.vendor);
  return vendor?.name || '';
};

const vendors = computed({
  get: () => vendorStore.getVendorsShort || [],
});

const units = computed({
  get: () => unitStore.getUnits || [],
});

const docTypes = ref([
  {id: 'Invoice', name: t('invoice')},
  {id: 'Return', name: t('return')},
]);

const docStatus = ref([
  { id: 'Active', name: t('active') },
  { id: 'Hold', name: t('hold') },
  { id: 'Canceled', name: t('canceled') },
]);


const purchase = ref({
  id: null,
  branch: localStorage.getItem('selectedBranch') ? parseInt(localStorage.getItem('selectedBranch'), 10) : null,
  vendor: null,
  document_type: 'Invoice',
  document_status: 'Active',
  internal_code: null,
  date: getToday(),
  purchase_items: [],
  purchase_payments: [],
  discount: 0,
  discountType: false,
  discount_type: 'Percent',
});

const loadProducts = async() => {
  loading.value = true;
  await productStore.listShortProducts();
  loading.value = false;
};

const loadCostPrices = () => {
  purchaseStore.retrieveLastCost();
};

const costPrices = computed({
  get: () => {
    return purchaseStore.getLastCosts;
  },
});

const getProductCost = () => {
  console.log('focused');
  const productId = selectedProduct.value.id;
  if (!productId || itemToAdd.value.product_value > 0) return;
  costPrices.value.forEach((c) => {
    if (c.id === productId) {
      itemToAdd.value.product_value = c.value * itemToAdd.value.quantity;
    }
  });
  console.log(itemToAdd.value);
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

const selectProduct = async(product) => {
  loading.value = true;
  await productStore.retrieveProduct(product?.id || 0);
  itemToAdd.value.quantity = 1;
  itemToAdd.value.unit_value = 1;
  itemToAdd.value.productUnit = selectedProduct.value?.unit;
  itemToAdd.value.product_value = null;
  loading.value = false;
};

const route = useRoute();

onMounted(async() => {
  loadProducts();
  loadCostPrices();
  await currencyStore.listCurrency();
  purchase.value.purchase_payments = currency.value.map((c) => ({
    id: null,
    currency: c.id,
    label: c.name,
    value: null,
  }));

  const invoiceNumber = route.params.invoiceNumber;
  if (invoiceNumber) {
    searchInvoice.value = invoiceNumber;
    findInvoice();
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
  product_value: null,
  productUnit: null,
});

const handleInput = () => {
  if (productList.value.length === 1) {
    selectProduct(productList.value[0]);
  } else if (productList.value.length > 1) {
    const searchText = search.value.toLowerCase();
    const foundProduct = productList.value.find((p) => p.code.toLowerCase() === searchText
      || p.name.toLowerCase() === searchText);
    if (foundProduct) {
      selectProduct(foundProduct);
    }
  }
};

const unit_price = computed({
  get: () => {
    let value = 0;
    if (selectedProduct.value?.id > 0) {
      const calc = itemToAdd.value.product_value / itemToAdd.value.quantity;
      value = parseFloat(calc.toFixed(2))
    }
    return value;
  }
});

const grossTotal = computed({
  get: () => {
    const gross = purchase.value.purchase_items.reduce((total, item) => total + item.value, 0);
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

const discountValue = computed({
  get: () => {
    const gross = grossTotal.value;
    const discountAmount = purchase.value.discountType ? (gross * (purchase.value.discount || 0) / 100) : (purchase.value.discount || 0);
    if (discountAmount > 0) {
      return discountAmount;
    }
    return '0.00';
  }
});

const restTotal = computed({
  get: () => {
    let result = netTotal.value;
    purchase.value.purchase_payments.forEach((p) => {
      if (p.currency) {
        const selectedCurrency = currency.value.find((c) => c.id === p.currency);
        const paidAmount = selectedCurrency.rate * p.value;
        result -= paidAmount;
      }
    });
    return result;
  },
});

const addProduct = () => {
  // check if the product exists previously
  let foundProduct = false;
  purchase.value.purchase_items.forEach((p) => {
    if (p.id === selectedProduct.value.id && p.unit === itemToAdd.value.productUnit
      && p.unit_price === unit_price.value) {
        foundProduct = true;
        p.quantity = parseFloat(p.quantity) + parseFloat(itemToAdd.value.quantity);
        p.value = parseFloat(p.value) + parseFloat(itemToAdd.value.product_value);
      }
      console.log('p', p);
      console.log('add', itemToAdd.value);
  });
  if (!foundProduct) {
    purchase.value.purchase_items.push({
      id: selectedProduct.value.id,
      product: selectedProduct.value.id,
      name: selectedProduct.value.name,
      quantity: itemToAdd.value.quantity,
      unit: itemToAdd.value.productUnit,
      unit_price: unit_price.value,
      unit_name: units.value.find((u) => u.id === itemToAdd.value.productUnit).name,
      unit_value: productUnits.value.find((u) => u.id === itemToAdd.value.productUnit).value,
      image: getImage(selectedProduct.value),
      value: parseFloat(itemToAdd.value.product_value),
    });
  }
  console.log('items', purchase.value.purchase_items);
  itemToAdd.value.quantity = 1;
  itemToAdd.value.unit_value = 1;
  itemToAdd.value.productUnit = null;
  selectProduct({});
  productSearchRef.value?.clear();
  productSearchRef.value?.focusSearch();
};

const removeProduct = (itemId) => {
  let itemIndex = -1;
  let counter = 0;
  purchase.value.purchase_items.forEach((o) => {
    if (o.id === itemId) {
      itemIndex = counter;
    }
    counter += 1;
  });
  purchase.value.purchase_items.splice(itemIndex, 1);
};

const currency = computed({
  get: () => { return currencyStore.getCurrency },
});

const addPayment = () => {
  purchase.value.purchase_payments.push({
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
  purchase.value.purchase_payments.splice(index, 1);
};

const searchInvoice = ref('');
const disableNext = computed({
  get: () => {
    const result = (purchase.value.vendor === null || purchase.value.branch === null);
    return result;
  }
});

const userConfirm = ref(false);
const validOrder = () => {
  if (purchase.value.purchase_items.length === 0) {
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
  if (restAmount <= 10) return true;
  if (userConfirm.value) return true;
    $q.dialog({
      title: t('onfirm'),
      message: t('confirmCreditInvoice'),
      cancel: true,
      persistent: false,
    }).onOk(async() => {
      userConfirm.value = true;
      savePurchase();
    });
  return false;
};

const savePurchase = async() => {
  if (loading.value) return;
  if (!purchase.value.branch > 0) {
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
  } else if (!purchase.value.vendor > 0) {
    $q.notify({
      type: 'negative',
      position: 'top-right',
      message: t('missingVendor'),
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
  const newPurchasePayments = [];
  purchase.value.purchase_payments.forEach((p) => {
    if (p.currency !== null && p.value !== null && p.value !== '') {
      newPurchasePayments.push(p);
    }
  });
  newPurchasePayments.forEach((p) => {
    const selectedCurrency = getCurrencyName(p.currency);
    p.exchange_rate = selectedCurrency.rate;
    p.payment_type = 'Payment';
    p.vendor = purchase.value.vendor;
  });
  const purchaseInfo = { ...purchase.value };
  purchaseInfo.purchase_payments = newPurchasePayments;
  purchaseInfo['discount_type'] = purchase.value.discountType ? 'Percent' : 'Value';
  purchaseInfo.purchase_payments = newPurchasePayments;

  try {
    if (purchase.value.id > 0) {
      purchaseInfo.date = purchaseInfo.date.replaceAll('/', '-');
      const response = await purchaseStore.editPurchase(purchaseInfo);
      console.log(response);
      purchase.value.purchase_items = response.purchase_items.map((p) => ({
        id: p.id,
        product: p.product,
        name: productList.value.find((i) => i.id === p.product).name,
        quantity: p.quantity,
        unit: p.unit,
        unit_price: p.unit_price,
        unit_name: units.value.find((u) => u.id === p.unit).name,
        image: getImage(productList.value.find((i) => i.id === p.product)),
        unit_value: p.unit_value,
        value: parseFloat(p.total_amount),
        paid_amount: parseFloat(p.paid_amount),
      }));
    } else {
      // make sure that the date is not manipulated
      if (!isAdmin.value) purchaseInfo.date = getToday();
      purchaseInfo.date = purchaseInfo.date.replaceAll('/', '-');
      const response = await purchaseStore.postPurchase(purchaseInfo);
      purchase.value.id = response.purchase.id;
      localStorage.setItem('selectedBranch', purchase.value.branch);
      console.log(response);
      purchase.value.purchase_items = response.purchase_items.map((p) => ({
        id: p.id,
        product: p.product,
        name: productList.value.find((i) => i.id === p.product).name,
        quantity: p.quantity,
        unit: p.unit,
        unit_price: p.unit_price,
        unit_name: units.value.find((u) => u.id === p.unit).name,
        image: getImage(productList.value.find((i) => i.id === p.product)),
        unit_value: p.unit_value,
        value: parseFloat(p.total_amount),
        paid_amount: parseFloat(p.paid_amount),
      }));
      localStorage.setItem('selectedBranch', purchase.value.branch);
      purchase.value.id = response.purchase.id;
    }
    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: `${t('purchaseSaved')} (${purchase.value.id})`,
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    reset();
  } catch(error) {
    if (error.status === 403) {
      loading.value = false;
      return;
    }
    $q.notify({
      type: 'negative',
      position: 'top-right',
      message: t('saveFailed'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    console.error(error);
  } finally {
    loading.value = false;
  }

};

const invoiceNotFound = ref(false);

const findInvoice = async() => {
  const searchId = parseInt(searchInvoice.value, 10);
  try {
    const response = await purchaseStore.retrievePurchase(searchId);
    purchase.value.id = response.id;
    purchase.value.date = response.date;
    purchase.value.branch = response.branch;
    purchase.value.vendor = response.vendor;
    purchase.value.document_type = response.document_type;
    purchase.value.document_status = response.document_status;
    purchase.value.internal_code = response.internal_code;
    purchase.value.discountType = (response.discount_type !== 'Value');
    purchase.value.discount = response.discount;
    purchase.value.purchase_items = response.purchase_items.map((p) => ({
      id: p.id,
      product: p.product,
      name: productList.value.find((i) => i.id === p.product).name,
      quantity: p.quantity,
      unit: p.unit,
      unit_price: p.unit_price,
      unit_name: units.value.find((u) => u.id === p.unit)?.name || '',
      image: getImage(productList.value.find((i) => i.id === p.product)),
      unit_value: p.unit_value,
      value: parseFloat(p.total_amount),
    }));
    purchase.value.purchase_payments = [];
    currency.value.forEach((c) => {
      const payment = response.purchase_payments.find((p) => p.currency === c.id);
      if (payment) {
        purchase.value.purchase_payments.push({
          id: payment.id,
          currency: c.id,
          label: c.name,
          value: payment.value,
        });
      } else {
        purchase.value.purchase_payments.push({
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
    console.log('not found error', error);
  }

};

const reset = () => {
  loading.value = false;
  searchInvoice.value = null;
  purchase.value = {
    id: null,
    branch: localStorage.getItem('selectedBranch') ? parseInt(localStorage.getItem('selectedBranch'), 10) : null,
    vendor: null,
    document_type: 'Invoice',
    document_status: 'Active',
    internal_code: null,
    date: getToday(),
    purchase_items: [],
    purchase_payments: [],
    discount: 0,
    discountType: false,
    discount_type: 'Percent',
  };
  route.push('/purchases');
  productSearchRef.value?.focusSearch();
};

const preventArrowKeys = (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
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

const formattedCode = computed({
  get: () => {
    return purchase.value.id > 0 ? purchase.value.id.toString().padStart(6, '0') : 'NEW';
  },
});

const updateVendor = (vendorName) => {
  purchase.value.vendor = vendorName?.id;
}

const productSearchRef = ref(null);
const submitProduct = async(submittedProduct) => {
  console.log('emitted', submittedProduct);
  await selectProduct(submittedProduct);
};

const purchase_column = [
  {name: "Name", label: "Product", field: "name", sortable: false, align: "left"},
];

const deleteInvoice = async() => {
  $q.dialog({
      title: t('onfirm'),
      message: t('confirmDeleteInvoice'),
      cancel: true,
      persistent: false,
    }).onOk(async() => {
      try {
        await purchaseStore.deletePurchase(purchase.value.id);
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
</style>>
