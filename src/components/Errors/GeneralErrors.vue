<script lang="ts" setup>
import type { GeneralErrorsType } from '@/common/types/api.interface'

defineProps<{ generalErrors: GeneralErrorsType }>()
</script>

<template v-if="generalErrors !== null && generalErrors !== undefined">
  <p
    class="w-96 text-red-600 dark:text-red-400 font-semibold text-sm"
    v-for="(error, index) in generalErrors"
    :key="index"
  >
    {{ error }}
  </p>
</template>
