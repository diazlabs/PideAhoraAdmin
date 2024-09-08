<script setup lang="tsx">
import { ref, watch } from 'vue'

import AppInputGroup from '@/components/Inputs/AppInputGroup.vue'
import GeneralErrors from '@/components/Errors/GeneralErrors.vue'

import Card from 'primevue/card'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as zod from 'zod'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

import type { GeneralErrorsType } from '@/common/types/api.interface'
import type { CreateTenantRequest, TenantCategory } from '@/common/types/tenant.interface'
import TenantService from '@/common/services/TenantService'
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/common/constants/image'
import router from '@/router'

const queryClient = useQueryClient()

const props = defineProps<{
  categories: TenantCategory[]
}>()

const validationSchema = toTypedSchema(
  zod.object({
    pageTitle: zod
      .string({ message: 'Requerido' })
      .max(30, { message: 'El titulo de la pagina no puede ser mayor a 30 caracteres' }),
    path: zod
      .string({ message: 'Debes ingresar el path que tendra tu tienda /mi-tienda' })
      .min(2, { message: 'Debes ingresar el path que tendra tu tienda /' })
      .max(30, { message: 'El path no puede ser mayor a 30 caracteres' }),
    description: zod
      .string({ message: 'Requerido' })
      .max(200, { message: 'La descripción no puede ser mayor a 200 caracteres' }),
    category: zod.enum(
      props.categories.length > 0
        ? (props.categories.map((x) => x.code) as [string, ...string[]])
        : ['default'],
      { message: 'Debes seleccionar una categoria' }
    ),
    name: zod
      .string({ message: 'Requerido' })
      .min(2, { message: 'El nombre de la tienda debe tener al menos 2 caracteres' })
      .max(30, {
        message: 'El nombre de la tienda no puede ser mayor a 30 caracteres'
      }),
    logo: zod
      .any()
      .refine((file) => file?.size < MAX_FILE_SIZE, `El tamaño maximo de la imagen es 5MB.`)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        'Solamente se aceptan los siguientes formatos .jpg, .jpeg, .png and .webp.'
      )
  })
)

const { handleSubmit, setErrors, defineField, setFieldValue } = useForm({
  validationSchema
})

const [logo] = defineField('logo')
const category = ref<TenantCategory>()
watch(category, () => {
  setFieldValue('category', category.value!.code)
})

const generalErrors = ref<GeneralErrorsType>(null)

const { isPending, mutate: createTenant } = useMutation({
  mutationFn: (request: CreateTenantRequest) => TenantService.Create(request),
  onSuccess(response) {
    if (response.ok) {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })

      router.push({ name: 'tenant', params: { tenantId: response.data!.tenantId } })
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
              :options="categories"
              optionLabel="name"
              id="category"
              placeholder="Selecciona una categoria"
              class="w-full"
            />
          </AppInputGroup>
          <AppInputGroup label="Titulo de la pagina" id="pageTitle" name="pageTitle" />
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
          <Button type="submit" :disabled="isPending" class="w-full mb-5">Crear tienda</Button>
          <GeneralErrors :generalErrors="generalErrors" />
        </form>
      </template>
    </Card>
  </div>
</template>
