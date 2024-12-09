<script setup lang="tsx">
import { ref, watch } from 'vue'

import AppInputGroup from '@/components/Inputs/AppInputGroup.vue'
import GeneralErrors from '@/components/Errors/GeneralErrors.vue'

import Card from 'primevue/card'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as zod from 'zod'
import { useMutation } from '@tanstack/vue-query'

import type { GeneralErrorsType } from '@/common/types/api.interface'
import type { TenantCategory, UpdateTenantRequest } from '@/common/types/tenant.interface'
import TenantService from '../../../common/services/TenantService'
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/common/constants/image'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '../../../stores/auth'
import { imageCdn } from '@/common/constants/cdn'

interface Props extends UpdateTenantRequest {
  categories: TenantCategory[]
  image: string
}

const { isAdmin } = useAuthStore()

const props = defineProps<Props>()

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
    category: zod.enum(
      props.categories.length > 0
        ? (props.categories.map((x) => x.code) as [string, ...string[]])
        : ['default'],
      { message: 'Debes seleccionar una categoria' }
    ),
    name: zod
      .string()
      .min(2, { message: 'El nombre de la tienda debe tener al menos 2 caracteres' })
      .max(30, {
        message: 'El nombre de la tienda no puede ser mayor a 30 caracteres'
      }),
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

const { handleSubmit, setErrors, defineField, setFieldValue } = useForm({
  validationSchema,
  initialValues: {
    ...props
  }
})

const [logo] = defineField('logo')
const category = ref<TenantCategory>(props.categories.find((x) => x.code === props.category)!)
watch(category, () => {
  setFieldValue('category', category.value!.code)
})

const generalErrors = ref<GeneralErrorsType>(null)

const toast = useToast()

const { isPending, mutate: createTenant } = useMutation({
  mutationFn: (request: UpdateTenantRequest) => TenantService.Update(request),
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
  createTenant({ ...values, tenantId: props.tenantId })
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-5">
    <Card class="max-w-[400px] w-full">
      <template #title>
        <h1 class="text-center">Actualizar tienda</h1>
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
          <img class="mb-5" :src="`${imageCdn}/${props.tenantId}`" :alt="props.name" />
          <Button type="submit" :disabled="isPending" class="w-full mb-5">Actualizar</Button>
          <GeneralErrors :generalErrors="generalErrors" />
        </form>
      </template>
      <template v-if="isAdmin" #footer>
        <Button
          as="router-link"
          link
          type="button"
          class="w-full"
          severity="secondary"
          label="Crear template"
          :to="`/admin/tenant/${props.tenantId}/create-template`"
        />
      </template>
    </Card>
  </div>
</template>
