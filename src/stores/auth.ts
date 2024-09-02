import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = localStorage.getItem('token')
  const isAuth = ref(token !== null)

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

  function initializeLogin(isVerified: boolean) {
    isAuth.value = isVerified
  }

  return { isAuth, logout, login, getToken, initializeLogin }
})
