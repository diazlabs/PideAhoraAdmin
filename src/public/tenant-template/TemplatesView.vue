<script setup lang="ts">
import router from '@/router'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import TemplatesDataTable from './components/TemplatesDataTable.vue'
import TemplateService from '../../common/services/TemplateService'

const route = useRoute()

const tenantId = route.params.tenantId as string

if (!tenantId || tenantId.length < 35) {
  router.push({ path: '/not-found' })
}

const templatesQuery = useQuery({
  queryKey: ['templates', tenantId],
  queryFn: () => TemplateService.GetAll(tenantId),
  refetchOnWindowFocus: false
})
</script>

<template>
  <template v-if="templatesQuery.isSuccess && templatesQuery?.data?.value?.data">
    <TemplatesDataTable
      :refetch="templatesQuery.refetch"
      :tenant-id="tenantId"
      :templates="templatesQuery.data.value.data"
    />
  </template>
  <template v-if="templatesQuery.isError || !templatesQuery.isFetching">
    <div class="flex items-center justify-center">
      <p>{{ templatesQuery.error?.value }}</p>
    </div>
  </template>
  <template v-else>
    <AppLoader />
  </template>
</template>
