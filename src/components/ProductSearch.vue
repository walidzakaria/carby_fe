<template>
  <div>
    <q-item>
      <q-item-section>
        <q-select
          v-if="showSearchProduct"
          rounded outlined
          ref="searchInput"
          v-model="selectedProduct"
          :options="productOptions"
          :label="t('searchProduct')"
          use-input
          input-debounce="0"
          @filter="filterFnProd"
          @input-value="setProduct"
          @keydown.prevent.enter="submit"
          option-label="name"
          option-value="id"
          options-selected-class="text-deep-orange"
          :display-value="selectedProduct ? `${selectedProduct.code} ${selectedProduct.name}` : ''"
          :loading="loading"
          autofocus
        >
        <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" @click="clickProductItem(scope.opt.code)">
              <q-item-section avatar>
                <q-avatar>
                  <img :src="scope.opt.image" alt="prod-image">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.name }}</q-item-label>
                <q-item-label caption>{{ scope.opt.code }} {{ scope.opt.additional_codes.length > 0 ? `, ${scope.opt.additional_codes.join(', ')}` : '' }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input v-else type="text" rounded outlined v-model="productCode" :label="t('enterCode')"
          lazy-rules
          @keydown.prevent.enter="enterCode"
          :loading="loading"
          ref="codeInput"
          autofocus
          :hint="selectedProduct?.name"
          >
          <template v-slot:append>
            <q-icon name="qr_code"/>
          </template>
        </q-input>
      </q-item-section>
      <q-item-section side>
        <q-toggle
          :label="showSearchProduct ? 'بحث' : 'كود'"
          v-model="showSearchProduct"
        />
      </q-item-section>
    </q-item>

    <q-dialog v-model="showProductForm" persistent>
      <product-dialog :productId="0" :code="productCode" @closeMeEvent="handleCloseDialog"></product-dialog>
    </q-dialog>

    <input type="text" ref="focusSpan" style="width: 0.1px; height: 0.1px; color: white; padding: 0;">
    <span style="background-color: white; height: 10px; width: 5px; display: inline-block; margin-left: -5px; margin-top: 0;"></span>
  </div>
</template>

<script setup>

import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useProductStore } from 'src/stores/product-store';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';

const ProductDialog = defineAsyncComponent(() => import('components/ProductDialog.vue'));

const { t } = useI18n();
const productStore = useProductStore();
const $q = useQuasar();
const authStore = useAuthStore();

const selectedProduct = ref(null);
const productOptions = ref([]);

const productList = computed({
  get: () => {
    return productStore.getProductsShort.filter((p) => p.is_active) || [];
  },
});

const props = defineProps({
  autohide: {
    type: Boolean,
    required: false,
    default: false,
  },
  showSearch: {
    type: Boolean,
    required: false,
    default: false,
  },
  allowAdd: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const loading = ref(false);

const filterFnProd = (val, update, abort) => {
  if (val === '') {
    update(() => {
      productOptions.value = productList.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase()
    productOptions.value = productList.value.filter(
      (v) => v.code.includes(needle)
      || v.name.toLowerCase().includes(needle)
      || v.additional_codes.some((a) => a.includes(needle))
    );

  });
};

const clickProductItem = () => {
  if (selectedProduct.value) {
    submit();
  }
};

const setProduct =  (val) => {
  const selection = productList.value.filter(
    (p) => p.code.toLowerCase() === val.toLowerCase()
    || p.name.toLowerCase() === val.toLowerCase()
    || p.additional_codes.includes(val.toLowerCase())
  );
  if (selection.length === 1) {
    selectedProduct.value = selection[0];
  }

};


const emit = defineEmits(['submitProduct']);

const focusSpan = ref();
const submit = async() => {
  if (loading.value) return;
  console.log('submit');
  loading.value = true;
  if (selectedProduct.value) {
    emit('submitProduct', selectedProduct.value);
  }
  if (props.autohide) {
    selectedProduct.value = null;
    productCode.value = '';
    focusSpan.value.focus();
  }
  loading.value = false;
};

const clear = () => {
  selectedProduct.value = null;
  productCode.value = '';
};


const searchInput = ref();
const focusSearch = () => {
  if (showSearchProduct.value) {
    searchInput.value.focus();
  } else {
    codeInput.value.focus();
  }
};


const showSearchProduct = ref(false);
const codeInput = ref();
const productCode = ref('');

const showProductForm = ref(false);

const enterCode = async() => {
  if (productCode.value === '') return;
  const foundProduct = productList.value.filter(
    (p) => p.code === productCode.value
    || p.additional_codes.includes(productCode.value)
  );
  console.log(foundProduct);
  if (foundProduct.length === 1) {
    selectedProduct.value = foundProduct[0];
    await submit();
  } else {

    if (props.allowAdd && tablePermissions.value.product.c) {
      $q.dialog({
        title: t('onfirm'),
        message: t('confirmAddProduct'),
        cancel: true,
        persistent: false,
      }).onOk(async() => {
        showProductForm.value = true;
      });
    } else {
      $q.notify({
      progress: true,
      type: 'warning',
      position: 'bottom',
      message: t('invalidCode'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    }
  }
};

const loadProducts = async() => {
  loading.value = true;
  $q.loading.show();
  await productStore.listShortProducts();
  loading.value = false;
  $q.loading.hide();
};

const handleCloseDialog = async(isSaved) => {
  showProductForm.value = false;
  if (isSaved) {
    await loadProducts();
    enterCode();
  }
};


defineExpose({
  clear,
  focusSearch,
  enterCode,
});

onMounted(() => {
  showSearchProduct.value = props.showSearch;
});

const tablePermissions = computed({
  get: () => {
    return authStore.getPermissions.tables;
  },
});

</script>
