<template>
  <div class="fullscreen bg-orange text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        401
      </div>

      <div class="text-h2" style="opacity:.4; color: red;">
        Oops. You're unauthorized to come here...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'ErrorOcurred'
});
</script>
