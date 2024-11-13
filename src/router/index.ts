import HomeView from '../public/HomeView.vue'
import LoginView from '@/public/auth/LoginView.vue'
import ForgotPasswordView from '@/public/auth/ForgotPasswordView.vue'

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NotFoundView from '@/public/NotFoundView.vue'

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
      path: '/orders/:tenantId',
      name: 'orders',
      component: () => import('../public/orders/OrdersView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/sections',
      name: 'sections',
      component: () => import('../public/AboutView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/products/:tenantId',
      name: 'products',
      component: () => import('../public/products/ProductsView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/products/:tenantId/create-product',
      component: () => import('../public/products/CreateProductView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/products/:tenantId/:productId',
      component: () => import('../public/products/UpdateProductView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/configs/:tenantId',
      name: 'configs',
      component: () => import('../public/tenant-configuration/TenantConfigurationsView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/configs/:tenantId/create',
      component: () => import('../admin/tenant-configuration/CreateConfigurationView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/create-tenant',
      component: () => import('../admin/tenant/CreateTenantView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      name: 'tenant',
      path: '/tenant/:tenantId',
      component: () => import('../public/tenant/UpdateTenantView.vue'),
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
      component: () => import('../public/auth/RegisterView.vue'),
      meta: {
        isPublic: true
      }
    },
    {
      path: '/auth/reset-password',
      component: () => import('../public/auth/ResetPasswordView.vue'),
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
      component: () => import('../public/auth/ChangePasswordView.vue'),
      meta: {
        requiresAuth: true
      }
    },
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
