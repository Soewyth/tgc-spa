<template>
  <NLayoutHeader
    bordered
    style="padding: 0 24px; position: sticky; top: 0; z-index: 100"
  >
    <NSpace justify="space-between" align="center" style="height: 56px">
      <NSpace align="center" :size="16">
        <RouterLink to="/" class="header-bar__brand">TCG SPA</RouterLink>
      </NSpace>
      <NSpace align="center" :size="16">
        <NText depth="3">{{ authStore.user?.username }}</NText>
        <NButton size="small" @click="handleSignOut">Deconnexion</NButton>
      </NSpace>
    </NSpace>
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { ROUTES } from '../../router.js'
import { useAuthStore } from '../../stores/auth.js'

const authStore = useAuthStore()
const router = useRouter()

const handleSignOut = async () => {
  authStore.signOut()
  await router.push(ROUTES.SIGN_IN)
}
</script>

<style scoped>
.header-bar__brand {
  font-weight: 700;
  text-decoration: none;
}
</style>
