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
import router from '@/router'
import { useForm } from 'vee-validate'
import * as zod from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

interface Props {
  configs: TenantConfig[]
  tenantId: string
  configTypes: TenantConfigType[]
}

const props = defineProps<Props>()
const generalErrors = ref<GeneralErrorsType>(null)
const toast = useToast()

const validationSchema = toTypedSchema(
  zod.object({
    configs: zod
      .array(
        zod.object({
          configId: zod.string(),
          configValue: zod
            .string()
            .max(200, { message: 'La descripción no puede ser mayor a 200 caracteres' }),
          enabled: zod.boolean()
        })
      )
      .min(1, { message: 'Debes ingresar al menos una opcion' })
  })
)

const { handleSubmit, setErrors, defineField } = useForm({
  validationSchema,
  initialValues: {
    configs: props.configs.map((config) => ({
      configId: config.tenantConfigId,
      configValue: config.configValue,
      enabled: config.enabled
    }))
  }
})

const [configurations] = defineField('configs')

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

    generalErrors.value = response.generalErrors

    if (response.errors !== null) {
      setErrors(response.errors!)
    }
  }
})

const onSubmit = handleSubmit((values) => {
  updateConfigs({
    tenantId: props.tenantId,
    configs: values.configs
  })
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-5">
    <Card class="max-w-[400px] w-full">
      <template #title>
        <h1 class="text-center">Actualizar configuraciones</h1>
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
                  :id="config.configValue"
                  :name="`configs[${configIndex}].configValue`"
                />
                <AppInputGroup
                  label="Activado"
                  :name="`configs[${configIndex}].enabled`"
                  :id="`enabled_${config.tenantConfigId}`"
                  :key="configIndex"
                >
                  <ToggleSwitch
                    :id="`enabled_${config.tenantConfigId}`"
                    v-model="configurations![configIndex].enabled"
                  />
                </AppInputGroup>
              </template>
            </template>
          </div>
          <Button type="submit" :disabled="isPending" class="w-full mb-5">Actualizar</Button>
          <Button
            type="button"
            class="w-full"
            severity="secondary"
            @click="
              () =>
                router.push({
                  path: `/configs/${props.tenantId}/create`
                })
            "
            >Crear configuracion</Button
          >
          <GeneralErrors :generalErrors="generalErrors" />
        </form>
      </template>
    </Card>
  </div>
</template>
