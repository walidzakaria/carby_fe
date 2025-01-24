<template>
  <q-page class="q-pa-sm bg-white">
    <!-- <q-resize-observer @resize="onResize"/> -->
    <div class="row" v-if="!$q.screen.lt.md">
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="no-shadow" bordered style="min-height: 88vh">
          <q-tab-panels v-model="tab" animated class="bg-white">
            <q-tab-panel
              name="all"
              class="q-pa-none full-height"
              style="max-height: 77vh"
            >
              <q-list class="" style="min-height: 75vh">
                <q-item-label class="text-center q-pa-sm">
                  <q-input dense rounded outlined v-model="search">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </q-item-label>
                <div style="height: 66vh; overflow: auto">
                  <q-item-label header class="text-center"
                    >{{ accountActiveList.length }}
                    {{ t("uAccounts") }}</q-item-label
                  >
                  <span
                    v-for="(account, index) in accountActiveList"
                    :key="index"
                    @click="selectAccount(account)"
                  >
                    <account-item :name="account.name"></account-item>
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
                <div style="height: 66vh; overflow: auto">
                  <q-item-label header class="text-center"
                    >{{ accountDisabledList.length }}
                    {{ t("inactive") }}</q-item-label
                  >
                  <span
                    v-for="(account, index) in accountDisabledList"
                    :key="index"
                    @click="selectAccount(account)"
                  >
                    <account-item :name="account.name"></account-item>
                  </span>
                </div>
              </q-list>
            </q-tab-panel>
          </q-tab-panels>

          <q-tabs v-model="tab" dense class="bg-grey-3" align="justify">
            <q-tab
              name="all"
              icon="check_circle_outline"
              class="text-capitalize"
              :label="t('active')"
            ></q-tab>
            <q-tab
              name="disabled"
              icon="block"
              class="text-capitalize"
              :label="t('inactive')"
            ></q-tab>
          </q-tabs>
        </q-card>
      </div>
      <div class="col-lg-8 q-pl-xs col-md-8 col-sm-12 col-xs-12">
        <q-card class="no-shadow" bordered style="min-height: 88vh">
          <q-toolbar class="text-black">
            <q-item class="q-subtitle-1 q-pl-md">
              <q-item-section>
                <q-item-label lines="1">{{
                  selectedAccount.name || t("accounts")
                }}</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">{{
                    selectedAccount.phone1
                  }}</span>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-space />
            <div v-if="selectedAccount.id">
              <q-btn
                round
                flat
                icon="delete"
                color="red"
                @click="confirmDelete(selectedAccount.id)"
                :disabled="!tablePermissions.account.d"
              ></q-btn>
              <q-btn
                round
                flat
                icon="edit"
                color="primary"
                @click="showAdd(selectedAccount.id)"
                :disabled="!tablePermissions.account.u"
              >
                <q-tooltip>{{ t("editThisUser") }}</q-tooltip>
              </q-btn>
            </div>
          </q-toolbar>
          <q-separator></q-separator>

          <div v-for="(detail, detailIndex) in detailList" :key="detailIndex">
            <user-detail-item
              :icon="detail.icon"
              :textColor="detail.textColor"
              :value="selectedAccount[detail['field']]"
              :label="t(detail.label)"
            ></user-detail-item>

            <q-separator
              inset="item"
              v-if="detailIndex != detailList.length - 1"
            ></q-separator>
          </div>
        </q-card>
      </div>
    </div>

    <div v-else>
      <div v-if="(selectedAccount.id || 0) === 0">
        <q-tab-panels v-model="tab" animated class="bg-white">
          <q-tab-panel
            name="all"
            class="q-pa-none full-height"
            style="max-height: 77vh"
          >
            <q-list class="">
              <q-item-label class="text-center q-pa-sm">
                <q-input dense rounded outlined v-model="search">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </q-item-label>
              <div style="height: 66vh; overflow: auto">
                <q-item-label header class="text-center"
                  >{{ accountActiveList.length }}
                  {{ t("uAccounts") }}</q-item-label
                >
                <span
                  v-for="(account, index) in accountActiveList"
                  :key="index"
                  @click="selectAccount(account)"
                >
                  <account-item :name="account.name"></account-item>
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
              <div style="height: 66vh; overflow: auto">
                <q-item-label header class="text-center"
                  >{{ accountDisabledList.length }}
                  {{ t("inactive") }}</q-item-label
                >
                <span
                  v-for="(account, index) in accountDisabledList"
                  :key="index"
                  @click="selectAccount(account)"
                >
                  <account-item :name="account.name"></account-item>
                </span>
              </div>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
        <q-tabs v-model="tab" dense class="bg-grey-3" align="justify">
          <q-tab
            name="all"
            icon="check_circle_outline"
            class="text-capitalize"
            :label="t('active')"
          ></q-tab>
          <q-tab
            name="disabled"
            icon="block"
            class="text-capitalize"
            :label="t('inactive')"
          ></q-tab>
        </q-tabs>
      </div>
      <transition v-else appear enter-active-class="animated bounceInRight">
        <q-card class="no-border no-border">
          <q-toolbar class="text-black">
            <q-item class="q-subtitle-1 q-pl-md">
              <q-item-section>
                <q-item-label lines="1">{{
                  selectedAccount.name
                }}</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">{{
                    selectedAccount.code
                  }}</span>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-space />
            <q-btn
              round
              flat
              icon="delete"
              color="red"
              @click="confirmDelete(selectedAccount.id)"
              :disabled="!tablePermissions.account.d"
            >
            </q-btn>
            <q-btn
              round
              flat
              icon="edit"
              @click="showAdd(selectedAccount.id)"
              :disabled="!tablePermissions.account.u"
            />
            <q-btn
              round
              flat
              icon="keyboard_backspace"
              @click="selectAccount({})"
            />
          </q-toolbar>
          <q-separator></q-separator>

          <div v-for="(detail, detailIndex) in detailList" :key="detailIndex">
            <user-detail-item
              :icon="detail.icon"
              :textColor="detail.textColor"
              :value="selectedAccount[detail['field']]"
              :label="t(detail.label)"
            ></user-detail-item>

            <q-separator
              inset="item"
              v-if="detailIndex != detailList.length - 1"
            ></q-separator>
          </div>
        </q-card>
      </transition>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="green"
        @click="showAdd(0)"
        :disabled="!tablePermissions.account.c"
      />
    </q-page-sticky>
    <q-dialog v-model="showAccountForm">
      <account-dialog
        :accountId="accountId"
        @closeMeEvent="handleCloseDialog"
      ></account-dialog>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, defineAsyncComponent, onMounted, computed } from "vue";
import { useAccountStore } from "src/stores/account-store";
import { useAuthStore } from "src/stores/auth-store";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const UserDetailItem = defineAsyncComponent(() =>
  import("components/UserDetailItem.vue")
);
const AccountItem = defineAsyncComponent(() =>
  import("components/VendorItem.vue")
);
const AccountDialog = defineAsyncComponent(() =>
  import("components/AccountDialog.vue")
);

const accountStore = useAccountStore();
const authStore = useAuthStore();

const detailList = [
  {
    icon: "fingerprint",
    label: "id",
    field: "code",
    textColor: "blue",
  },
  {
    icon: "category",
    label: "type",
    field: "type",
    textColor: "blue",
  },
  {
    icon: "account_balance",
    label: "openingBalance",
    field: "opening_balance",
    textColor: "orange",
  },
  {
    icon: "description",
    label: "description",
    field: "description",
    textColor: "grey-8",
  },
  {
    icon: "check",
    label: "active",
    field: "status",
    textColor: "grey-8",
  },
];

const $q = useQuasar();
const tab = ref("all");
const search = ref("");
const loading = ref(false);
const showAccountForm = ref(false);
const errors = ref({});
const accountId = ref(0);

const loadAccounts = async () => {
  loading.value = true;
  await accountStore.listAccounts();
  loading.value = false;
};

const selectAccount = async (account) => {
  loading.value = true;
  await accountStore.retrieveAccount(account?.id || 0);
  loading.value = false;
};

onMounted(() => {
  loadAccounts();
});

const accountActiveList = computed({
  get: () => {
    const activeList =
      accountStore.getAccounts.filter((p) => p.is_active) || [];
    if (search.value) {
      const searchText = search.value.toLowerCase();
      return activeList.filter((p) =>
        p.name.toLowerCase().includes(searchText)
      );
    }
    return activeList;
  },
});

const accountDisabledList = computed({
  get: () => {
    const activeList =
      accountStore.getAccounts.filter((p) => !p.is_active) || [];
    if (search.value) {
      const searchText = search.value.toLowerCase();
      return activeList.filter((p) =>
        p.name.toLowerCase().includes(searchText)
      );
    }
    return activeList;
  },
});

const selectedAccount = computed({
  get: () => {
    const selected = accountStore.getCurrentAccount;
    selected["code"] = selected?.id?.toString() || "";
    return selected;
  },
});

const showAdd = (accountIdToEdit) => {
  accountId.value = accountIdToEdit;
  showAccountForm.value = true;
};

const handleCloseDialog = (isSaved) => {
  showAccountForm.value = false;
  if (isSaved) loadAccounts();
};

const confirmDelete = (accountId) => {
  $q.dialog({
    title: t("onfirm"),
    message: t("confirmDeleteAccount"),
    cancel: true,
    persistent: false,
  }).onOk(async () => {
    try {
      loading.value = true;
      await accountStore.deleteAccount(accountId);
      loadAccounts();
      loading.value = false;
      $q.notify({
        type: "positive",
        position: "top-right",
        message: t("deleteSucceeded"),
        progress: true,
        actions: [
          {
            icon: "close",
            color: "white",
            round: true,
            handler: () => {
              /* ... */
            },
          },
        ],
      });
    } catch (error) {
      if (error.status === 403) return;
      console.error(error);
      $q.notify({
        type: "positive",
        position: "top-right",
        message: t("failedToDelete"),
        progress: true,
        actions: [
          {
            icon: "close",
            color: "white",
            round: true,
            handler: () => {
              /* ... */
            },
          },
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
