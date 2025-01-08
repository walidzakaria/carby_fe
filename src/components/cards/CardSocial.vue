<template>
  <q-card class="bg-transparent no-shadow no-border" bordered>
    <q-card-section class="q-pa-none">
      <div class="row q-col-gutter-sm ">
        <div v-for="(item, index) in items" :key="index" class="col-md-3 col-sm-12 col-xs-12">
          <q-item :style="`background-color: ${item.color1}`" class="q-pa-none">
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">{{ item.value }}</q-item-label>
              <q-item-label>{{ t(item.title) }}</q-item-label>
            </q-item-section>
            <q-item-section side class="q-mr-md text-white">
              <q-icon :name="item.icon" color="white" size="44px"></q-icon>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useDashboardStore } from 'src/stores/dashboard-store';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();

const dashboardStore = useDashboardStore();
const items = ref([
  {
    title: "monthlyIncome",
    icon: "attach_money",
    value: "L.E. 0.00k",
    color1: "#546bfa",
    color2: "#3e51b5"
  },
  {
    title: "weeklySales",
    icon: "shopping_cart",
    value: "0.00",
    color1: "#3a9688",
    color2: "#3e51b5"
  },
  {
    title: "activeVendors",
    icon: "diversity_3",
    value: "0",
    color1: "#7cb342",
    color2: "#3e51b5"
  },
  {
    title: "activeUsers",
    icon: "person",
    value: "0",
    color1: "#f88c2b",
    color2: "#3e51b5"
  }
]);

onMounted(async() => {
  const userCount = await dashboardStore.userCount();
  items.value[3].value = userCount;
  const vendorCount = await dashboardStore.vendorCount();
  items.value[2].value = vendorCount;
  const weeklySales = await dashboardStore.weeklySales();
  items.value[1].value = (weeklySales || 0).toFixed(2);
  const montlyIncome = await dashboardStore.monthlyIncome();
  items.value[0].value = `${(montlyIncome / 1000).toFixed(2)}k`;
});
</script>
