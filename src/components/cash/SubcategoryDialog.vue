<template>
  <div>
    <q-card>
      <q-card-section class="text-h6 ">
        <div class="text-h6">{{ subcategoryId === 0 ? t('addCategory') : t('editCategory') }}</div>
      </q-card-section>
      <q-form @submit.prevent="saveCashSubcategory" class="q-gutter-md">
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-select
                  v-model="subcategoryInfo.cash_category"
                  :options="categories"
                  option-label="name"
                  option-value="id"
                  :label="t('category')"
                  emit-value
                  map-options
                  lazy-rules
                  :rules="[val => !!val || t('required')]"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="subcategoryInfo.name" :label="t('subcategoryName')"
                lazy-rules
                :rules="[val => !!val || t('required')]"
                :error="!!errors.name"
                :error-message="errors.name"
                autofocus
                />
              </q-item-section>
            </q-item>
          </q-list>
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
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useCashStore } from 'src/stores/cash-store';
const { t } = useI18n();

const cashStore = useCashStore();

const $q = useQuasar();
const emit = defineEmits(['closeMeEvent']);

const props = defineProps({
  subcategoryId: Number,
});

const categories = computed({
  get: () => cashStore.getCashCategories || [],
});


const subcategoryInfo = ref({
  id: null,
  name: null,
  cash_category: null,
});

const loading = ref(false);

const errors = ref({});
const saveCashSubcategory = async() => {
  try {
    if (props.subcategoryId > 0) {
      const response = await cashStore.putSubcategory(subcategoryInfo.value);
    } else {
      const response = await cashStore.postSubcategory(subcategoryInfo.value);
    }
    handleClose(true);
  } catch (error) {
    if (error.response.data.name) {
      errors.value.name = error.response.data.name.join(', ');
    }
    console.log(error);
  }
};

const handleClose = (isSaved) => {
  emit('closeMeEvent', isSaved);
};

onMounted(() => {
  if (props.subcategoryId > 0) {
    const selectedSubcategory = cashStore.getCashSubcategories.filter((c) => c.id === props.subcategoryId);
    subcategoryInfo.value.id = selectedSubcategory[0].id;
    subcategoryInfo.value.name = selectedSubcategory[0].name;
    subcategoryInfo.value.cash_category = selectedSubcategory[0].cash_category;
  }
});


</script>
