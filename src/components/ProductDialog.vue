<template>
  <div :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <q-card>
      <q-card-section class="text-h6 text-white bg-green">
        <div class="text-h6">{{ productId === 0 ? t('addProduct') : t('editProduct') }}</div>
      </q-card-section>
      <q-form @submit.prevent="saveProduct" class="q-gutter-xs" style="margin: 0;">
        <q-card-section class="q-pa-xs">
          <q-list class="row">
            <q-item class="col-lg-6 col-md-6 col-sm-10 col-xs-10">
              <q-item-section>
                <q-input type="text" dense v-model="productInfo.code" :label="t('code')"
                  lazy-rules
                  @keydown.prevent.enter="handleEnter"
                  :rules="[val => !!val || t('required')]"
                  :error="!!errors.code"
                  :error-message="errors.code"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-10 col-xs-10">
              <q-item-section>
                <q-input dense v-model="productInfo.name" :label="t('productName')"
                lazy-rules
                :rules="[val => !!val || t('required')]"
                :error="!!errors.name"
                :error-message="errors.name"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-list>
                  <q-item clickable v-ripple @click="addDescription">
                    <q-item-section avatar>
                      <q-avatar color="teal" text-color="white" icon="add"/>
                    </q-item-section>
                    <q-item-section>{{ t('addDescription') }}</q-item-section>
                  </q-item>
                  <div style="height: 180px; overflow: auto;">
                    <q-item
                      clickable
                      v-ripple
                      dense
                      v-for="(description, index) in productInfo.descriptions" :key="index"
                    >
                      <q-item-section>
                        <q-input
                          v-model="description.name"
                          :label="t('description')"
                          lazy-rules
                          :rules="[val => !!val || t('required')]"
                          dense
                          outlined
                        />
                      </q-item-section>
                      <q-item-section side>
                        <div class="text-grey-8 q-gutter-xs">
                          <q-btn type="button"
                            class="gt-xs" size="md"
                            flat color="red" dense round
                            icon="delete" @click="removeDescription(index)"/>
                        </div>
                      </q-item-section>
                    </q-item>
                  </div>
                </q-list>
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
import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useProductStore } from "src/stores/product-store";
const { t, locale } = useI18n();

const productStore = useProductStore();

const tab = ref('codes');

const $q = useQuasar();
const emit = defineEmits(['closeMeEvent']);

const props = defineProps({
  productId: Number,
  code: {
    type: String,
    required: false,
    default: '',
  },
});

const productInfo = ref({
  id: null,
  name: null,
  code: null,
  descriptions: [],
});

const errors = ref({});
const loading = ref(false);

const saveProduct = async() => {
  loading.value = true;
  errors.value = {};

  console.log(productInfo.value);
  try {
    let returnedId = 0;
    if (props.productId === 0) {
      const response = await productStore.createProduct(productInfo.value);
      returnedId = response.id
    } else {
      const response = await productStore.updateProduct(productInfo.value);
      returnedId = props.productId;
    }
    await productStore.listDescriptions();
    if (props.productId > 0) {
      await productStore.retrieveProduct(props.productId);
    }

    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: t('productSaved'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
    handleClose(true);
  } catch(error) {
    console.error(error);
    if (error.status === 403) return;
    if (error.response && error.response.data) {
      errors.value = error.response.data;
      if (error.response.data.code) {
        errors.value.code = error.response.data.code.join(', ');
      }
    }
    $q.notify({
      color: 'negative',
      position: 'top-right',
      message: t('failedToSaveProduct'),
      icon: 'report_problem',
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
  } finally {
    loading.value = false;
  }
};

const handleClose = (isSaved) => {
  emit('closeMeEvent', isSaved);
};

onMounted(() => {
  if (props.productId > 0) {
    const productData = productStore.getCurrentProduct;
    console.log('productData', productData);
    console.log('descriptions', productStore.getDescriptions);
    const descriptions = productStore.getDescriptions.filter((d) => d.product === props.productId).map((d) => ({ id: d.id, name: d.name }));
    console.log('descriptions', descriptions);

    productInfo.value.id = props.productId;
    productInfo.value.name = productData.name;
    productInfo.value.code = productData.code;
    productInfo.value.descriptions = descriptions;
  } else {
    productInfo.value.code = props.code;
  }
});

const addDescription = () => {
  productInfo.value.descriptions.push({
    id: null,
    name: '',
  });
};

const removeDescription = async(descriptionIndex) => {
  try {
    if (productInfo.value.descriptions[descriptionIndex].id > 0) {
      await productStore.deleteDescription(productInfo.value.descriptions[descriptionIndex].id);
    }
    productInfo.value.descriptions.splice(descriptionIndex, 1);
    $q.notify({
      type: 'positive',
      position: 'top-right',
      message: t('descriptionRemoved'),
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
  } catch (error) {
    console.error(error);
    $q.notify({
      color: 'negative',
      position: 'top-right',
      message: t('failedToRemoveDescription'),
      icon: 'report_problem',
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ],
    });
  }
};

const handleEnter = () => {
  console.log('prevented enter')
};
</script>

<style scoped>
.q-toggle {
  position: relative;
  margin-left: auto;
  margin-right: auto;
}
</style>
