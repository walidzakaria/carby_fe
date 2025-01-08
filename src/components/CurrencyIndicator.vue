<template>
  <div class="row">
    <q-tab-panels v-model="panel" animated class="bg-transparent no-shadow no-border col-12" bordered>
      <q-tab-panel v-for="(item, index) in currencyItems" :key="index" :name="item.name">
        <q-card class="bg-transparent no-shadow no-border" bordered>
          <q-card-section class="q-pa-none">
            <div class="row q-col-gutter-sm ">
              <div class="col-sm-12 col-xs-12">
                <q-item style="background-color: #E227DB;" class="q-pa-none">
                  <q-item-section side style="background-color: #3e51b5;"
                                  class="q-pa-lg q-mr-none text-white">
                    <q-icon name="credit_card" color="white" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class=" q-pa-md q-ml-none  text-white">
                    <q-item-label class="text-white text-h3 text-weight-bolder">{{ item.value }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
    <div class="q-pa-xs">
      <q-chip v-for="(item, index) in currencyItems" :key="index"
        clickable @click="panel = item.name;"
        :color="panel === item.name ? 'primary' : ''"
        :text-color="panel === item.name ? 'white' : ''"
        :icon="panel === item.name ? 'check' : 'bookmark'">
        {{ item.name }}
      </q-chip>
    </div>
  </div>
</template>
<script setup>
import { useCurrencyStore } from 'src/stores/currency-store';
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();

const currencyStore = useCurrencyStore();

const props = defineProps({
  totalAmount: Number,
});


const colorList = [
  {
    color1: "#5064b5",
    color2: "#3e51b5"
  },
  {
    color1: "#f37169",
    color2: "#f34636"
  },
  {
    color1: "#ea6a7f",
    color2: "#ea4b64"
  },
  {
    color1: "#a270b1",
    color2: "#9f52b1"
  },
]

const panel = ref();
const currencyItems = computed({
  get: () => {
    const currency = currencyStore.getCurrency || [];
    const result = [];
    for (let x= 0; x < currency.length; x++) {
      const newItem = {
        name: currency[x].name,
        value: ConvertToArabicNumbers((props.totalAmount / currency[x].rate).toFixed(2)),
        colors: colorList[ x % 4],
      };
      result.push(newItem);
    }
    return result;
  },
});

const ConvertToArabicNumbers = (num) => {
  if (locale.value !== 'ar') return num;
  const arabicNumbers = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
  return new String(num).replace(/[0123456789]/g, (d)=>{return arabicNumbers[d]}).replace('.', ',');
}

onMounted(() => {
  const localCurrency = currencyStore.getCurrency;
  console.log('local currency', localCurrency);
  if (localCurrency.length > 0) {
    panel.value = localCurrency[0].name;
  }
});
</script>
