<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import Menubar from 'primevue/menubar'
import type { MenuItem } from 'primevue/menuitem'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'

const themeStore = useLayoutStore()
const authStore = useAuthStore()

const { theme } = storeToRefs(themeStore)

const items: MenuItem[] = [
  {
    label: 'Admin',
    items: [
      {
        label: 'Crear tenant',
        url: '/tenant/create-tenant'
      }
    ]
  }
]
</script>

<template>
  <Menubar :model="items" class="rounded-none gap-10">
    <template #start>
      <Button icon="pi pi-bars" @click="themeStore.openSidebar" />
      <!--       <svg
        width="35"
        height="40"
        viewBox="0 0 35 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="h-8"
      >
        <path d="..." fill="var(--p-primary-color)" />
        <path d="..." fill="var(--p-text-color)" />
      </svg> -->
    </template>
    <template #item="{ item, props, hasSubmenu, root }">
      <a v-if="!authStore.isAdmin" v-ripple class="flex items-center" v-bind="props.action">
        <span :class="item.icon" />
        <template v-if="item.url">
          <RouterLink :to="item.url" :class="item.icon ? 'ml-2' : ''">{{ item.label }}</RouterLink>
        </template>
        <template v-else>
          <a :class="item.icon ? 'ml-2' : ''">{{ item.label }}</a>
        </template>
        <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
        <span
          v-if="item.shortcut"
          class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
          >{{ item.shortcut }}</span
        >
        <i
          v-if="hasSubmenu"
          :class="[
            'pi pi-angle-down',
            { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }
          ]"
        ></i>
      </a>
    </template>
    <template #end>
      <div class="flex items-center gap-2 lg:mr-32">
        <InputText placeholder="Search" type="text" class="w-32 sm:w-auto" />
        <Avatar image="/images/avatar/amyelsner.png" shape="circle" />
        <button type="button" class="dark:text-white" @:click="themeStore.changeTheme">
          <i :class="`pi pi-${theme === 'dark' ? 'moon' : 'sun'}`"></i>
        </button>
      </div>
    </template>
  </Menubar>
</template>
