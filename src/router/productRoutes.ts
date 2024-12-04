import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/tenant/:tenantId/products',
    name: 'products',
    component: () => import('@/public/products/ProductsView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tenant/:tenantId/products/create-product',
    component: () => import('@/public/products/CreateProductView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tenant/:tenantId/products/:productId/update',
    component: () => import('@/public/products/UpdateProductView.vue'),
    meta: {
      requiresAuth: true
    }
  }
] as Readonly<RouteRecordRaw[]>
