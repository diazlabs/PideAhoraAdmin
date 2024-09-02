import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

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
      path: '/auth/login',
      name: 'login',
      component: LoginView
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const { isAuth } = useAuthStore()

  if (to.meta.requiresAuth && !isAuth && to.name !== 'login') {
    localStorage.returnUrl = to.fullPath
    return next({ name: 'login' })
  }

  if (isAuth && to.name === 'login') {
    return next({ name: 'home' })
  }

  next()
})

export default router
