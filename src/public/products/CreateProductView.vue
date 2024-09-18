<script setup lang="ts">
import router from '@/router'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import TenantService from '@/common/services/TenantService'
import CreateProductForm from './components/CreateProductForm.vue'

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
</script>

<template>
  <template v-if="tenantQuery.isSuccess && tenantQuery?.data.value?.data">
    <CreateProductForm :tenant-id="tenantId" :tenant-name="tenantQuery.data.value!.data!.name" />
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
