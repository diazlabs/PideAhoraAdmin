<script setup lang="ts">
import router from '@/router'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import TemplateService from '@/common/services/TemplateService'
import UpdateTemplateForm from './components/UpdateTemplateForm.vue'

const route = useRoute()

const tenantId = route.params.tenantId as string
const tenantTemplateId = route.params.tenantTemplateId as string

if (!tenantId || tenantId.length < 35) {
  router.push({ path: '/not-found' })
}

if (!tenantTemplateId || tenantTemplateId.length < 35) {
  router.push({ path: '/not-found' })
}

const templateQuery = useQuery({
  queryKey: ['template-get-by-id', tenantId],
  queryFn: () => TemplateService.GetById(tenantId, tenantTemplateId),
  refetchOnWindowFocus: false
})

const { data } = templateQuery
</script>

<template>
  <template v-if="templateQuery.isSuccess && templateQuery?.data.value?.data">
    <UpdateTemplateForm
      :tenant-id="tenantId"
      :tenant-template-id="tenantTemplateId"
      :name="data!.data!.name"
      :header="data!.data!.header"
      :description="data!.data!.description"
      :logo-url="data!.data!.logo"
    />
  </template>
  <template v-if="templateQuery.isError || !templateQuery.isFetching">
    <div class="flex items-center justify-center">
      <p>{{ templateQuery.error?.value }}</p>
    </div>
  </template>
  <template v-else>
    <AppLoader />
  </template>
</template>
