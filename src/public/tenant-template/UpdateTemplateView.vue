<script setup lang="ts">
import router from '@/router'
import { useQuery } from '@tanstack/vue-query'
import { useRoute } from 'vue-router'
import TemplateService from '@/common/services/TemplateService'
import UpdateTemplateForm from './components/UpdateTemplateForm.vue'

const route = useRoute()

const tenantId = route.params.tenantId as string
const templateId = route.params.templateId as string

if (!tenantId || tenantId.length < 35) {
  router.push({ path: '/not-found' })
}

if (!templateId || templateId.length < 35) {
  router.push({ path: '/not-found' })
}

const templateQuery = useQuery({
  queryKey: ['tenant-get-by-id', tenantId],
  queryFn: () => TemplateService.GetById(tenantId, templateId),
  refetchOnWindowFocus: false
})

const { data } = templateQuery
</script>

<template>
  <template v-if="templateQuery.isSuccess && templateQuery?.data">
    <UpdateTemplateForm
      :tenant-id="tenantId"
      :tenant-template-id="templateId"
      :description="data!.data!.description"
      :name="data!.data!.name"
      :header="data!.data!.header"
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
