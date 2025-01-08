<template>
  <div style="width: 100%;">
    <q-card>
      <q-card-section class="text-h6 text-white bg-green">
        <div class="text-h6">{{ t('openingBalances') }}</div>
      </q-card-section>
      <q-form @submit.prevent="saveData" class="q-gutter-xs" style="margin: 0;">
        <q-card-section class="q-pa-sm">
          <q-card>
            <q-card-section>
              <q-markup-table class="no-shadow col-12" style="width: 100%;">
                <thead>
                  <tr>
                    <th class="text-left">{{ t('branchName') }}</th>
                    <th class="text-right">{{ t('value') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in tableData" :key="index">
                    <td class="text-left">{{ row.branchName }}</td>
                    <td class="text-right">
                      <q-input dense outlined v-model="row.value"
                        type="number" min="0" step="0.01" @keydown="preventArrowKeys"
                      />
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-card-section>
          </q-card>
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
import { ref, onMounted, computed } from 'vue';
import { useBranchStore } from 'src/stores/branch-store';
import { useVendorStore } from 'src/stores/vendor-store';
import { useCustomerStore } from 'src/stores/customer-store';
import { useAuthStore } from 'src/stores/auth-store';

import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const $q = useQuasar();
const branchStore = useBranchStore();
const vendorStore = useVendorStore();
const customerStore = useCustomerStore();
const authStore = useAuthStore();

const branches = computed({
  get: () => {
    return branchStore.getBranches;
  }
});

const emit = defineEmits(['closeMeEvent']);

const props = defineProps({
  userId: Number,
  userType: String,
});


const loading = ref(false);
const tableData = ref([]);

const saveData = async() => {
  loading.value = true;

  const newInfo = {
    vendor: props.userId,
    customer: props.userId,
    balance: tableData.value.filter((b) => b.value !== null && b.value !== ''),
  };
  console.log('newInfo', newInfo);
  try {
    if (props.userType === 'customer') {
      await customerStore.createOpeningBalances(newInfo);
    } else {
      await vendorStore.createOpeningBalances(newInfo);
    }

    loading.value = false;
    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: t('balancesSaved'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    emit('closeMeEvent');
  } catch (error) {
    loading.value = false;
    if (error.status === 403) return;
    console.log(error);
    $q.notify({
      type: 'negative',
      position: 'top-right',
      message: t('balancesFailed'),
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
  let response = [];
  console.log('props', props.userId, props.userType);
  if (props.userType === 'customer') {
    response = await customerStore.listOpeningBalances(props.userId);
  } else {
    response = await vendorStore.listOpeningBalances(props.userId);
  }
  branches.value.forEach((b) => {
    const responseValue = response.filter((v) => v.branch === b.id);
    const oldValue = responseValue.length === 0 ? 0 : responseValue[0].value;
    tableData.value.push({
      branch: b.id,
      vendor: props.userId,
      customer: props.userId,
      branchName: b.name,
      value: oldValue,
    });
  });

});

const preventArrowKeys = (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
  }
};

const tablePermissions = computed({
  get: () => {
    return authStore.getPermissions.tables;
  },
});

</script>
