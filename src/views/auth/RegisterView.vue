<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import RegisterForm from './components/RegisterForm.vue'
import AuthService from '@/common/services/AuthService'

const countriesQuery = useQuery({
  queryKey: ['get-countries'],
  queryFn: () => AuthService.GetCountries(),
  refetchOnWindowFocus: false
})
</script>

<template>
  <template v-if="countriesQuery.isSuccess && countriesQuery.data?.value?.data">
    <RegisterForm :countries="countriesQuery.data.value.data" />
  </template>
  <template v-else-if="countriesQuery.isError && !countriesQuery.isFetching">
    <div class="flex items-center justify-center min-h-screen">
      <p>{{ countriesQuery.data.value?.generalErrors }}</p>
    </div>
  </template>
  <template v-else>
    <AppLoader />
  </template>
</template>
