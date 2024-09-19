<script setup lang="ts">
import router from '@/router'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import ProductService from '../../common/services/ProductService'
import ProductsDataTable from './components/ProductsDataTable.vue'

const route = useRoute()

const tenantId = route.params.tenantId as string

if (!tenantId || tenantId.length < 35) {
  router.push({ path: '/not-found' })
}

const productsQuery = useQuery({
  queryKey: ['products-by-tenant', tenantId],
  queryFn: () => ProductService.GetAll(tenantId),
  refetchOnWindowFocus: false
})
</script>

<template>
  <template v-if="productsQuery.isSuccess && productsQuery?.data.value?.data">
    <ProductsDataTable
      :refetch="productsQuery.refetch"
      :tenant-id="tenantId"
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
