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
import router from '@/router'
import SectionAdminService from '@/common/services/SectionsAdminService'
import type { CreateSectionRequest, SectionById } from '@/common/types/section.interface'

const props = defineProps<{
  tenantTemplateId: string
  tenantId: string
  section: SectionById
}>()

const validationSchema = toTypedSchema(
  zod.object({
    sectionName: zod
      .string({ message: 'Requerido' })
      .max(30, { message: 'El nombre de la pagina no puede ser mayor a 30 caracteres' }),
    sectionDescription: zod
      .string({ message: 'La descripcion es requerida' })
      .min(2, { message: 'La descripcion es requerida' })
      .max(100, { message: 'La descripcion no pouede ser mayor a 100 caracteres' }),
    visible: zod.boolean().default(false)
  })
)

const { handleSubmit, setErrors } = useForm({
  validationSchema
})

const visible = ref<boolean>(false)

const generalErrors = ref<GeneralErrorsType>(null)

const { isPending, mutate: createTemplateSection } = useMutation({
  mutationFn: (request: CreateSectionRequest) => SectionAdminService.Create(request),
  onSuccess(response) {
    if (response.ok) {
      router.push({ path: `/tenant/${props.tenantId}/templates` })
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
  createTemplateSection({
    ...values,
    tenantTemplateId: props.tenantTemplateId,
    tenantId: props.tenantId,
    visible: visible.value,
    products: []
  })
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-5">
    <Card class="max-w-[400px] w-full">
      <template #title>
        <h1 class="text-center">Crear section</h1>
      </template>
      <template #content>
        <form @submit.prevent="onSubmit">
          <AppInputGroup label="Nombre de la tienda" id="sectionName" name="sectionName" />
          <AppInputGroup label="Descripcion" id="sectionDescription" name="sectionDescription" />
          <AppInputGroup label="Visible (Para usuarios)" id="visible" name="visible">
            <ToggleSwitch v-model="visible" />
          </AppInputGroup>
          <Button type="submit" :disabled="isPending" class="w-full mb-5">Crear section</Button>
          <GeneralErrors :generalErrors="generalErrors" />
        </form>
      </template>
    </Card>
  </div>
</template>
