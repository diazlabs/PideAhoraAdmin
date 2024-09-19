<script setup lang="ts">
import router from '@/router'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import TenantService from '@/common/services/TenantService'
import CreateProductForm from './components/CreateProductForm.vue'
import ProductService from '@/common/services/ProductService'

const route = useRoute()

const tenantId = route.params.tenantId as string

if (!tenantId || tenantId.length < 35) {
  router.push({ path: '/not-found' })
}

const tenantQuery = useQuery({
  queryKey: ['tenant-by-id', tenantId],
  queryFn: () => TenantService.GetById(tenantId),
  refetchOnWindowFocus: false
})

const productsQuery = useQuery({
  queryKey: ['products-extra-by-tenant', tenantId],
  queryFn: () => ProductService.GetAllExtra(tenantId),
  refetchOnWindowFocus: false
})

const productsTypesQuery = useQuery({
  queryKey: ['products-types'],
  queryFn: () => ProductService.GetProductTypes(),
  refetchOnWindowFocus: false
})
</script>

<template>
  <template
    v-if="
      tenantQuery.isSuccess &&
      productsQuery.isSuccess &&
      productsTypesQuery.isSuccess &&
      productsQuery.data.value?.data &&
      tenantQuery.data.value?.data &&
      productsTypesQuery.data.value?.data
    "
  >
    <CreateProductForm
      :tenant-id="tenantId"
      :tenant-name="tenantQuery.data.value.data.name"
      :products="productsQuery.data.value.data"
      :product-types="productsTypesQuery.data.value.data"
    />
  </template>
  <template v-if="tenantQuery.isError || !tenantQuery.isFetching">
    <div class="flex items-center justify-center">
      <p>{{ tenantQuery.error?.value }}</p>
    </div>
  </template>
  <template v-else>
    <AppLoader />
  </template>
</template>
