<template>
  <q-page class="q-pa-sm bg-white">
    <!-- <q-resize-observer @resize="onResize"/> -->
    <div class="row" v-if="!$q.screen.lt.md">
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="no-shadow" bordered style="min-height: 88vh;">
          <q-tab-panels v-model="tab" animated class="bg-white">
            <q-tab-panel name="all" class="q-pa-none full-height" style="max-height: 77vh;">
              <q-list class="" style="min-height: 75vh;">
                <q-item-label class="text-center q-pa-sm">
                  <q-input dense rounded outlined v-model="search">
                    <template v-slot:append>
                      <q-icon name="search"/>
                    </template>
                  </q-input>
                </q-item-label>
                <div style="height: 66vh; overflow: auto;">
                  <q-item-label header class="text-center">{{ vendorActiveList.length }} {{ t('uVendors') }}</q-item-label>
                  <span v-for="(vendor, index) in vendorActiveList" :key="index" @click="selectVendor(vendor)">
                    <vendor-item
                      :name="vendor.name" :phone="vendor.phone1"></vendor-item>
                  </span>
                </div>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="disabled" class="q-pa-none">
              <q-list class="">

                <q-item-label class="text-center q-pa-sm">
                  <q-input dense rounded outlined v-model="search">
                    <template v-slot:append>
                      <q-icon name="search"/>
                    </template>
                  </q-input>
                </q-item-label>
                <div style="height: 66vh; overflow: auto;">
                  <q-item-label header class="text-center">{{ vendorDisabledList.length }} {{ t('inactive') }}</q-item-label>
                  <span v-for="(vendor, index) in vendorDisabledList" :key="index" @click="selectVendor(vendor)">
                    <vendor-item
                      :name="vendor.name" :phone="vendor.phone1"></vendor-item>
                  </span>
                </div>
              </q-list>
            </q-tab-panel>

          </q-tab-panels>

          <q-tabs
            v-model="tab"
            dense
            class="bg-grey-3"
            align="justify"
          >
            <q-tab name="all" icon="check_circle_outline" class="text-capitalize" :label="t('active')"></q-tab>
            <q-tab name="disabled" icon="block" class="text-capitalize" :label="t('inactive')"></q-tab>
          </q-tabs>
        </q-card>
      </div>
      <div class="col-lg-8 q-pl-xs col-md-8 col-sm-12 col-xs-12">
        <q-card class="no-shadow" bordered style="min-height: 88vh;">
          <q-toolbar class="text-black ">
            <q-item class="q-subtitle-1 q-pl-md">
              <q-item-section>
                <q-item-label lines="1">{{ selectedVendor.name || t('vendors') }}</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">{{ selectedVendor.phone1 }}</span>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-space/>
            <div v-if="selectedVendor.id">
              <q-btn round flat icon="delete" color="red" @click="confirmDelete(selectedVendor.id)"
              :disabled="!tablePermissions.vendor.d"></q-btn>
              <q-btn round flat icon="edit" color="primary" @click="showAdd(selectedVendor.id)"
              :disabled="!tablePermissions.vendor.u">
                <q-tooltip>{{ t('editThisUser') }}</q-tooltip>
              </q-btn>
            </div>

          </q-toolbar>
          <q-separator></q-separator>

          <div v-for="(detail, detailIndex) in detailList" :key="detailIndex">

            <user-detail-item :icon="detail.icon" :textColor="detail.textColor"
              :value="selectedVendor[detail['field']]" :label="t(detail.label)"></user-detail-item>

            <q-separator inset="item" v-if="detailIndex!=detailList.length-1"></q-separator>
          </div>

        </q-card>
      </div>
    </div>

    <div v-else>
      <div v-if="(selectedVendor.id || 0) === 0">
        <q-tab-panels v-model="tab" animated class="bg-white">
          <q-tab-panel name="all" class="q-pa-none full-height" style="max-height: 77vh;">
            <q-list class="">
              <q-item-label class="text-center q-pa-sm">
                <q-input dense rounded outlined v-model="search">
                  <template v-slot:append>
                    <q-icon name="search"/>
                  </template>
                </q-input>
              </q-item-label>
              <div style="height: 66vh; overflow: auto;">
                <q-item-label header class="text-center">{{ vendorActiveList.length }} {{ t('uVendors') }}</q-item-label>
                <span v-for="(vendor, index) in vendorActiveList" :key="index" @click="selectVendor(vendor)">
                  <vendor-item
                    :name="vendor.name" :phone="vendor.phone1"></vendor-item>
                </span>
              </div>
            </q-list>
          </q-tab-panel>

          <q-tab-panel name="disabled" class="q-pa-none">
            <q-list class="">

              <q-item-label class="text-center q-pa-sm">
                <q-input dense rounded outlined v-model="search">
                  <template v-slot:append>
                    <q-icon name="search"/>
                  </template>
                </q-input>
              </q-item-label>
              <div style="height: 66vh; overflow: auto;">
                <q-item-label header class="text-center">{{ vendorDisabledList.length }} {{ t('inactive') }}</q-item-label>
                <span v-for="(vendor, index) in vendorDisabledList" :key="index" @click="selectVendor(vendor)">
                  <vendor-item
                    :name="vendor.name" :phone="vendor.phone1"></vendor-item>
                </span>
              </div>
            </q-list>
          </q-tab-panel>

        </q-tab-panels>
        <q-tabs
          v-model="tab"
          dense
          class="bg-grey-3"
          align="justify"
        >
          <q-tab name="all" icon="check_circle_outline" class="text-capitalize" :label="t('active')"></q-tab>
          <q-tab name="disabled" icon="block" class="text-capitalize" :label="t('inactive')"></q-tab>
        </q-tabs>
      </div>
      <transition v-else
        appear
        enter-active-class="animated bounceInRight"
      >
        <q-card class="no-border no-border">
          <q-toolbar class="text-black ">
            <q-item class="q-subtitle-1 q-pl-md">
              <q-item-section>
                <q-item-label lines="1">{{ selectedVendor.name }}</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">{{ selectedVendor.code }}</span>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-space/>
            <q-btn round flat icon="delete" color="red" @click="confirmDelete(selectedVendor.id)"
            :disabled="!tablePermissions.vendor.d">
            </q-btn>
            <q-btn round flat icon="edit" @click="showAdd(selectedVendor.id)"
            color="blue"
            :disabled="!tablePermissions.vendor.u"/>
            <q-btn round flat icon="keyboard_backspace" @click="selectVendor({})"/>

          </q-toolbar>
          <q-separator></q-separator>

          <div v-for="(detail, detailIndex) in detailList" :key="detailIndex">

            <user-detail-item :icon="detail.icon" :textColor="detail.textColor"
              :value="selectedVendor[detail['field']]" :label="t(detail.label)"></user-detail-item>

            <q-separator inset="item" v-if="detailIndex!=detailList.length-1"></q-separator>
          </div>
        </q-card>
      </transition>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="green" @click="showAdd(0)"
      :disabled="!tablePermissions.vendor.c"/>
    </q-page-sticky>
    <q-dialog v-model="showVendorForm">
      <vendor-dialog :vendorId="vendorId" @closeMeEvent="handleCloseDialog"></vendor-dialog>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, defineAsyncComponent, onMounted, computed } from 'vue';
import { useVendorStore } from "src/stores/vendor-store";
import { useAuthStore } from "src/stores/auth-store";
import { useI18n } from 'vue-i18n';


const { t, locale } = useI18n();
const UserDetailItem = defineAsyncComponent(() => import('components/UserDetailItem.vue'));
const VendorItem = defineAsyncComponent(() => import('components/VendorItem.vue'));
const VendorDialog = defineAsyncComponent(() => import('components/VendorDialog.vue'));

const vendorStore = useVendorStore();
const authStore = useAuthStore();

const detailList = [
  {
    icon: 'fingerprint',
    label: 'id',
    field: 'id',
    textColor: 'blue'
  },
  {
    icon: 'person',
    label: 'name',
    field: 'name',
    textColor: 'blue'
  },
  {
    icon: 'phone',
    label: 'phone',
    field: 'phone',
    textColor: 'blue'
  },
  {
    icon: 'account_balance_wallet',
    label: 'instapay',
    field: 'instapay',
    textColor: 'orange'
  },
  {
    icon: 'account_balance',
    label: 'bankAccount',
    field: 'bank_account',
    textColor: 'grey-8'
  },
  {
    icon: 'check',
    label: 'active',
    field: 'is_active',
    textColor: 'grey-8'
  },
];


const $q = useQuasar();
const tab = ref('all');
const search = ref('');
const loading = ref(false);
const showVendorForm = ref(false);
const errors = ref({});
const vendorId = ref(0);

const loadVendors = async() => {
  loading.value = true;
  await vendorStore.listShortVendors();
  loading.value = false;
};

const selectVendor = async(vendor) => {
  loading.value = true;
  await vendorStore.retrieveVendor(vendor?.id || 0);
  loading.value = false;
};

onMounted(() => {
  loadVendors();
});

const vendorActiveList = computed({
  get: () => {
    const activeList = vendorStore.getVendorsShort.filter((p) => p.is_active) || [];
    if (search.value) {
      const searchText = search.value.toLowerCase();
      return activeList.filter((p) => p.name.toLowerCase().includes(searchText)
        || p.phone1?.toLowerCase().includes(searchText));
    }
    return activeList;
  },
});



const vendorDisabledList = computed({
  get: () => {
    const activeList = vendorStore.getVendorsShort.filter((p) => !p.is_active) || [];
    if (search.value) {
      const searchText = search.value.toLowerCase();
      return activeList.filter((p) => p.name.toLowerCase().includes(searchText)
        || p.phone1?.toLowerCase().includes(searchText));
    }
    return activeList;
  },
});


const selectedVendor = computed({
  get: () => {
    const selected = vendorStore.getCurrentVendor;
    selected['code'] = selected?.id?.toString() || '';
    return selected;
  },
});

const showAdd = (vendorIdToEdit) => {
  vendorId.value = vendorIdToEdit;
  showVendorForm.value = true;
};

const showOpeningBalanceForm = ref(false);
const showOpeningBalance = (vendorIdToEdit) => {
  vendorId.value = vendorIdToEdit;
  showOpeningBalanceForm.value = true;
};

const handleCloseDialog = (isSaved) => {
  showVendorForm.value = false;
  showOpeningBalanceForm.value = false;
  if (isSaved) loadVendors();
};

const confirmDelete = (vendorId) => {
  $q.dialog({
    title: t('onfirm'),
    message: t('confirmDeleteVendor'),
    cancel: true,
    persistent: false,
  }).onOk(async() => {
    try {
      loading.value = true;
      await vendorStore.deleteVendor(vendorId);
      loadVendors();
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
