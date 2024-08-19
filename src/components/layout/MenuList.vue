<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'

defineProps<{ items: MenuItem[] }>()
</script>

<template>
  <ul class="list-none p-4 m-0" v-for="(item, key) in items" :key="key">
    <li>
      <div
        v-styleclass="{
          selector: '@next',
          enterFromClass: 'hidden',
          enterActiveClass: 'animate-slidedown',
          leaveToClass: 'hidden',
          leaveActiveClass: 'animate-slideup'
        }"
        class="p-4 flex items-center justify-between text-surface-500 dark:text-surface-400 cursor-pointer"
      >
        <span class="font-medium">{{ item.label }}</span>
        <i class="pi pi-chevron-down"></i>
      </div>
      <ul class="list-none p-0 m-0 overflow-hidden">
        <AppMenuItem v-for="(subItem, key) in item.items" :item="subItem" :key="key" />
      </ul>
    </li>
  </ul>
</template>
