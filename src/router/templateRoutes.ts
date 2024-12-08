import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/admin/tenant/:tenantId/create-template',
    component: () => import('@/public/tenant-template/CreateTemplateView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tenant/:tenantId/templates/:tenantTemplateId/update',
    component: () => import('@/public/tenant-template/UpdateTemplateView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tenant/:tenantId/templates',
    name: 'templates',
    component: () => import('@/public/tenant-template/TemplatesView.vue'),
    meta: {
      requiresAuth: true
    }
  }
] as Readonly<RouteRecordRaw[]>
