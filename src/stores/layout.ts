import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
  const isSidebarOpen = ref(false)
  function closeSidebar() {
    isSidebarOpen.value = false
  }

  function openSidebar() {
    isSidebarOpen.value = true
  }

  return { isSidebarOpen, closeSidebar, openSidebar }
})
