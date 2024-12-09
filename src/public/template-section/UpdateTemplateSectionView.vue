<script setup lang="ts">
import { useRoute } from 'vue-router'

import router from '@/router'
import UpdateTemplateSectionForm from './components/UpdateTemplateSectionForm.vue'
import SectionService from '../../common/services/SectionService'
import { useQuery } from '@tanstack/vue-query'
import ProductService from '@/common/services/ProductService'

const route = useRoute()

const tenantId = route.params.tenantId as string
const tenantTemplateId = route.params.tenantTemplateId as string
const templateSectionId = Number(route.params.templateSectionId as string)

if (!tenantId || tenantId.length < 35) {
  router.push({ path: '/not-found' })
}

if (!tenantTemplateId || tenantTemplateId.length < 35) {
  router.push({ path: '/not-found' })
}

if (!templateSectionId || templateSectionId < 1) {
  router.push({ path: '/not-found' })
}

const sectionQuery = useQuery({
  queryKey: ['section', templateSectionId],
  queryFn: () => SectionService.GetById(tenantId, tenantTemplateId, templateSectionId),
  refetchOnWindowFocus: false
})

const productsQuery = useQuery({
  queryKey: ['section', tenantId],
  queryFn: () => ProductService.GetAll(tenantId),
  refetchOnWindowFocus: false
})
</script>

<template>
  <template
    v-if="
      sectionQuery.isSuccess &&
      sectionQuery?.data.value?.data &&
      productsQuery.isSuccess &&
      productsQuery.data.value?.data
    "
  >
    <UpdateTemplateSectionForm
      :tenant-id="tenantId"
      :tenant-template-id="tenantTemplateId"
      :section="sectionQuery.data.value.data"
      :products="productsQuery.data.value.data"
    />
  </template>
  <template v-if="sectionQuery.isError || !sectionQuery.isFetching">
    <div class="flex items-center justify-center">
      <p>{{ sectionQuery.error?.value }}</p>
    </div>
  </template>
  <template v-else>
    <AppLoader />
  </template>
</template>
