import HomeView from '../public/HomeView.vue'

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NotFoundView from '@/public/NotFoundView.vue'
import templateRoutes from './templateRoutes'
import productRoutes from './productRoutes'
import tenantRoutes from './tenantRoutes'
import authRoutes from './authRoutes'
import orderRoutes from './orderRoutes'

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
    ...tenantRoutes,
    ...templateRoutes,
    ...productRoutes,
    ...authRoutes,
    ...orderRoutes,
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }
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
