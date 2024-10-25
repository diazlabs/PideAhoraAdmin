<script setup lang="ts">
import OrderService from '@/common/services/OrderService'
import router from '@/router'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import OrdersDataTable from './components/OrdersDataTable.vue'

const route = useRoute()

const tenantId = route.params.tenantId as string

if (!tenantId || tenantId.length < 35) {
  router.push({ path: '/not-found' })
}

const ordersQuery = useQuery({
  queryKey: ['orders-by-tenant', tenantId],
  queryFn: () => OrderService.GetAll(tenantId),
  refetchOnWindowFocus: false
})
</script>

<template>
  <template v-if="ordersQuery.isSuccess && ordersQuery?.data.value?.data">
    <OrdersDataTable
      :refetch="ordersQuery.refetch"
      :tenant-id="tenantId"
      :orders="ordersQuery.data.value.data"
    />
  </template>
  <template v-if="ordersQuery.isError || !ordersQuery.isFetching">
    <div class="flex items-center justify-center">
      <p>{{ ordersQuery.error?.value }}</p>
    </div>
  </template>
  <template v-else>
    <AppLoader />
  </template>
</template>
