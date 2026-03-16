<template>
  <NConfigProvider>
    <NMessageProvider>
      <NLayout class="app-layout">
        <HeaderBar v-if="showHeader" />
        <NLayoutContent :class="{ 'app-layout__content': showHeader }">
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import HeaderBar from './components/layout/HeaderBar.vue'
import { useAuthStore } from './stores/auth.js'

const authStore = useAuthStore()

const showHeader = computed(() => authStore.isAuthenticated)
</script>

<style>
html,
body {
  margin: 0;
  min-height: 100%;
}

#app {
  min-height: 100vh;
}

body {
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  background: #fffaf5;
}

a {
  color: inherit;
}

.app-layout {
  min-height: 100vh;
}

.app-layout__content {
  padding: 24px;
}
</style>
