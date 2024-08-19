import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const isAuth = ref(false)
  function logout() {
    isAuth.value = false
  }

  function login() {
    isAuth.value = true
  }

  return { isAuth, logout, login }
})
