<script setup lang="tsx">
import MainLayout from './components/layout/MainLayout.vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useLayoutStore } from './stores/layout'
import { storeToRefs } from 'pinia'
import Toast from 'primevue/toast'

const authStore = useAuthStore()
const { isAuth, tokenExpiration } = storeToRefs(authStore)
const { setTheme } = useLayoutStore()

if (tokenExpiration.value) {
  setTimeout(() => {
    authStore.logout(true)
  }, tokenExpiration.value - Date.now())
}
setTheme()
</script>

<template>
  <Toast />
  <template v-if="isAuth">
    <MainLayout>
      <RouterView />
    </MainLayout>
  </template>
  <template v-else>
    <RouterView />
  </template>
</template>
