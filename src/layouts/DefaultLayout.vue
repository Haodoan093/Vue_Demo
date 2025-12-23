<script setup>
import { ref } from 'vue'

import AppNavbar from './AppNavbar.vue'
import AppSidebar from './AppSidebar.vue'

const isSidebarCollapsed = ref(false)
</script>

<template>
  <div class="default-layout">
    <header>
      <AppNavbar />
    </header>

    <main>
      <AppSidebar
        :collapsed="isSidebarCollapsed"
        @update:collapsed="(value) => (isSidebarCollapsed = value)"
      />

      <div
        class="recruiment-app-content-container"
        :class="isSidebarCollapsed ? 'width-collapse' : 'width-expanded'"
      >
        <slot />
      </div>
    </main>
  </div>
</template>
