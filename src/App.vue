<script setup>
import { RouterView } from 'vue-router'
import MsToast from '@/components/ms-toast/MsToast.vue'
</script>

<template>
  <div class="app-root">
    <RouterView />
    <MsToast />
  </div>
</template>

<style>
html,
body,
#app,
.app-root {
  width: 100%;
  height: 100%;
}
</style>
