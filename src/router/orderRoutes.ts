import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/tenant/:tenantId/orders',
    name: 'orders',
    component: () => import('@/public/orders/OrdersView.vue'),
    meta: {
      requiresAuth: true
    }
  }
] as Readonly<RouteRecordRaw[]>
