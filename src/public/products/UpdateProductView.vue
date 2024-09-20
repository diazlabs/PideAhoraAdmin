<script setup lang="ts">
import router from '@/router'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import TenantService from '@/common/services/TenantService'
import UpdateProductForm from './components/UpdateProductForm.vue'
import ProductService from '@/common/services/ProductService'

const route = useRoute()

const tenantId = route.params.tenantId as string
const productId = Number(route.params.productId)

if (!tenantId || tenantId.length < 35) {
  router.push({ path: '/not-found' })
}

if (productId <= 0) {
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

const productQuery = useQuery({
  queryKey: ['products-by-id', productId],
  queryFn: () => ProductService.GetById(tenantId, productId),
  refetchOnWindowFocus: false
})
</script>

<template>
  <template
    v-if="
      tenantQuery.isSuccess &&
      productsQuery.isSuccess &&
      productQuery.isSuccess &&
      productsQuery.data.value?.data &&
      tenantQuery.data.value?.data &&
      productQuery.data.value?.data
    "
  >
    <UpdateProductForm
      :tenant-id="tenantId"
      :tenant-name="tenantQuery.data.value.data.name"
      :products="productsQuery.data.value.data"
      :product-id="productId"
      :product="productQuery.data.value.data"
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
