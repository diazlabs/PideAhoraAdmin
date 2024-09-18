<script setup lang="tsx">
import { ref } from 'vue'

import AppInputGroup from '@/components/Inputs/AppInputGroup.vue'
import GeneralErrors from '@/components/Errors/GeneralErrors.vue'

import Card from 'primevue/card'

import { useMutation } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'

import type { GeneralErrorsType } from '@/common/types/api.interface'
import type {
  TenantConfig,
  TenantConfigType,
  UpdateAllConfigRequest
} from '@/common/types/tenantConfigs.interface'
import TenantConfigService from '@/common/services/TenantConfigService'

interface Props {
  configs: TenantConfig[]
  tenantId: string
  configTypes: TenantConfigType[]
}

const props = defineProps<Props>()
const generalErrors = ref<GeneralErrorsType>(null)
const toast = useToast()

const { isPending, mutate: updateConfigs } = useMutation({
  mutationFn: (request: UpdateAllConfigRequest) => TenantConfigService.UpdateAll(request),
  onSuccess(response) {
    if (response.ok) {
      toast.add({
        severity: 'success',
        summary: 'Actualización exitosa',
        detail: 'Se ha actualizado el tenant correctamente',
        life: 5000,
        closable: true
      })
      return
    }

    if (response.errors !== null) {
      return
    }

    generalErrors.value = response.generalErrors
  }
})

const onSubmit = () => {
  const form = document.querySelector('form')
  const formData = new FormData(form!)
  const data = Object.fromEntries(formData.entries())

  const request: UpdateAllConfigRequest = {
    tenantId: props.tenantId,
    configs: props.configs.map((config) => ({
      enabled:
        document.getElementById(config.configName + '-enabled')!.getAttribute('checked') !== null,
      configValue: data[config.configName] as string,
      tenantConfigId: config.tenantConfigId
    }))
  }

  console.log(request)
  //updateConfigs(request)
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-5">
    <Card class="max-w-[400px] w-full">
      <template #title>
        <h1 class="text-center">Actualizar tienda</h1>
      </template>
      <template #content>
        <form @submit.prevent="onSubmit">
          <div v-for="(type, index) in configTypes" :key="index">
            <h1>{{ type.label }}</h1>
            <template v-for="(config, configIndex) in props.configs">
              <template v-if="config.configType === type.type">
                <AppInputGroup
                  :key="configIndex"
                  :label="config.configName"
                  :id="config.configName"
                  :name="config.configName"
                  :value="config.configValue"
                />
                <AppInputGroup
                  label="Activado"
                  :name="`${config.configName}-enabled`"
                  :key="configIndex"
                >
                  <ToggleSwitch :modelValue="config.enabled" />
                </AppInputGroup>
              </template>
            </template>
          </div>
          <AppInputGroup label="Nombre de la tienda" id="name" name="name" />
          <Button type="submit" :disabled="isPending" class="w-full mb-5">Actualizar</Button>
          <GeneralErrors :generalErrors="generalErrors" />
        </form>
      </template>
    </Card>
  </div>
</template>
