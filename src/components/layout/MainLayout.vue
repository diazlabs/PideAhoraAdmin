<script setup lang="ts">
import AppFooter from './AppFooter.vue'
import AppMenu from './AppMenu.vue'
import AppSidebar from './AppSidebar.vue'
</script>

<template>
  <AppMenu />
  <AppSidebar />
  <slot />
  <AppFooter />
</template>
