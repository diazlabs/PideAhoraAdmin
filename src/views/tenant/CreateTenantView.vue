<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import TenantService from '../../common/services/TenantService'
import CreateTenantForm from './components/CreateTenantForm.vue'

const categoriesQuery = useQuery({
  queryKey: ['tenant-categories'],
  queryFn: () => TenantService.GetCategories()
})
</script>

<template>
  <template v-if="categoriesQuery.isSuccess && categoriesQuery.data?.value?.data">
    <CreateTenantForm :categories="categoriesQuery.data.value.data" />
  </template>
  <template v-else-if="categoriesQuery.isSuccess">
    <div class="flex items-center justify-center min-h-screen">
      <p>{{ categoriesQuery.data.value?.generalErrors }}</p>
    </div>
  </template>
  <template v-else>
    <AppLoader />
  </template>
</template>
