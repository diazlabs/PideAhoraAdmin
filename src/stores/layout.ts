import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Theme } from '@/common/types/theme.interface'

export const useLayoutStore = defineStore('layout', () => {
  const isSidebarOpen = ref(false)
  const theme = ref<Theme>('dark')

  function closeSidebar() {
    isSidebarOpen.value = false
  }

  function openSidebar() {
    isSidebarOpen.value = true
  }

  function setTheme() {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
      theme.value = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      theme.value = 'light'
    }
  }

  function changeTheme() {
    const newTheme = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.theme = newTheme
    theme.value = newTheme

    setTheme()
  }

  return { isSidebarOpen, closeSidebar, openSidebar, setTheme, theme, changeTheme }
})
