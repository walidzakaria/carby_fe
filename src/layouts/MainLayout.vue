<template>
    <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-grey-9 text-white">
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title @click="goToHome" style="cursor: pointer;">
            <q-icon :style="$q.screen.lt.sm ? 'height: 40px; width: 40px;' : 'width: 150px; padding: 8px 0; margin-left: -20px;'">
            <img
              :src="$q.screen.lt.sm ? androidChrome : loginLogo"
              alt="logo"
              :style="$q.screen.lt.sm ? '' : 'min-height: 50px; background-color: #c9c9c9; border-radius: 50px;'">
            </q-icon>
        </q-toolbar-title>
        <q-space/>
        <q-btn-dropdown
          color="white"
          label=""
          no-caps
          flat
          dense
          icon="language"
          ref="langDropdown"
        >
        <q-list>
            <q-item
              key="enUS"
              clickable
              :class="{ 'lang-selected': currentLocale === 'en' }"
              @click="selectLanguage('en'); $refs.langDropdown.hide()"
            >
              <q-item-section avatar>
          <q-icon>
            <img src="~assets/icons/en.svg" alt="english" height="20px">
          </q-icon>
              </q-item-section>
              <q-item-section>English</q-item-section>
            </q-item>
          </q-list>
          <q-list>
            <q-item
              key="arEG"
              clickable
              :class="{ 'lang-selected': currentLocale === 'ar' }"
              @click="selectLanguage('ar'); $refs.langDropdown.hide()"
            >
              <q-item-section avatar>
          <q-icon>
            <img src="~assets/icons/eg.svg" alt="arabic">
          </q-icon>
              </q-item-section>
              <q-item-section>العربية</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="white" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="$q.fullscreen.toggle()"
            v-if="$q.screen.gt.sm">
          </q-btn>
          <!-- <q-btn round dense flat color="white" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              5
            </q-badge>
            <q-menu
            >
              <q-list style="min-width: 100px">
                <messages></messages>
                <q-card class="text-center no-shadow no-border">
                  <q-btn label="View All" style="max-width: 120px !important;" flat dense
                         class="text-indigo-8"></q-btn>
                </q-card>
              </q-list>
            </q-menu>
          </q-btn> -->
          <q-btn round flat>
            <q-avatar size="26px">
              <img :src="userProfile">
            </q-avatar>
            <q-menu
            >
              <q-list style="min-width: 100px">
                <UserMenu />
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-9 text-white"
      :width="220"
    >
      <q-list>
        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('dashboard') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/users" active-class="q-item-no-link-highlighting"
          v-if="pagePermitted('users')">
          <q-item-section avatar>
            <q-icon name="person"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('users') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/products" active-class="q-item-no-link-highlighting"
          v-if="pagePermitted('products')">
          <q-item-section avatar>
            <q-icon name="check_circle_outline"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('products') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/vendors" active-class="q-item-no-link-highlighting"
          v-if="pagePermitted('vendors')">
          <q-item-section avatar>
            <q-icon name="diversity_3"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('vendors') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/customers" active-class="q-item-no-link-highlighting"
        v-if="pagePermitted('customers')">
          <q-item-section avatar>
            <q-icon name="group"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('customers') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/sales" active-class="q-item-no-link-highlighting"
        v-if="pagePermitted('sales')">
          <q-item-section avatar>
            <q-icon name="shopping_cart"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('sales') }}</q-item-label>
          </q-item-section>
        </q-item>
        <!-- <q-item to="/cash" active-class="q-item-no-link-highlighting"
        v-if="pagePermitted('cash')">
          <q-item-section avatar>
            <q-icon name="account_balance_wallet"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('cash') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/currency" active-class="q-item-no-link-highlighting"
        v-if="pagePermitted('currency')">
          <q-item-section avatar>
            <q-icon name="currency_exchange"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t('currency') }}</q-item-label>
          </q-item-section>
        </q-item> -->
        <q-expansion-item
          icon="description"
          :label="t('reports')"
          v-if="permissions.is_admin || permissions.reports.length > 0"
        >
          <!-- <q-list class="q-pl-lg">
            <q-item to="/reports/daily" active-class="q-item-no-link-highlighting"
              v-if="reportPermitted('daily')">
              <q-item-section avatar>
                <q-icon name="calendar_today"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t('daily') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list class="q-pl-lg">
            <q-item to="/reports/sales" active-class="q-item-no-link-highlighting"
            v-if="reportPermitted('sales')">
              <q-item-section avatar>
                <q-icon name="bar_chart"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t('sales') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list class="q-pl-lg">
            <q-item to="/reports/inventory" active-class="q-item-no-link-highlighting"
            v-if="reportPermitted('inventory')">
              <q-item-section avatar>
                <q-icon name="inventory"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t('inventory') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list class="q-pl-lg">
            <q-item to="/reports/summary" active-class="q-item-no-link-highlighting"
            v-if="reportPermitted('summary')">
              <q-item-section avatar>
                <q-icon name="summarize"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t('summary') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list class="q-pl-lg">
            <q-item to="/reports/monitor" active-class="q-item-no-link-highlighting"
            v-if="reportPermitted('monitor')">
              <q-item-section avatar>
                <q-icon name="manage_search"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t('monitor') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list class="q-pl-lg">
            <q-item to="/reports/currency" active-class="q-item-no-link-highlighting"
            v-if="reportPermitted('currency')">
              <q-item-section avatar>
                <q-icon name="paid"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t('currency') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list class="q-pl-lg">
            <q-item to="/reports/credit" active-class="q-item-no-link-highlighting"
            v-if="reportPermitted('credit')">
              <q-item-section avatar>
                <q-icon name="money"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t('credit') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list class="q-pl-lg">
            <q-item to="/reports/debit" active-class="q-item-no-link-highlighting"
            v-if="reportPermitted('debit')">
              <q-item-section avatar>
                <q-icon name="real_estate_agent"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t('debit') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list> -->
        </q-expansion-item>
        <q-expansion-item
          icon="receipt_long"
          :label="t('finance')"
          v-if="pagePermitted('account') || pagePermitted('journalVoucher')"
        >
          <q-list class="q-pl-lg">
            <q-item to="/accounting/accounts" active-class="q-item-no-link-highlighting"
            v-if="pagePermitted('account')">
              <q-item-section avatar>
                <q-icon name="widgets"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t('accounts') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list class="q-pl-lg">
            <q-item to="/accounting/journal-vouchers" active-class="q-item-no-link-highlighting"
            v-if="pagePermitted('journalVoucher')">
              <q-item-section avatar>
                <q-icon name="receipt"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t('transactions') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import Messages from './MessagesPage.vue';
import UserMenu from './UserMenu.vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useVendorStore } from 'src/stores/vendor-store';
import { useCustomerStore } from 'src/stores/customer-store';
import { useProductStore } from 'src/stores/product-store';
import { useUnitStore } from 'src/stores/unit-store';

import { useRouter } from 'vue-router';

import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
import androidChrome from '../assets/android-chrome-512x512.png';
import loginLogo from '../assets/login-logo.svg';
import enLogo from '../assets/icons/en.svg';
import arLogo from '../assets/icons/eg.svg';


const authStore = useAuthStore();
const vendorStore = useVendorStore();
const customerStore = useCustomerStore();
const productStore = useProductStore();
const unitStore = useUnitStore();

const router = useRouter();

defineOptions({
  name: 'MainLayout'
})

const permissions = computed({
  get: () => {
    return authStore.getPermissions;
  },
});

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
let intervalId = null;
onMounted(async() => {
  const savedLocale = localStorage.getItem('locale') || 'ar';
  selectLanguage(savedLocale);
  await authStore.getInfo();
  console.log(authStore.getPermissions);
  await loadDefinitions();
  intervalId = setInterval(() => {
    authStore.heartbeat();
  }, 10000);

});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

const userProfile = computed({
  get: () => authStore.profile,
});

const userInfo = computed({
  get: () => authStore.userInfo,
  set: (value) => { authStore.userInfo = value; }
});

const loadDefinitions = async() => {

  await vendorStore.listShortVendors();
  await customerStore.listShortCustomers();
  await productStore.listProducts();
  await unitStore.listUnits();
};

document.documentElement.setAttribute('dir', 'rtl');
const currentLocale = ref(locale.value);

const selectLanguage = (lang) => {
  currentLocale.value = lang;
  locale.value = lang;
  localStorage.setItem('locale', locale.value);
};

const goToHome = () => {
  router.push('/');
};

const pagePermitted = (viewName) => {
  return permissions.value.is_admin || permissions.value.pages.includes(viewName);
};

const reportPermitted = (reportName) => {
  return permissions.value.is_admin || permissions.value.reports.includes(reportName);
};
</script>

<style scoped>
  .lang-selected {
    background-color: #ADCBE9;
  }
</style>
