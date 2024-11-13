<script setup lang="ts">
import router from '@/router'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import CreateConfigurationForm from './components/CreateConfigurationForm.vue'
import TenantConfigService from '@/common/services/TenantConfigService'

const route = useRoute()

const tenantId = route.params.tenantId as string

if (!tenantId || tenantId.length < 35) {
  router.push({ path: '/not-found' })
}

const configTypesQuery = useQuery({
  queryKey: ['get-config-types'],
  queryFn: () => TenantConfigService.GetTypes(),
  refetchOnWindowFocus: false
})
</script>

<template>
  <template v-if="configTypesQuery.isSuccess && configTypesQuery?.data?.value?.data">
    <CreateConfigurationForm
      :tenant-id="tenantId"
      :config-types="configTypesQuery.data.value!.data!"
    />
  </template>
  <template v-if="configTypesQuery.isError || !configTypesQuery.isFetching">
    <div class="flex items-center justify-center">
      <p>{{ configTypesQuery.error?.value?.message }}</p>
    </div>
  </template>
  <template v-else>
    <AppLoader />
  </template>
</template>
