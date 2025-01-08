<template>
  <q-page class="q-pa-sm bg-white">
    <div class="row" v-if="!$q.screen.lt.md">
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="no-shadow" bordered style="min-height: 88vh;">
          <q-list class="" style="min-height: 75vh;">
            <q-item-label class="text-center q-pa-sm">
              <q-input dense rounded outlined v-model="search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </q-item-label>
            <div style="height: 66vh; overflow: auto;">
              <q-item-label header class="text-center">{{ productList.length }} {{ t('uProducts') }}</q-item-label>
              <span v-for="(product, index) in productList" :key="index" @click="selectProduct(product)">
                <product-item :name="product.name" :code="product.code" />
              </span>
            </div>
          </q-list>
        </q-card>
      </div>
      <div class="col-lg-8 q-pl-xs col-md-8 col-sm-12 col-xs-12">
        <q-card class="no-shadow" bordered style="min-height: 88vh;">
          <q-toolbar class="text-black ">
            <q-item class="q-subtitle-1 q-pa-lg">
              <q-item-section>
                <q-item-label lines="1">{{ selectedProduct.name || t('products') }}</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">{{ selectedProduct.code }}</span>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-space />
            <div v-if="selectedProduct.id">
              <q-btn round flat icon="delete" color="red" @click="confirmDelete(selectedProduct.id)" :disabled="!tablePermissions.product.d">
                <q-tooltip>{{ t('deleteProduct') }}</q-tooltip>
              </q-btn>
              <q-btn round flat icon="edit" color="primary" @click="showAdd(selectedProduct.id)" :disabled="!tablePermissions.product.u">
                <q-tooltip>{{ t('editProduct') }}</q-tooltip>
              </q-btn>
            </div>
          </q-toolbar>
          <q-separator></q-separator>
          <div style="height: 70vh; overflow: auto;">
            <q-item clickable v-ripple v-for="(description, index) in descriptions" :key="index">
              <q-item-section avatar top>
                <q-avatar icon="description" color="grey-2" text-color="grey-8"/>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">{{ description.description }}</q-item-label>
              </q-item-section>
            </q-item>

          </div>
        </q-card>
      </div>
    </div>
    <div v-else>
      <div v-if="(selectedProduct.id || 0) === 0">
        <q-tab-panels v-model="tab" animated class="bg-white">
          <q-tab-panel name="all" class="q-pa-none full-height" style="max-height: 77vh;">
            <q-list class="">
              <q-item-label class="text-center q-pa-sm">
                <q-input dense rounded outlined v-model="search">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </q-item-label>
              <div style="height: 66vh; overflow: auto;">
                <q-item-label header class="text-center">{{ productList.length }} {{ t('uProducts') }}</q-item-label>
                <span v-for="(product, index) in productList" :key="index" @click="selectProduct(product)">
                  <product-item :name="product.name" :code="product.code" />
                </span>
              </div>
            </q-list>
          </q-tab-panel>
          <q-tab-panel name="disabled" class="q-pa-none">
            <q-list class="">
              <q-item-label class="text-center q-pa-sm">
                <q-input dense rounded outlined v-model="search">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </q-item-label>
              <div style="height: 66vh; overflow: auto;">
                <q-item-label header class="text-center">{{ productDisabledList.length }} {{ t('inactive') }}</q-item-label>
                <span v-for="(product, index) in productDisabledList" :key="index" @click="selectProduct(product)">
                  <product-item :name="product.name" :code="product.code" />
                </span>
              </div>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
        <q-tabs v-model="tab" dense class="bg-grey-3" align="justify">
          <q-tab name="all" icon="check_circle_outline" class="text-capitalize" :label="t('active')"></q-tab>
          <q-tab name="disabled" icon="block" class="text-capitalize" :label="t('inactive')"></q-tab>
        </q-tabs>
      </div>
      <transition v-else appear enter-active-class="animated bounceInRight">
        <q-card class="no-border no-border">
          <q-toolbar class="text-black">
            <q-item class="q-subtitle-1 q-pa-lg">
              <q-item-section>
                <q-item-label lines="1">{{ selectedProduct.name }}</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">{{ selectedProduct.code }}</span>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-space />
            <q-btn round flat icon="delete" color="red" @click="confirmDelete(selectedProduct.id)" :disabled="!tablePermissions.product.d"></q-btn>
            <q-btn round flat icon="edit" @click="showAdd(selectedProduct.id)" color="blue" :disabled="!tablePermissions.product.u" />
            <q-btn round flat icon="keyboard_backspace" @click="selectProduct({})" />
          </q-toolbar>
          <q-separator></q-separator>
          <q-item clickable v-ripple v-for="(description, index) in descriptions" :key="index">
            <q-item-section avatar top>
              <q-avatar icon="description" color="grey-2" text-color="grey-8"/>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ description.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </transition>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="green" @click="showAdd(0)" :disabled="!tablePermissions.product.c" />
    </q-page-sticky>
    <q-dialog v-model="showProductForm">
      <product-dialog :productId="productId" @closeMeEvent="handleCloseDialog"></product-dialog>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, defineAsyncComponent, onMounted, computed } from 'vue';
import { useProductStore } from "src/stores/product-store";
import { useI18n } from 'vue-i18n';
import { useAuthStore } from "src/stores/auth-store";

const { t, locale } = useI18n();
const UserDetailItem = defineAsyncComponent(() => import('components/UserDetailItem.vue'));
const ProductItem = defineAsyncComponent(() => import('components/ProductItem.vue'));
const ProductDialog = defineAsyncComponent(() => import('components/ProductDialog.vue'));

const productStore = useProductStore();
const authStore = useAuthStore();

const detailList = [
  {
    icon: 'description',
    label: 'description',
    field: 'description',
    textColor: 'grey-8'
  },
];

const $q = useQuasar();
const tab = ref('all');
const search = ref('');
const loading = ref(false);
const showProductForm = ref(false);
const errors = ref({});
const productId = ref(0);

const loadProducts = async () => {
  loading.value = true;
  $q.loading.show();
  await productStore.listProducts();
  console.log('products', productStore.getProducts);
  loading.value = false;
  $q.loading.hide();
};

const selectProduct = async (product) => {
  loading.value = true;
  await productStore.retrieveProduct(product?.id || 0);
  await productStore.listDescriptions(product?.id || 0);
  loading.value = false;
};

onMounted(() => {
  loadProducts();
});

const productList = computed({
  get: () => {
    const activeList = productStore.getProducts;
    if (search.value) {
      const searchText = search.value.toLowerCase();
      return activeList.filter((p) => p.code.toLowerCase().includes(searchText) || p.name.toLowerCase().includes(searchText));
    }
    return activeList;
  },
});

const selectedProduct = computed({
  get: () => productStore.getCurrentProduct,
});

const descriptions = computed({
  get: () => productStore.getDescriptions.filter((d) => d.product === selectedProduct.value.id),
});

const selectedProductView = computed({
  get: () => {
    if (!selectedProduct.value) {
      return {};
    }
    const product = selectedProduct.value;
    const description = descriptions.value.filter((d) => d.product === product.id)[0];
    return {
      description: description?.description,
    };
  },
});

const showAdd = (productIdToEdit) => {
  productId.value = productIdToEdit;
  showProductForm.value = true;
};

const handleCloseDialog = (isSaved) => {
  showProductForm.value = false;
  if (isSaved) loadProducts();
};

const confirmDelete = (productId) => {
  $q.dialog({
    title: t('confirm'),
    message: t('confirmDeleteProduct'),
    cancel: true,
    persistent: false,
  }).onOk(async () => {
    try {
      loading.value = true;
      await productStore.deleteProduct(productId);
      loadProducts();
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

const tablePermissions = computed({
  get: () => {
    return authStore.getPermissions.tables;
  },
});
</script>

<style scoped>
.card-bg {
  background-color: #2a313b;
}
.center {
  margin-left: auto;
  margin-right: auto;
}
[v-cloak] {
  display: none !important;
}
</style>
