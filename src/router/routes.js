import { compile } from 'vue';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true, requiresPermissions: false, isReport: false, name: '' }, },
      { path: 'profile/', component: () => import('pages/ProfilePage.vue'),
        meta: { requiresAuth: true, requiresPermissions: false, isReport: false, name: '' }, },
      { path: 'users/', component: () => import('pages/UsersPage.vue'),
        meta: { requiresAuth: true, requiresPermissions: true, isReport: false, name: 'users' }, },
      { path: 'products/', component: () => import('pages/ProductsPage.vue'),
        meta: { requiresAuth: true, requiresPermissions: true, isReport: false, name: 'products' }, },
      { path: 'vendors/', component: () => import('pages/VendorPage.vue'),
        meta: { requiresAuth: true, requiresPermissions: true, isReport: false, name: 'vendors' }, },
      { path: 'customers/', component: () => import('pages/CustomerPage.vue'),
        meta: { requiresAuth: true, requiresPermissions: true, isReport: false, name: 'customers' }, },
      // { path: 'purchases/', component: () => import('pages/PurchasePage.vue'),
      //   meta: { requiresAuth: true, requiresPermissions: true, isReport: false, name: 'purchases' }, },
      // { path: 'purchases/:invoiceNumber', component: () => import('pages/PurchasePage.vue'),
      //   meta: { requiresAuth: true, requiresPermissions: true, isReport: false, name: 'purchases-invoice' }, },
      { path: 'sales/', component: () => import('pages/SalesIndex.vue'),
        meta: { requiresAuth: true, requiresPermissions: true, isReport: false, name: 'sales' }, },
      { path: 'sales/:invoiceNumber', component: () => import('pages/SalesPage.vue'),
        meta: { requiresAuth: true, requiresPermissions: true, isReport: false, name: 'sales-invoice' }, },
      // { path: 'cash/', component: () => import('pages/CashPage.vue'),
      //   meta: { requiresAuth: true, requiresPermissions: true, isReport: false, name: 'cash' }, },
      // { path: 'currency/', component: () => import('pages/CurrencyPage.vue'),
      //   meta: { requiresAuth: true, requiresPermissions: true, isReport: false, name: 'currency' }, },
      // { path: 'accounting/accounts', component: () => import('pages/AccountsPage.vue'),
      //     meta: { requiresAuth: true, requiresPermissions: true, isReport: false, name: 'account' }, },
      // { path: 'accounting/journal-vouchers', component: () => import('pages/JournalVoucherPage.vue'),
      //   meta: { requiresAuth: true, requiresPermissions: true, isReport: false, name: 'journalVoucher' }, },
    ]
  },
  // {
  //   path: '/reports/',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [
  //     { path: 'sales/', component: () => import('src/pages/reports/ReportSales.vue'),
  //       meta: { requiresAuth: true, requiresPermissions: true, isReport: true, name: 'sales' }, },
  //     { path: 'daily/', component: () => import('src/pages/reports/ReportDaily.vue'),
  //       meta: { requiresAuth: true, requiresPermissions: true, isReport: true, name: 'daily' }, },
  //     { path: 'inventory/', component: () => import('src/pages/reports/ReportInventory.vue'),
  //       meta: { requiresAuth: true, requiresPermissions: true, isReport: true, name: 'inventory' }, },
  //     { path: 'summary/', component: () => import('src/pages/reports/ReportSummarySales.vue'),
  //       meta: { requiresAuth: true, requiresPermissions: true, isReport: true, name: 'summary' }, },
  //     { path: 'monitor/', component: () => import('src/pages/reports/ReportProductMonitor.vue'),
  //       meta: { requiresAuth: true, requiresPermissions: true, isReport: true, name: 'monitor' }, },
  //     { path: 'currency/', component: () => import('src/pages/reports/ReportCurrency.vue'),
  //       meta: { requiresAuth: true, requiresPermissions: true, isReport: true, name: 'currency' }, },
  //     { path: 'credit/', component: () => import('src/pages/reports/ReportCredit.vue'),
  //       meta: { requiresAuth: true, requiresPermissions: true, isReport: true, name: 'credit' }, },
  //     { path: 'debit/', component: () => import('src/pages/reports/ReportDebit.vue'),
  //       meta: { requiresAuth: true, requiresPermissions: true, isReport: true, name: 'debit' }, },
  //   ]
  // },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/error',
    component: () => import('pages/ErrorOcurred.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes;
