<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainLayout from './components/layout/MainLayout.vue'

const isAuth = true
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
