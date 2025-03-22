<template>
  <div>
    <q-card>
      <q-card-section class="text-h6 text-white bg-green">
        <div class="text-h6">{{ descriptionId === 0 ? t('addDescription') : t('editDescription') }}</div>
      </q-card-section>
      <q-form @submit.prevent="saveDescription" class="q-gutter-md">
        <q-card-section class="q-pa-sm">
          <q-list class="row">

            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="descriptionInfo.name" :label="t('description')" lazy-rules
                  :rules="[val => !!val || t('required')]" maxlength="350" autofocus />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn class="text-capitalize text-white" type="button" color="grey" style="min-width: 130px;"
            :label="t('cancel')" @click="handleClose(false);">
          </q-btn>
          <q-btn class="text-capitalize text-white" type="submit" color="green" :loading="loading"
            style="min-width: 130px;" :label="t('save')">
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
import { useProductStore } from 'src/stores/product-store';
const { t } = useI18n();

const productStore = useProductStore();

const $q = useQuasar();
const emit = defineEmits(['closeMeEvent']);

const props = defineProps({
  descriptionId: Number,
  productId: Number,
});

const descriptionInfo = ref({
  id: null,
  name: null,
  product: null,
});

const loading = ref(false);

const saveDescription = async () => {
  try {
    if (props.descriptionId > 0) {
      console.log(descriptionInfo.value);
      const response = await productStore.updateDescription(descriptionInfo.value);
    } else {
      const response = await productStore.createDescription(descriptionInfo.value);
      descriptionInfo.value.id = response.id;
    }
    handleClose(true);
  } catch (error) {
    console.log(error);
  }
};

const handleClose = (isSaved) => {
  const result = {
    isSaved,
    savedId: descriptionInfo.value.id,
  };
  emit('closeMeEvent', result);
};

onMounted(() => {
  descriptionInfo.value.product = productStore.getCurrentProduct.id;
  console.log('pro', productStore.getCurrentProduct, 'props', props.descriptionId);
  if (props.descriptionId > 0) {
    const selectedDescription = productStore.getCurrentProduct.descriptions.find((d) => d.id === props.descriptionId);
    console.log('selectedDescription', selectedDescription);
    descriptionInfo.value.id = selectedDescription.id;
    descriptionInfo.value.name = selectedDescription.name;
  }
});


</script>
