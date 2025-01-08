<template>
  <q-item clickable>
    <q-item-section avatar>
      <q-avatar>
        <img :src="avatar">
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{ name }}
        <q-badge rounded :color="status.online? 'green' : 'grey'" >
          <q-tooltip v-if="!status.online"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]">
            {{ t('lastSeen') }} <strong>{{ parseTime(status.last_seen) }}</strong>
          </q-tooltip>
        </q-badge>
      </q-item-label>
      <q-item-label caption lines="2">
        <span class="text-weight-bold"><a :href="`tel:${phone}`">{{ phone }}</a></span>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();

const props = defineProps({
  avatar: String,
  name: String,
  phone: String,
  status: Object,
});

const parseTime = (inputTime) => {
  if (inputTime) {
    const d = new Date(inputTime);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
  return t('notFound');
};
</script>
