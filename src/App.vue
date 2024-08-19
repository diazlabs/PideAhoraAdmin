<script setup lang="ts">
import { RouterView } from 'vue-router'

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
