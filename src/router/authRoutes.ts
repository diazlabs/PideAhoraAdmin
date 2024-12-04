import LoginView from '@/public/auth/LoginView.vue'
import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/auth/login',
    name: 'login',
    component: LoginView,
    meta: {
      isPublic: true
    }
  },
  {
    path: '/auth/register',
    name: 'register',
    component: () => import('@/public/auth/RegisterView.vue'),
    meta: {
      isPublic: true
    }
  },
  {
    path: '/auth/reset-password',
    component: () => import('@/public/auth/ResetPasswordView.vue'),
    meta: {
      isPublic: true
    }
  },
  {
    path: '/auth/forgot-password',
    component: () => import('@/public/auth/ForgotPasswordView.vue'),
    meta: {
      isPublic: true
    }
  },
  {
    path: '/auth/change-password',
    component: () => import('../public/auth/ChangePasswordView.vue'),
    meta: {
      requiresAuth: true
    }
  }
] as Readonly<RouteRecordRaw[]>
