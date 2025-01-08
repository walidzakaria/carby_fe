<template>
  <q-item clickable>
    <q-item-section>
      <q-item-label lines="1">{{ name }}</q-item-label>
      <q-item-label caption lines="2">
        <span class="text-weight-bold">{{ phone }}</span>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>

const props = defineProps({
  name: String,
  phone: String,
});

</script>
