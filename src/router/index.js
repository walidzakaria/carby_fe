import { route } from 'quasar/wrappers';
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router';
import routes from './routes';
import { createPinia } from 'pinia';
import { useAuthStore } from 'src/stores/auth-store';
import { Loading } from 'quasar';

const pinia = createPinia();

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async(to, from, next) => {
    Loading.show();
    const authStore = useAuthStore();
    console.log('from', from.path);
    const isAuthenticated = authStore.isLogged;
    const infoLoaded = authStore.userInfo.id > 0;
    console.log('isAuthenticated', isAuthenticated);
    if (isAuthenticated && !infoLoaded) {
      try {
        await authStore.getInfo();
        console.log('permissions', authStore.permissions);
      } catch(error) {
        console.log(error);
        return next('/error');
      }
    }
    Loading.hide();
    if (to.meta.requiresAuth && !isAuthenticated) {
      return next('/login');
    }

    if (to.meta.requiresPermissions) {
      const { is_admin, reports, pages } = authStore.permissions;

      if (is_admin ||
        (to.meta.isReport && reports.includes(to.meta.name)) ||
        (!to.meta.isReport && pages.includes(to.meta.name))
      ) {
        next();
      } else {
          return next('/error');  // Redirect to an unauthorized page
        }
      } else {
        next();
      }
  });

  return Router;
});
