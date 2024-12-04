import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/admin/tenant/create-tenant',
    component: () => import('@/admin/tenant/CreateTenantView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/tenant/:tenantId/configs/create',
    component: () => import('@/admin/tenant-configuration/CreateConfigurationView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tenant/:tenantId/configs',
    name: 'configs',
    component: () => import('@/public/tenant-configuration/TenantConfigurationsView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    name: 'tenant',
    path: '/tenant/:tenantId',
    component: () => import('@/public/tenant/UpdateTenantView.vue'),
    meta: {
      requiresAuth: true
    }
  }
] as Readonly<RouteRecordRaw[]>
