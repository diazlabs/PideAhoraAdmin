<script setup lang="ts">
import AppFooter from './AppFooter.vue'
import AppMenu from './AppMenu.vue'
import AppSidebar from './AppSidebar.vue'
</script>

<template>
  <AppMenu>
    <p></p>
  </AppMenu>
  <AppSidebar />
  <slot></slot>
  <AppFooter />
</template>
