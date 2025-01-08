<template>
  <div>
    <q-page class="q-pa-sm" v-if="permissions.is_admin || permissions.pages.includes('dashboard')">
      <card-social />
      <q-card class="q-mt-sm no-shadow" bordered>
        <q-card-section class="text-h6 q-pb-none">
          <q-item>
            <q-item-section avatar class="">
              <q-icon color="blue" name="bar_chart" size="44px"/>
            </q-item-section>

            <q-item-section>
              <div class="text-h6">{{ t('productSalesStats') }}</div>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section class="row">
          <div class="col-lg-7 col-sm-12 col-xs-12 col-md-7">
            <div class="row">
              <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6"
                v-for="(cat, index) in categorySales" :key="index">
                <q-item>

                  <q-item-section top avatar>
                    <q-avatar :color="cat.color" text-color="white" icon="question_mark"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label :class="`text-h6 text-${cat.color} text-bold`">{{ cat.quantity }}</q-item-label>
                    <q-item-label caption>{{ cat.category }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>
            <div>
              <ECharts :option="salesOptions"
                class="q-mt-md"
                :resizable="true"
                autoresize style="height: 250px;"
              />
            </div>
          </div>
          <div class="col-lg-5 col-sm-12 col-xs-12 col-md-5">
            <q-item>
              <q-item-section avatar class="">
                <q-icon color="blue" name="card_giftcard" class="q-pl-md" size="35px"/>
              </q-item-section>

              <q-item-section>
                <div class="text-h6">{{ t('todaySales') }}</div>
              </q-item-section>
            </q-item>
            <div>
              <ECharts :option="pieOptions"
                class="q-mt-md"
                :resizable="true"
                autoresize style="height: 250px;"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-page>
    <q-page class="flex flex-center" v-else>
      <img
        alt="Quasar logo"
        src="~assets/login-logo.svg"
        style="width: 300px; height: 190px"
      >

      <q-btn-dropdown
        color="primary"
        label="Language"
        no-caps
        flat
        icon="language"
      >
      <q-list>
          <q-item
            key="enUS"
            clickable
            :class="{ 'lang-selected': currentLocale === 'en' }"
            @click="selectLanguage('en')"
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
            @click="selectLanguage('ar')"
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
    </q-page>
  </div>
</template>

<script setup>
import { defineComponent, defineAsyncComponent, ref, onMounted, computed } from 'vue';
import * as echarts from 'echarts';
import ECharts from "vue-echarts";
import { useDashboardStore } from 'src/stores/dashboard-store';
import { useAuthStore } from 'src/stores/auth-store';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const authStore = useAuthStore();

const permissions = computed({
  get: () => {
    return authStore.getPermissions;
  },
});

const dashboardStore = useDashboardStore();
const CardSocial = defineAsyncComponent(() => import("components/cards/CardSocial.vue"));

const categoryColors = ['blue', 'grey-8', 'green-6', 'orange-8'];
const pieColors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#616161', '#e91e63', '#f57c00',];
const categorySales = ref([]);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const salesOptions = ref({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // Coordinate axis indicator, coordinate axis trigger is valid
      type: "shadow" // The default is a straight line, optional:'line' |'shadow'
    }
  },
  grid: {
    left: "2%",
    right: "2%",
    top: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: [
    {
      type: "category",
      data: [],
    }
  ],
  yAxis: [
    {
      type: "value",
      splitLine: {
        show: false
      }
    }
  ],
  series: []
});

const pieOptions = ref({
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)"
  },
  legend: {
    top: 'bottom',
    bottom: '5%',
    left: "center",
    data: []
  },
  series: [
    {
      name: "Sales",
      type: "pie",
      radius: ["50%", "70%"],
      center: ['50%', '35%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: "center"
      },
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1
      },
      emphasis: {
        label: {
          show: false,
          fontSize: "30",
          fontWeight: "bold"
        }
      },
      labelLine: {
        show: false
      },
      data: [],
    },
  ],
});

const loadCategorySales = async() => {
  // const response = await dashboardStore.categorySales();
  const response = [];
  const result = [];
  for (let x = 0; x < response.length; x++) {
    console.log(response[x], x % 4);
    const el = {
      category: response[x].category,
      quantity: response[x].quantity,
      color: categoryColors[x % 4],
    };
    result.push(el);
  }
  console.log('result', result);
  categorySales.value = result;
};

const loadCategoryDailySales = async() => {
  // const response = await dashboardStore.categoryDailySales();
  const response = [];
  const legendData = [];
  const seriesData = [];

  for (let x = 0; x < response.length; x++) {
    legendData.push(response[x].category);
    const el = {
      value: response[x].quantity,
      name: response[x].category,
      itemStyle: {
        color: pieColors[x % 8],
      },
    };
    seriesData.push(el);
  }
  pieOptions.value = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      top: 'bottom',
      bottom: '5%',
      left: "center",
      data: legendData,
    },
    series: [
      {
        name: "Sales",
        type: "pie",
        radius: ["50%", "70%"],
        center: ['50%', '35%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center"
        },
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            show: false,
            fontSize: "30",
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        },
          data: seriesData,
        },
      ],
    };
  };

const splitMonths = (inputArray) => {
  const splitPoint = new Date().getMonth() + 1;
  const firstPart = inputArray.slice(0, splitPoint);
  const secondPart = inputArray.slice(splitPoint);
  return secondPart.concat(firstPart);
};

const loadAnnualSales = async() => {
  // const lastYearMonths = splitMonths(months);
  // const response = await dashboardStore.annualSales();
  // const newData = [
  //   {name: "مشتريات", type: "bar", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], color: "#546bfa"},
  //   {name: "مبيعات", type: "bar", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], color: "#3a9688"},
  //   {name: "مصروفات", type: "bar", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], color: "#02a9f4"},
  //   {name: "إيرادات", type: "bar", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], color: "#f88c2b"},
  // ];
  // response.purchases.forEach((r) => {
  //   newData[0].data[parseInt(r.month, 10) - 1] = r.value;
  // });
  // response.sales.forEach((r) => {
  //   newData[1].data[parseInt(r.month, 10) - 1] = r.value;
  // });
  // response.expenses.forEach((r) => {
  //   newData[2].data[parseInt(r.month, 10) - 1] = r.value;
  // });
  // response.revenue.forEach((r) => {
  //   newData[3].data[parseInt(r.month, 10) - 1] = r.value;
  // });
  // newData.forEach((i) => {
  //   i.data = splitMonths(i.data);
  // });
  // salesOptions.value = {
  //   tooltip: {
  //     trigger: "axis",
  //     axisPointer: {
  //       // Coordinate axis indicator, coordinate axis trigger is valid
  //       type: "shadow" // The default is a straight line, optional:'line' |'shadow'
  //     }
  //   },
  //   grid: {
  //     left: "2%",
  //     right: "2%",
  //     top: "4%",
  //     bottom: "3%",
  //     containLabel: true
  //   },
  //   xAxis: [
  //     {
  //       type: "category",
  //       data: lastYearMonths,
  //     }
  //   ],
  //   yAxis: [
  //     {
  //       type: "value",
  //       splitLine: {
  //         show: false
  //       }
  //     }
  //   ],
  //   series: newData,
  // };
};
onMounted(async() =>{
  await loadCategorySales();
  await loadCategoryDailySales();
  await loadAnnualSales();
});
</script>
