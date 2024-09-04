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
import TenantService from '../../common/services/TenantService'
import type { CreateTenantRequest } from '@/common/types/tenant.interface'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const categories = ['Panaderia', 'Comida rapida', 'Otro'] as const

const validationSchema = toTypedSchema(
  zod.object({
    pageTitle: zod
      .string()
      .max(30, { message: 'El titulo de la pagina no puede ser mayor a 30 caracteres' }),
    path: zod
      .string({ message: 'Debes ingresar el path que tendra tu tienda /mi-tienda' })
      .min(2, { message: 'Debes ingresar el path que tendra tu tienda /' })
      .max(30, { message: 'El path no puede ser mayor a 30 caracteres' }),
    description: zod
      .string()
      .max(200, { message: 'La descripción no puede ser mayor a 200 caracteres' }),
    category: zod.enum(categories, { message: 'Debes seleccionar una categoria' }),
    name: zod
      .string()
      .min(2, { message: 'El nombre de la tienda debe tener al menos 2 caracteres' })
      .max(30, {
        message: 'El nombre de la tienda no puede ser mayor a 30 caracteres'
      }),
    logo: zod
      .any()
      .refine((file) => file?.size <= MAX_FILE_SIZE, `El tamaño maximo de la imagen es 5MB.`)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        'Solamente se aceptan los siguientes formatos .jpg, .jpeg, .png and .webp.'
      )
  })
)

const { handleSubmit, setErrors, defineField } = useForm({
  validationSchema
})

const [logo] = defineField('logo')
const [category] = defineField('category')

const generalErrors = ref<GeneralErrorsType>(null)

const { isPending, mutate: createTenant } = useMutation({
  mutationFn: (request: CreateTenantRequest) => TenantService.Create(request),
  onSuccess(response) {
    if (response.ok) {
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
  createTenant({ ...values, logo: values.logo })
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-5">
    <Card class="max-w-[400px] w-full">
      <template #title>
        <h1 class="text-center">Crear tienda</h1>
      </template>
      <template #content>
        <form @submit.prevent="onSubmit">
          <AppInputGroup label="Nombre de la tienda" id="name" name="name" />
          <AppInputGroup label="Descripcion" id="description" name="description" />
          <AppInputGroup label="Path" id="path" name="path" />
          <AppInputGroup label="Categoria" id="category" name="category">
            <Select
              v-model="category"
              :options="[...categories]"
              optionLabel="category"
              id="category"
              placeholder="Selecciona una categoria"
              class="w-full"
            />
          </AppInputGroup>
          <AppInputGroup label="Titulo de la pagina" id="pageTitle" name="pageTitle" />
          <AppInputGroup label="Logo" id="logo" name="logo">
            <FileUpload
              v-model="logo"
              mode="basic"
              name="logo"
              :accept="ACCEPTED_IMAGE_TYPES.join(',')"
              :maxFileSize="MAX_FILE_SIZE"
            />
          </AppInputGroup>
          <Button type="submit" :disabled="isPending" class="w-full mb-5">Crear tienda</Button>
          <GeneralErrors :generalErrors="generalErrors" />
        </form>
      </template>
    </Card>
  </div>
</template>
