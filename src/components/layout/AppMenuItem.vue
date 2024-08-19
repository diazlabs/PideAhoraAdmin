<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'
import { RouterLink, useRoute } from 'vue-router'

defineProps<{ item: MenuItem }>()
</script>

<template>
  <li>
    <RouterLink
      v-if="item.url"
      active-class="bg-surface-100 dark:bg-surface-800 duration-150 transition-colors"
      :to="item.url"
      v-styleclass="
        item.items
          ? {
              selector: '@next',
              enterFromClass: 'hidden',
              enterActiveClass: 'animate-slidedown',
              leaveToClass: 'hidden',
              leaveActiveClass: 'animate-slideup'
            }
          : {}
      "
      class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors"
    >
      <i :class="`${item.icon} mr-2`"></i>
      <span class="font-medium">{{ item.label }}</span>
      <i v-show="item.items" class="pi pi-chevron-down ml-auto"></i>
    </RouterLink>
    <a
      v-else
      v-styleclass="
        item.items
          ? {
              selector: '@next',
              enterFromClass: 'hidden',
              enterActiveClass: 'animate-slidedown',
              leaveToClass: 'hidden',
              leaveActiveClass: 'animate-slideup'
            }
          : {}
      "
      class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors"
    >
      <i :class="`${item.icon} mr-2`"></i>
      <span class="font-medium">{{ item.label }}</span>
      <i v-show="item.items" class="pi pi-chevron-down ml-auto"></i>
    </a>
    <ul
      class="list-none py-0 pl-4 pr-0 m-0 hidden overflow-y-hidden transition-all duration-[400ms] ease-in-out"
    >
      <AppMenuItem v-for="(subItem, key) in item.items" :item="subItem" :key="key" />
    </ul>
  </li>
</template>
