<template>
  <div style="width: 100%;">
    <q-card>
      <q-card-section class="text-h6 text-white bg-green">
        <div class="text-h6">{{ t('changePermissions') }}</div>
      </q-card-section>
      <q-form @submit.prevent="saveData" class="q-gutter-xs" style="margin: 0;">
        <div class="q-pa-xs">
          <div class="q-pa-md">
            <q-list bordered class="rounded-borders">
              <q-expansion-item
                expand-separator
                group="somegroup"
                icon="pages"
                header-class="text-blue"
                :label="t('pages')"
                :caption="t('userSelectedPages')"
              >
                <q-card>
                  <q-card-section>
                    <q-list class="row">
                      <q-item>
                        <q-item-section>
                          <q-toggle
                            label="Is Admin"
                            v-model="userInfo.is_admin"
                          />
                        </q-item-section>
                      </q-item>
                      <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12" v-if="!userInfo.is_admin">
                        <q-item-section>
                          <q-select
                            dense
                            v-model="userInfo.pages"
                            multiple
                            :options="pageOptions"
                            option-label="name"
                            option-value="id"
                            use-chips
                            stack-label
                            emit-value
                            map-options
                            :label="t('selectedPages')"
                          />
                        </q-item-section>
                      </q-item>
                      <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12" v-if="!userInfo.is_admin">
                        <q-item-section>
                          <q-select
                            dense
                            v-model="userInfo.reports"
                            multiple
                            :options="reportOptions"
                            option-label="name"
                            option-value="id"
                            use-chips
                            stack-label
                            emit-value
                            map-options
                            :label="t('selectedReports')"
                          />
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                expand-separator
                group="somegroup"
                icon="table_view"
                :label="t('tables')"
                :caption="t('userSelectedTables')"
                header-class="text-purple"
                :disable="userInfo.is_admin"
              >
                <q-card>
                  <q-card-section>
                    <q-markup-table class="no-shadow col-12" style="width: 100%;">
                      <thead>
                        <tr>
                          <th class="text-left">{{ t('tableName') }}</th>
                          <th class="text-right">{{ t('view') }}</th>
                          <th class="text-right">{{ t('create') }}</th>
                          <th class="text-right">{{ t('update') }}</th>
                          <th class="text-right">{{ t('delete') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(row, index) in tableData" :key="index">
                          <td class="text-left">{{ row.name }}</td>
                          <td class="text-right">
                            <q-checkbox
                              left-label
                              v-model="row.r"
                              label=""
                              checked-icon="task_alt"
                              unchecked-icon="highlight_off"
                            />
                          </td>
                          <td class="text-right">
                            <q-checkbox
                              left-label
                              v-model="row.c"
                              label=""
                              checked-icon="task_alt"
                              unchecked-icon="highlight_off"
                            />
                          </td>
                          <td class="text-right">
                            <q-checkbox
                              left-label
                              v-model="row.u"
                              label=""
                              checked-icon="task_alt"
                              unchecked-icon="highlight_off"
                            />
                          </td>
                          <td class="text-right">
                            <q-checkbox
                              left-label
                              v-model="row.d"
                              label=""
                              checked-icon="task_alt"
                              unchecked-icon="highlight_off"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>
          </div>
        </div>
        <q-card-section class="q-pa-sm">
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
            color="green"
            :loading="loading"
            style="min-width: 130px;"
            :label="t('save')">
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
        </q-form>
      </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from 'src/stores/user-store';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const $q = useQuasar();
const userStore = useUserStore();
const emit = defineEmits(['closeMeEvent']);

const props = defineProps({
  userId: Number,
});

let isOld = false;

const loading = ref(false);
const userInfo = ref({
  user: null,
  is_admin: false,
  pages: [],
  reports: [],
});

const pageOptions = ref([
  { id: 'dashboard', name: t('dashboard'), },
  { id: 'users', name: t('users'), },
  { id: 'products', name: t('products'), },
  { id: 'vendors', name: t('vendors'), },
  { id: 'customers', name: t('customers'), },
  { id: 'purchases', name: t('purchases'), },
  { id: 'sales', name: t('sales'), },
  { id: 'cash', name: t('cash'), },
  { id: 'currency', name: t('currency'), },
  { id: 'account', name: t('account'), },
  { id: 'journalVoucher', name: t('transaction') },
]);

const reportOptions = ref([
  { id: 'daily', name: t('daily'), },
  { id: 'sales', name: t('sales'), },
  { id: 'inventory', name: t('inventory'), },
  { id: 'summary', name: t('summary'), },
  { id: 'monitor', name: t('monitor'), },
  { id: 'currency', name: t('currency'), },
  { id: 'credit', name: t('credit'), },
  { id: 'debit', name: t('debit'), },
]);

const tableData = ref([
  { id: 'cashCategory', name: t('cashCategory'), r: true, c: false, u: false, d: false },
  { id: 'cashSubcategory', name: t('cashSubcategory'), r: true, c: false, u: false, d: false },
  { id: 'cash', name: t('cash'), r: true, c: false, u: false, d: false },
  { id: 'currency', name: t('currency'), r: true, c: false, u: false, d: false },
  { id: 'unit', name: t('unit'), r: true, c: false, u: false, d: false },
  { id: 'productCategory', name: t('productCategory'), r: true, c: false, u: false, d: false },
  { id: 'productSubcategory', name: t('productSubcategory'), r: true, c: false, u: false, d: false },
  { id: 'product', name: t('product'), r: true, c: false, u: false, d: false },
  { id: 'purchases', name: t('purchases'), r: false, c: false, u: false, d: false },
  { id: 'vendor', name: t('vendor'), r: true, c: false, u: false, d: false },
  { id: 'vendorBalance', name: t('vendorBalance'), r: true, c: false, u: false, d: false },
  { id: 'payment', name: t('payments'), r: true, c: false, u: false, d: false },
  { id: 'sales', name: t('sales'), r: false, c: false, u: false, d: false },
  { id: 'customer', name: t('customer'), r: true, c: false, u: false, d: false },
  { id: 'customerBalance', name: t('customerBalance'), r: true, c: false, u: false, d: false },
  { id: 'collection', name: t('collections'), r: true, c: false, u: false, d: false },
  { id: 'account', name: t('accounts'), r: false, c: false, u: false, d: false },
  { id: 'journalVoucher', name: t('transactions'), r: false, c: false, u: false, d: false },
]);

const saveData = async() => {
  loading.value = true;
  const tablesDict = tableData.value.reduce((acc, item) => {
    acc[item.id] = {
      r: item.r,
      c: item.c,
      u: item.u,
      d: item.d,
    };
    return acc;
  }, {});

  const newInfo = {
    pages: JSON.stringify(userInfo.value.pages),
    reports: JSON.stringify(userInfo.value.reports),
    tables: JSON.stringify(tablesDict),
    is_admin: userInfo.value.is_admin,
    user: props.userId,
  }

  console.log('newInfo', newInfo);
  try {
    if (isOld) {
      await userStore.updateUserViews(newInfo);
    } else {
      await userStore.createUserViews(newInfo);
    }

    loading.value = false;
    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: t('permissionsSaved'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    emit('closeMeEvent');
  } catch (error) {
    loading.value = false;
    console.log(error);
    $q.notify({
      type: 'negative',
      position: 'top-right',
      message: t('permissionsFailed'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
  }
};

const handleClose = () => {
  emit('closeMeEvent');
};

onMounted(async() => {
  const response = await userStore.getUserViews(props.userId);
  if (response) {
    isOld = true;
    userInfo.value = {
      user: response.user,
      is_admin: response.is_admin,
      pages: JSON.parse(response.pages),
      reports: JSON.parse(response.reports),
    };
    const tables = JSON.parse(response.tables);
    console.log('tables', tables);
    tableData.value.forEach((row) => {
      row.r = tables[row.id]?.r || false;
      row.c = tables[row.id]?.c || false;
      row.u = tables[row.id]?.u || false;
      row.d = tables[row.id]?.d || false;
    });
  }

});

</script>
