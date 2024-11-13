<script setup lang="ts">
import router from '@/router'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import TenantConfigService from '@/common/services/TenantConfigService'
import TenantConfigurationForm from '../tenant-configuration/components/TenantConfigurationForm.vue'

const route = useRoute()

const tenantId = route.params.tenantId as string

if (!tenantId || tenantId.length < 35) {
  router.push({ path: '/not-found' })
}

const configQuery = useQuery({
  queryKey: ['tenant-configs'],
  queryFn: () => TenantConfigService.GetAll(tenantId),
  refetchOnWindowFocus: false
})

const configTypes = useQuery({
  queryKey: ['get-config-types'],
  queryFn: () => TenantConfigService.GetTypes(),
  refetchOnWindowFocus: false
})
</script>

<template>
  <template
    v-if="
      configQuery.isSuccess &&
      configQuery.data.value?.data &&
      configTypes.data.value?.data &&
      configTypes.isSuccess
    "
  >
    <TenantConfigurationForm
      :config-types="configTypes.data.value!.data!"
      :configs="configQuery.data.value!.data!"
      :tenant-id="tenantId"
    />
  </template>
  <template
    v-if="
      configQuery.isError ||
      !configQuery.isFetching ||
      configTypes.isError ||
      !configTypes.isFetching
    "
  >
    <div class="flex items-center justify-center">
      <p>{{ configQuery.error?.value }}</p>
      <p>{{ configTypes.error?.value }}</p>
    </div>
  </template>
  <template v-else>
    <AppLoader />
  </template>
</template>
