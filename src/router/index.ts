import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/AboutView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/sections',
      name: 'sections',
      component: () => import('../views/AboutView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/theming',
      name: 'theming',
      component: () => import('../views/AboutView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/configs',
      name: 'configs',
      component: () => import('../views/AboutView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/tenant/create-tenant',
      component: () => import('../views/tenant/CreateTenantView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/tenant/:id',
      component: () => import('../views/tenant/UpdateTenantView.vue'),
      meta: {
        requiresAuth: true
      }
    },
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
      component: () => import('../views/auth/RegisterView.vue'),
      meta: {
        isPublic: true
      }
    },
    {
      path: '/auth/reset-password',
      component: () => import('../views/auth/ResetPasswordView.vue'),
      meta: {
        isPublic: true
      }
    },
    {
      path: '/auth/forgot-password',
      component: ForgotPasswordView,
      meta: {
        isPublic: true
      }
    },
    {
      path: '/auth/change-password',
      component: () => import('../views/auth/ChangePasswordView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
  ]
})

router.beforeEach(async (to, from, next) => {
  const { isAuth } = useAuthStore()

  if (to.meta.requiresAuth && !isAuth && to.name !== 'login') {
    localStorage.returnUrl = to.fullPath
    return next({ name: 'login' })
  }

  if (isAuth && to.meta.isPublic) {
    return next({ name: 'home' })
  }

  next()
})

export default router
