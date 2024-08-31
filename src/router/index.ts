import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/sections',
      name: 'sections',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/theming',
      name: 'theming',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/configs',
      name: 'configs',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/auth/login',
      component: LoginView
    }
  ]
})

export default router
