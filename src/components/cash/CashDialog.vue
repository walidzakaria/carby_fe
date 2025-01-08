<template>
  <div>
    <q-card style="max-width: 500px;">
      <q-card-section class="text-h6 text-white" style="background-color: orange;">
        <div class="text-h6">
          <q-icon color="white" name="payments" />
          {{ transactionId === 0 ? t('addCash') : t('editCash') }}
        </div>
      </q-card-section>
      <q-form @submit.prevent="saveTransaction" class="q-gutter-xs" style="margin: 0;">
        <q-card-section class="q-pa-xs">
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="transactionInfo.branch"
                  :options="userBranches"
                  option-label="name"
                  option-value="id"
                  :label="`${t('branch')} *`"
                  emit-value
                  map-options
                  dense class="full-width"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="transactionInfo.cash_type"
                  :options="paymentType"
                  option-label="name"
                  option-value="id"
                  :label="`${t('paymentType')} *`"
                  emit-value
                  map-options
                  dense class="full-width"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="transactionInfo.cash_category"
                  :options="categories"
                  option-label="name"
                  option-value="id"
                  :label="`${t('category')} *`"
                  emit-value
                  map-options
                  dense class="full-width"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                />
              </q-item-section>
              <span style="display: inline-flex;">
                <div class="row">
                  <q-btn icon="add" color="green" size="xs" type="button" outline round
                    v-if="tablePermissions.cashCategory.c"
                    style="margin: auto;" @click="showAddCategory(0)">
                    <q-tooltip class="bg-accent">{{ t('addCategory') }}</q-tooltip>
                  </q-btn>
                  <q-btn icon="edit" color="orange" size="xs" :disable="!transactionInfo.cash_category"
                    v-if="tablePermissions.cashCategory.u"
                    type="button" outline round style="margin: auto;"
                    @click="showAddCategory(transactionInfo.cash_category)">
                    <q-tooltip class="bg-accent">{{ t('editCategory') }}</q-tooltip>
                  </q-btn>
                  <q-btn icon="delete" color="red" size="xs"
                    v-if="tablePermissions.cashCategory.d"
                    :disable="!transactionInfo.cash_category"
                    @click="confirmDeleteCategory(transactionInfo.cash_category)"
                    type="button" outline round style="margin: auto;">
                    <q-tooltip class="bg-accent">{{ t('deleteCategory') }}</q-tooltip>
                  </q-btn>
                </div>
              </span>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="transactionInfo.cash_subcategory"
                  :options="subcategories"
                  option-label="name"
                  option-value="id"
                  :label="`${t('subcategory')} *`"
                  emit-value
                  map-options
                  dense class="full-width"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                />
              </q-item-section>
              <span style="display: inline-flex;">
                <div class="row">
                  <q-btn icon="add" color="green" size="xs" type="button" outline round
                    v-if="tablePermissions.cashSubcategory.c"
                    style="margin: auto;" @click="showAddSubcategory(0)">
                    <q-tooltip class="bg-accent">{{ t('addSubcategory') }}</q-tooltip>
                  </q-btn>
                  <q-btn icon="edit" color="orange" size="xs" :disable="!transactionInfo.cash_subcategory"
                    v-if="tablePermissions.cashSubcategory.u"
                    type="button" outline round style="margin: auto;"
                    @click="showAddSubcategory(transactionInfo.cash_subcategory)">
                    <q-tooltip class="bg-accent">{{ t('editSubcategory') }}</q-tooltip>
                  </q-btn>
                  <q-btn icon="delete" color="red" size="xs"
                    :disable="!transactionInfo.cash_subcategory"
                    v-if="tablePermissions.cashSubcategory.d"
                    @click="confirmDeleteSubcategory(transactionInfo.cash_subcategory)"
                    type="button" outline round style="margin: auto;">
                    <q-tooltip class="bg-accent">{{ t('deleteSubcategory') }}</q-tooltip>
                  </q-btn>
                </div>
              </span>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input type="number" dense v-model="transactionInfo.value" :label="`${t('value')} *`"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                  @keydown="preventArrowKeys"
                  step="0.01"
                />
              </q-item-section>
              <q-item-section>
                <q-select
                  v-model="transactionInfo.currency"
                  :options="currency"
                  option-label="name"
                  option-value="id"
                  :label="`${t('currency')} *`"
                  emit-value
                  map-options
                  lazy-rules
                  dense
                  :rules="[val => !!val || t('required')]"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn class="text-capitalize text-white"
            type="button"
            color="grey"
            style="min-width: 130px;"
            :label="t('cancel')" @click="handleClose(false);">
          </q-btn>
          <q-btn class="text-capitalize text-white"
            type="submit"
            color="orange"
            :loading="loading"
            style="min-width: 130px;"
            :label="t('save')"
            :disabled="transactionId > 0 && !tablePermissions.cash.u">
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
    <q-dialog v-model="showCategoryForm">
      <category-dialog :categoryId="categoryToEdit" @closeMeEvent="handleCloseCategoryDialog"></category-dialog>
    </q-dialog>
    <q-dialog v-model="showSubcategoryForm">
      <subcategory-dialog :subcategoryId="subcategoryToEdit" @closeMeEvent="handleCloseSubcategoryDialog"></subcategory-dialog>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useBranchStore } from 'src/stores/branch-store';
import { useCurrencyStore } from 'src/stores/currency-store';
import { useCashStore } from 'src/stores/cash-store';
import { useAuthStore } from 'src/stores/auth-store';

const CategoryDialog = defineAsyncComponent(() => import('components/cash/CategoryDialog.vue'));
const SubcategoryDialog = defineAsyncComponent(() => import('components/cash/SubcategoryDialog.vue'));

const { t, locale } = useI18n();

const branchStore = useBranchStore();
const currencyStore = useCurrencyStore();
const cashStore = useCashStore();
const authStore = useAuthStore();

const $q = useQuasar();
const emit = defineEmits(['closeMeEvent']);

const props = defineProps({
  transactionId: Number,
});

const paymentType = ref([
  { id: 'Expense', name: t('expenses') },
  { id: 'Revenue', name: t('revenue') },
]);


const userBranches = computed({
  get: () => {
    const branches = branchStore.getBranches;
    const validBranches = branchStore.getUserBranches.map((ub) => ub.branch);
    return branches.filter((b) => validBranches.includes(b.id));
  },
});

const loadCategories = async() => {
  await cashStore.retrieveCashCategories();
};

const loadSubcategories = async() => {
  await cashStore.retrieveCashSubategories();
};


const transactionInfo = ref({
  id: null,
  branch: localStorage.getItem('selectedBranch') ? parseInt(localStorage.getItem('selectedBranch'), 10) : null,
  cash_type: 'Expense',
  cash_category: null,
  cash_subcategory: null,
  value: null,
  currency: null,
  exchange_rate: 1,
});

const loading = ref(false);
const errors = ref({});
const saveTransaction = async() => {
  const exchangeRate = currency.value.filter((c) => c.id === transactionInfo.value.currency)[0].rate;
  transactionInfo.value.exchange_rate = exchangeRate;
  try {
    if (props.transactionId > 0) {
      console.log(transactionInfo.value);
      await cashStore.updateTransaction(transactionInfo.value);
    } else {
      await cashStore.createTransaction(transactionInfo.value);
    }
    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: t('transactionSaved'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    handleClose(true);
  } catch (error) {
    console.log(error);
  }
};

const handleClose = (isSaved) => {
  emit('closeMeEvent', isSaved);
};

onMounted(async() => {
  await loadCategories();
  await loadSubcategories();
  console.log('table permissions', tablePermissions);
  if (props.transactionId > 0) {
    await cashStore.retrieveTransaction(props.transactionId);
    const response = cashStore.getCurrentTransaction;
    transactionInfo.value.id = response.id;
    transactionInfo.value.branch = response.branch;
    transactionInfo.value.value = response.value;
    transactionInfo.value.currency = response.currency;

    const subcategory = cashStore.getCashSubcategories.filter((s) => s.id === response.cash_subcategory)[0];
    const category = cashStore.getCashCategories.filter((c) => c.id === subcategory.cash_category)[0];
    console.log('category', category);
    console.log('subcategory', subcategory);
    transactionInfo.value.cash_type = category.cash_type;
    transactionInfo.value.cash_category = category.id;
    transactionInfo.value.cash_subcategory = subcategory.id;
  }
});

const preventArrowKeys = (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
  }
};

const currency = computed({
  get: () => { return currencyStore.getCurrency },
});


const categories = computed({
  get: () => {
    const cashCategories = cashStore.getCashCategories;
    return cashCategories.filter((c) => c.cash_type === transactionInfo.value.cash_type) || [];
  },
});

const subcategories = computed({
  get: () => {
    const cashSubcategories = cashStore.getCashSubcategories;
    return cashSubcategories.filter((s) => s.cash_category === transactionInfo.value.cash_category) || [];
  },
});

const categoryToEdit = ref(0);
const showCategoryForm = ref(false);
const showAddCategory = (categoryId) => {
  categoryToEdit.value = categoryId;
  showCategoryForm.value = true;
};

const subcategoryToEdit = ref(0);
const showSubcategoryForm = ref(false);
const showAddSubcategory = (subcategoryId) => {
  subcategoryToEdit.value = subcategoryId;
  showSubcategoryForm.value = true;
};

const handleCloseCategoryDialog = (isSaved) => {
  showCategoryForm.value = false;
  if (isSaved) {
    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: t('categorySaved'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    loadCategories();
  }
};

const handleCloseSubcategoryDialog = (isSaved) => {
  showSubcategoryForm.value = false;
  if (isSaved) {
    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: t('subcategorySaved'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    loadSubcategories();
  }
};

const confirmDeleteCategory = (categoryToDelete) => {
  $q.dialog({
    title: t('onfirm'),
    message: t('deleteCategoryConfirm'),
    cancel: true,
    persistent: false,
  }).onOk(async() => {
    try {
      await cashStore.deleteCategory(categoryToDelete);
      await loadCategories();
      transactionInfo.value.cash_category = null;
      $q.notify({
        type: 'positive',
        position: 'top-right',
        message: t('categoryDeleted'),
        progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
      });
    } catch(error) {
      if (error.status === 403) return;
      $q.notify({
        type: 'negative',
        position: 'top-right',
        message: t('categoryNotDeleted'),
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
    }
  });
};

const confirmDeleteSubcategory = (subcategoryToDelete) => {
  $q.dialog({
    title: t('onfirm'),
    message: t('deleteSubcategoryConfirm'),
    cancel: true,
    persistent: false,
  }).onOk(async() => {
    try {
      await cashStore.deleteSubcategory(subcategoryToDelete);
      await loadSubcategories();
      transactionInfo.value.cash_subcategory = null;
      $q.notify({
        type: 'positive',
        position: 'top-right',
        message: t('subcategoryDeleted'),
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
    } catch(error) {
      if (error.status === 403) return;
      console.log(error);
      $q.notify({
        type: 'negative',
        position: 'top-right',
        message: t('subcategoryNotDeleted'),
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
