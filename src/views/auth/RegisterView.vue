<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import RegisterForm from './components/RegisterForm.vue'
import AuthService from '@/common/services/AuthService'

const categoriesQuery = useQuery({
  queryKey: ['get-countries'],
  queryFn: () => AuthService.GetCountries()
})
</script>

<template>
  <template v-if="categoriesQuery.isSuccess && categoriesQuery.data?.value?.data">
    <RegisterForm :countries="categoriesQuery.data.value.data" />
  </template>
  <template v-else-if="categoriesQuery.isError && !categoriesQuery.isFetching">
    <div class="flex items-center justify-center min-h-screen">
      <p>{{ categoriesQuery.data.value?.generalErrors }}</p>
    </div>
  </template>
  <template v-else>
    <AppLoader />
  </template>
</template>
