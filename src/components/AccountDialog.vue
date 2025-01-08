<template>
  <div>
    <q-card>
      <q-card-section class="text-h6 text-white bg-green">
        <div class="text-h6">{{ accountId === 0 ? t('addAccount') : t('editAccount') }}</div>
      </q-card-section>
      <q-form @submit.prevent="saveAccount" class="q-gutter-md">
          <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="accountInfo.name" :label="t('accountName')"
                lazy-rules
                :rules="[val => !!val || t('required')]"
                :error="!!errors.name"
                :error-message="errors.name"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="accountInfo.type"
                  :options="accountTypes"
                  option-label="name"
                  option-value="id"
                  :label="t('type')"
                  emit-value
                  map-options
                  dense
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="accountInfo.opening_balance" :label="t('openingBalance')"
                  type="number" min="0" step="0.01"
                  @keydown="preventArrowKeys"
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input type="textarea" rows="4" dense v-model="accountInfo.description" :label="t('description')"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-toggle
            v-model="accountInfo.is_active"
            checked-icon="check"
            color="green"
            :label="t('status')"
            unchecked-icon="clear"
          />
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
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAccountStore } from 'src/stores/account-store';
const { t, locale } = useI18n();

const accountStore = useAccountStore();


const $q = useQuasar();
const emit = defineEmits(['closeMeEvent']);

const props = defineProps({
  accountId: Number,
});

const accountInfo = ref({
  id: null,
  name: null,
  type: null,
  opening_balance: null,
  description: null,
  is_active: true,
});

const loading = ref(false);

const errors = ref({});
const saveAccount = async() => {
  loading.value = true;
  errors.value = {};

  try {
    let returnedId = 0;
    if (props.accountId === 0) {
      const response = await accountStore.createAccount(accountInfo.value);
      returnedId = response.id
    } else {
      const response = await accountStore.updateAccount(accountInfo.value);
      returnedId = props.accountId;
    }
    await accountStore.listAccounts();
    if (props.accountId > 0) {
      await accountStore.retrieveAccount(props.accountId);
    }

    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: t('accountSaved'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    handleClose(true);
  } catch (error) {
    if (error.status !== 403) {
      console.error(error);
      if (error.response && error.response.data) {
        errors.value = error.response.data;
        if (error.response.data.code) {
          errors.value.code = error.response.data.code.join(', ');
        }
        if (error.response.data.subcodes) {
          errors.value.codes = error.response.data.subcodes;
        }
        console.log(errors.value);
      }
      $q.notify({
        color: 'negative',
        position: 'top-right',
        message: t('saveFailed'),
        icon: 'report_problem',
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
    }
  } finally {
    loading.value = false;
  }

};

const handleClose = (isSaved) => {
  emit('closeMeEvent', isSaved);
};

onMounted(() => {
  if (props.accountId > 0) {
    const accountData = accountStore.getCurrentAccount;

    accountInfo.value.id = props.accountId;
    accountInfo.value.name = accountData.name;
    accountInfo.value.type = accountData.type;
    accountInfo.value.opening_balance = accountData.opening_balance;
    accountInfo.value.description = accountData.description;
    accountInfo.value.is_active = accountData.is_active;
  }
});

const accountTypes = ref([
  { id: 'Cash', name: t('cashAccount') },
  { id: 'Bank', name: t('bankAccount') },
  { id: 'Other', name: t('otherAccount') },
]);

const preventArrowKeys = (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
  }
};

</script>


<style scoped>

.q-toggle {
  position: relative;
  margin-left: auto;
  margin-right: auto;
}
</style>
