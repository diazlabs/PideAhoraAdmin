<script setup lang="tsx">
import MainLayout from './components/layout/MainLayout.vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useLayoutStore } from './stores/layout'

const { isAuth } = useAuthStore()
const { setTheme } = useLayoutStore()

setTheme()
</script>

<template>
  <template v-if="isAuth">
    <MainLayout>
      <RouterView />
    </MainLayout>
  </template>
  <template v-else>
    <RouterView />
  </template>
</template>
