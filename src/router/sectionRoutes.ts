import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/admin/tenant/:tenantId/templates/:tenantTemplateId/create-section',
    component: () => import('@/admin/template-section/CreateTemplateSectionView.vue'),
    meta: {
      requiresAuth: true
    }
  }
] as Readonly<RouteRecordRaw[]>
