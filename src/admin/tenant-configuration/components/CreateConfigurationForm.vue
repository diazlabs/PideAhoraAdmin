<script setup lang="tsx">
import { ref } from 'vue'

import AppInputGroup from '@/components/Inputs/AppInputGroup.vue'
import GeneralErrors from '@/components/Errors/GeneralErrors.vue'

import Card from 'primevue/card'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as zod from 'zod'
import { useMutation } from '@tanstack/vue-query'

import type { GeneralErrorsType } from '@/common/types/api.interface'
import { useToast } from 'primevue/usetoast'

import TenantConfigService from '@/common/services/TenantConfigService'
import type { CreateConfigRequest, TenantConfigType } from '@/common/types/tenantConfigs.interface'

interface Props {
  tenantId: string
  templateId: string
  configTypes: TenantConfigType[]
}

const props = defineProps<Props>()

const validationSchema = toTypedSchema(
  zod.object({
    configType: zod.enum(
      props.configTypes.length > 0
        ? (props.configTypes.map((x) => x.type) as [string, ...string[]])
        : ['default'],
      { message: 'Debes seleccionar el tipo de configuracion' }
    ),
    configName: zod
      .string()
      .max(30, { message: 'El nombre del template no puede ser mayor a 30 caracteres' }),
    configValue: zod
      .string()
      .max(200, { message: 'La descripción no puede ser mayor a 200 caracteres' }),
    enabled: zod.boolean(),
    visible: zod.boolean()
  })
)

const { handleSubmit, setErrors } = useForm({
  validationSchema
})

const selectedType = ref<TenantConfigType>()
const enabled = ref<boolean>(false)
const visible = ref<boolean>(false)

const generalErrors = ref<GeneralErrorsType>(null)

const toast = useToast()

const { isPending, mutate: createConfig } = useMutation({
  mutationFn: (request: CreateConfigRequest) => TenantConfigService.Create(request),
  onSuccess(response) {
    if (response.ok) {
      toast.add({
        severity: 'success',
        summary: 'Creado exitosamente',
        detail: 'Se ha creado el template correctamente',
        life: 5000,
        closable: true
      })
      return
    }

    if (response.errors !== null) {
      setErrors(response.errors!)
      return
    }

    generalErrors.value = response.generalErrors
  }
})

const onSubmit = handleSubmit((values) => {
  createConfig({
    ...values,
    tenantId: props.tenantId,
    enabled: enabled.value,
    configType: selectedType.value!.type
  })
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-5">
    <Card class="max-w-[400px] w-full">
      <template #title>
        <h1 class="text-center">Crear configuracion de tenant</h1>
      </template>
      <template #content>
        <form @submit.prevent="onSubmit">
          <AppInputGroup label="Nombre" id="configName" name="configName" />
          <AppInputGroup label="Valor" id="configValue" name="configValue" />
          <AppInputGroup label="Tipo" id="configType" name="configType">
            <Select
              v-model="selectedType"
              :options="configTypes"
              optionLabel="label"
              placeholder="Selecciona el tipo de configuracion"
              class="w-full"
              name="configType"
            />
          </AppInputGroup>
          <AppInputGroup label="Habilitado" id="enabled" name="enabled">
            <ToggleSwitch v-model="enabled" />
          </AppInputGroup>
          <AppInputGroup label="Visible (Para usuarios)" id="visible" name="visible">
            <ToggleSwitch v-model="visible" />
          </AppInputGroup>
          <Button type="submit" :disabled="isPending" class="w-full mb-5">Crear</Button>
          <GeneralErrors :generalErrors="generalErrors" />
        </form>
      </template>
    </Card>
  </div>
</template>
