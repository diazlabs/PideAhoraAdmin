import { ref } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode, type JwtPayload } from 'jwt-decode'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const tokenExpiration = ref<number>()
  const isAuth = ref(false)
  const isAdmin = ref(false)

  const token = localStorage.getItem('token')

  if (token !== null) {
    const decoded = jwtDecode(token)
    tokenExpiration.value = decoded.exp! * 1000
    if (tokenExpiration.value < Date.now()) {
      localStorage.removeItem('token')
    } else {
      login(token)
    }
  }

  function logout(setReturnUrl: boolean = false) {
    isAuth.value = false
    tokenExpiration.value = undefined
    localStorage.removeItem('token')
    if (setReturnUrl) {
      localStorage.setItem('returnUrl', router.currentRoute.value.fullPath)
    }
    router.push('/auth/login')
  }

  function login(jwtToken: string) {
    isAuth.value = true
    //isAdmin.value = jwtDecode<TokenClaims>(jwtToken).role?.includes('admin') || false
    isAdmin.value = true
    localStorage.setItem('token', jwtToken)
  }

  function getToken() {
    return localStorage.getItem('token')
  }

  return { isAuth, logout, login, getToken, tokenExpiration, isAdmin }
})

interface TokenClaims extends JwtPayload {
  id?: string
  role?: string
  tenant?: string
  email: string
  name: string
  family_name: string
}
