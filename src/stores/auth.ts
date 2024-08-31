import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const isAuth = ref(false)

  function logout() {
    isAuth.value = false
  }

  function login(jwtToken: string) {
    isAuth.value = true
    localStorage.setItem('token', jwtToken)
  }

  function getToken() {
    return localStorage.getItem('token')
  }

  return { isAuth, logout, login, getToken }
})
