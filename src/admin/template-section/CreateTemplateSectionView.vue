<script setup lang="ts">
import { useRoute } from 'vue-router'

import router from '@/router'
import CreateTemplateSectionForm from './components/CreateTemplateSectionForm.vue'
import { useQuery } from '@tanstack/vue-query'
import ProductService from '@/common/services/ProductService'

const route = useRoute()

const tenantId = route.params.tenantId as string
const tenantTemplateId = route.params.tenantTemplateId as string

if (!tenantId || tenantId.length < 35) {
  router.push({ path: '/not-found' })
}

if (!tenantTemplateId || tenantTemplateId.length < 35) {
  router.push({ path: '/not-found' })
}

const productsQuery = useQuery({
  queryKey: ['products-by-tenant', tenantId],
  queryFn: () => ProductService.GetAll(tenantId),
  refetchOnWindowFocus: false
})
</script>

<template>
  <template v-if="productsQuery.isSuccess && productsQuery.data.value?.data">
    <CreateTemplateSectionForm
      :tenant-id="tenantId"
      :tenant-template-id="tenantTemplateId"
      :products="productsQuery.data.value.data"
    />
  </template>
  <template v-if="productsQuery.isError || !productsQuery.isFetching">
    <div class="flex items-center justify-center">
      <p>{{ productsQuery.error?.value }}</p>
    </div>
  </template>
  <template v-else>
    <AppLoader />
  </template>
</template>
