<script setup lang="ts">
import TenantService from '@/common/services/TenantService'
import router from '@/router'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'

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

const { data: tenantData } = tenantQuery
</script>

<template>
  <template v-if="tenantQuery.isSuccess && tenantData?.data">
    <CreateTemplateForm :tenant-id="tenantId" />
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
