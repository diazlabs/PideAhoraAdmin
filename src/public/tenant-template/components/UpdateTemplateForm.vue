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
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/common/constants/image'
import { useToast } from 'primevue/usetoast'

import TemplateService from '@/common/services/TemplateService'
import type { UpdateTemplateRequest } from '@/common/types/template.interface'
import { imageCdn } from '@/common/constants/cdn'

interface Props extends UpdateTemplateRequest {
  logoUrl: string
}

const props = defineProps<Props>()

const validationSchema = toTypedSchema(
  zod.object({
    name: zod
      .string({ message: 'Debes ingresar el nombre del template, te ayudara a identifcarlo' })
      .max(30, { message: 'El nombre del template no puede ser mayor a 30 caracteres' }),
    header: zod
      .string({ message: 'Debes ingresar el header de la pagina' })
      .max(30, { message: 'El nombre del template no puede ser mayor a 30 caracteres' }),
    description: zod
      .string({ message: 'Debes ingresar la description' })
      .max(100, { message: 'La descripción no puede ser mayor a 200 caracteres' }),
    logo: zod
      .any()
      .optional()
      .refine(
        (file) => !file || file?.size <= MAX_FILE_SIZE,
        `El tamaño maximo de la imagen es 5MB.`
      )
      .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
        'Solamente se aceptan los siguientes formatos .jpg, .jpeg, .png and .webp.'
      )
  })
)

const { handleSubmit, setErrors, defineField } = useForm({
  validationSchema,
  initialValues: { ...props }
})
const [logo] = defineField('logo')

const generalErrors = ref<GeneralErrorsType>(null)

const toast = useToast()

const { isPending, mutate: updateTemplate } = useMutation({
  mutationFn: (request: UpdateTemplateRequest) => TemplateService.Update(request),
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

const onSelectFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  logo.value = target.files![0]
}

const onSubmit = handleSubmit((values) => {
  updateTemplate({ ...values, tenantId: props.tenantId, tenantTemplateId: props.tenantTemplateId })
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-5">
    <Card class="max-w-[400px] w-full">
      <template #title>
        <h1 class="text-center">Actualizar template</h1>
      </template>
      <template #content>
        <form @submit.prevent="onSubmit">
          <AppInputGroup label="Nombre" id="name" name="name" />
          <AppInputGroup label="Header" id="header" name="header" />
          <AppInputGroup label="Descripcion" id="description" name="description" />
          <AppInputGroup label="Logo" id="logo" name="logo">
            <input
              type="file"
              name="logo"
              id="logo"
              :accept="ACCEPTED_IMAGE_TYPES.join(',')"
              :max="MAX_FILE_SIZE"
              multiple="false"
              @change="onSelectFile"
            />
          </AppInputGroup>
          <template v-if="props.logoUrl">
            <img :src="`${imageCdn}/${props.logoUrl}`" alt="Logo" class="mb-5" />
          </template>
          <Button type="submit" :disabled="isPending" class="w-full mb-5">Actualizar</Button>
          <GeneralErrors :generalErrors="generalErrors" />
        </form>
      </template>
    </Card>
  </div>
</template>
