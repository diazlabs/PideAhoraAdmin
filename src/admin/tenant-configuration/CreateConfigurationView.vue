<script setup lang="ts">
import router from '@/router'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import CreateConfigurationForm from './components/CreateConfigurationForm.vue'
import TemplateService from '@/common/services/TemplateService'
import TenantConfigService from '@/common/services/TenantConfigService'

const route = useRoute()

const tenantId = route.params.tenantId as string
const templateId = route.query.templateId as string

if (!tenantId || tenantId.length < 35) {
  router.push({ path: '/not-found' })
}

if (!templateId || templateId.length < 35) {
  router.push({ path: '/not-found' })
}

const templateQuery = useQuery({
  queryKey: ['template-get-by-id', tenantId],
  queryFn: () => TemplateService.GetById(tenantId, templateId),
  refetchOnWindowFocus: false
})

const configTypesQuery = useQuery({
  queryKey: ['get-config-types'],
  queryFn: () => TenantConfigService.GetTypes(),
  refetchOnWindowFocus: false
})

const { data: templateData } = templateQuery
</script>

<template>
  <template
    v-if="
      templateQuery.isSuccess &&
      templateData?.data &&
      configTypesQuery.isSuccess &&
      configTypesQuery?.data
    "
  >
    <CreateConfigurationForm
      :tenant-id="tenantId"
      :template-id="templateId"
      :config-types="configTypesQuery.data.value!.data!"
    />
  </template>
  <template
    v-if="
      templateQuery.isError ||
      !templateQuery.isFetching ||
      configTypesQuery.isError ||
      !configTypesQuery.isFetching
    "
  >
    <div class="flex items-center justify-center">
      <p>{{ templateQuery.error?.value?.message }}</p>
      <p>{{ configTypesQuery.error?.value?.message }}</p>
    </div>
  </template>
  <template v-else>
    <AppLoader />
  </template>
</template>
