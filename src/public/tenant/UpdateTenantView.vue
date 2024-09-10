<script setup lang="ts">
import TenantService from '@/common/services/TenantService'
import router from '@/router'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import UpdateTenantForm from './components/UpdateTenantForm.vue'

const route = useRoute()

const tenantId = route.params.tenantId as string

if (!tenantId || tenantId.length < 35) {
  router.push({ path: '/not-found' })
}

const tenantQuery = useQuery({
  queryKey: ['tenant-get-by-id', tenantId],
  queryFn: () => TenantService.GetById(tenantId),
  refetchOnWindowFocus: false
})

const categoriesQuery = useQuery({
  queryKey: ['tenant-categories'],
  queryFn: () => TenantService.GetCategories(),
  refetchOnWindowFocus: false
})

const { data: tenantData } = tenantQuery
</script>

<template>
  <template
    v-if="
      tenantQuery.isSuccess &&
      categoriesQuery.isSuccess &&
      tenantData?.data &&
      categoriesQuery.data?.value?.data
    "
  >
    <UpdateTenantForm
      :tenant-id="tenantId"
      :description="tenantData.data.description"
      :category="tenantData.data.category"
      :name="tenantData.data.name"
      :page-title="tenantData.data.pageTitle"
      :path="tenantData.data.path"
      :image="tenantData.data.logo"
      :categories="categoriesQuery.data.value.data"
    />
  </template>
  <template
    v-if="
      tenantQuery.isError ||
      (categoriesQuery.isError && !categoriesQuery.isFetching && !tenantQuery.isFetching)
    "
  >
    <div class="flex items-center justify-center">
      <p>{{ tenantQuery.error?.value }}</p>
      <p>{{ categoriesQuery.error?.value }}</p>
    </div>
  </template>
  <template v-else>
    <AppLoader />
  </template>
</template>
