<template>
  <div>
    <q-card>
      <q-card-section class="text-h6 text-white bg-green">
        <div class="text-h6">{{ unitId === 0 ? t('addUnit') : t('editUnit') }}</div>
      </q-card-section>
      <q-form @submit.prevent="saveUnit" class="q-gutter-md">
        <q-card-section class="q-pa-sm">
          <q-list class="row">

            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input dense v-model="unitInfo.name" :label="t('unitName')"
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
import { useUnitStore } from 'src/stores/unit-store';
const { t } = useI18n();

const unitStore = useUnitStore();

const $q = useQuasar();
const emit = defineEmits(['closeMeEvent']);

const props = defineProps({
  unitId: Number,
});

const unitInfo = ref({
  id: null,
  name: null,
});

const loading = ref(false);

const errors = ref({});
const saveUnit = async() => {
  try {
    if (props.unitId > 0) {
      console.log(unitInfo.value);
      await unitStore.putUnit(unitInfo.value);
    } else {
      await unitStore.postUnit(unitInfo.value);
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
  if (props.unitId > 0) {
    const selectedUnit = unitStore.getUnits.filter((u) => u.id === props.unitId);
    unitInfo.value.id = selectedUnit[0].id;
    unitInfo.value.name = selectedUnit[0].name;
  }
});


</script>
