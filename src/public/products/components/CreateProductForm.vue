<script setup lang="tsx">
import { ref } from 'vue'

import AppInputGroup from '@/components/Inputs/AppInputGroup.vue'
import GeneralErrors from '@/components/Errors/GeneralErrors.vue'

import Card from 'primevue/card'

import { toTypedSchema } from '@vee-validate/zod'
import { FieldArray, useForm } from 'vee-validate'
import * as zod from 'zod'
import { useMutation } from '@tanstack/vue-query'

import type { GeneralErrorsType } from '@/common/types/api.interface'
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/common/constants/image'
import { useToast } from 'primevue/usetoast'
import ProductService from '@/common/services/ProductService'
import type { CreateProductRequest } from '@/common/types/product.interface'

interface Props {
  tenantId: string
  tenantName: string
}

const props = defineProps<Props>()

const validationSchema = toTypedSchema(
  zod.object({
    productName: zod
      .string({ message: 'Debes ingresar el nombre del producto' })
      .max(30, { message: 'El nombre del producto no puede ser mayor a 30 caracteres' }),
    productPrice: zod.number().min(0, { message: 'Debes ingresar un precio mayor igual a 0' }),
    productDescription: zod
      .string()
      .max(100, { message: 'La descripcion no puede ser mayor a 100 caracteres' })
      .optional(),
    visible: zod.boolean(),
    choices: zod
      .array(
        zod.object({
          productChoiceId: zod.number().default(0),
          choice: zod.string().min(2, { message: 'Debes ingresar el texto de la eleccion' }),
          quantity: zod
            .number({ message: 'Debes ingresar la cantidad que se puede escoger' })
            .min(1, { message: 'La cantidad minima es 1' }),
          required: zod.boolean(),
          visible: zod.boolean(),
          options: zod
            .array(
              zod.object({
                choiceOptionId: zod.number().default(0),
                optionPrice: zod
                  .number()
                  .min(0, { message: 'Debes ingresar un precio mayor igual a 0' }),
                visible: zod.boolean()
              })
            )
            .min(1, { message: 'Debes ingresar al menos una opcion' })
        })
      )
      .default([]),
    image: zod
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
  validationSchema
})

const [choices] = defineField('choices')
const [image] = defineField('image')
const [visible] = defineField('visible')

const generalErrors = ref<GeneralErrorsType>(null)

const toast = useToast()

const { isPending, mutate: createProduct } = useMutation({
  mutationFn: (request: CreateProductRequest) => ProductService.Create(request),
  onSuccess(response) {
    if (response.ok) {
      toast.add({
        severity: 'success',
        summary: 'Producto creado',
        detail: 'Se ha creado el producto correctamente',
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
  image.value = target.files![0]
}

const onSubmit = handleSubmit((values) => {
  createProduct({ ...values, tenantId: props.tenantId })
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-10">
    <Card class="max-w-[400px] p-2 pr-0 lg:max-w-7xl">
      <template #title>
        <h1 class="text-center">Crear producto para la tienda {{ tenantName }}</h1>
      </template>
      <template #content>
        <form
          @submit.prevent="onSubmit"
          class="overflow-y-auto lg:grid lg:grid-cols-2 h-[80vh] gap-10"
        >
          <div>
            <AppInputGroup label="Nombre" id="productName" name="productName" />
            <AppInputGroup label="Descripcion" id="productDescription" name="productDescription" />
            <AppInputGroup label="Precio" id="productPrice" name="productPrice" type="number" />
            <AppInputGroup label="Visible (Para usuarios)" id="visible" name="visible">
              <ToggleSwitch id="visible" v-model="visible" />
            </AppInputGroup>
            <AppInputGroup label="Imagen" id="iamge" name="iamge">
              <input
                type="file"
                name="image"
                id="image"
                :accept="ACCEPTED_IMAGE_TYPES.join(',')"
                :max="MAX_FILE_SIZE"
                multiple="false"
                @change="onSelectFile"
              />
            </AppInputGroup>
            <Button type="submit" :disabled="isPending" class="w-full mb-5">Crear</Button>
            <GeneralErrors :generalErrors="generalErrors" />
          </div>
          <div class="overflow-y-auto scrollbar p-0.5 pr-4">
            <FieldArray name="choices" v-slot="{ fields, push, remove }">
              <Button
                type="button"
                severity="warn"
                class="mb-5 !text-white"
                @click="
                  push({
                    choice: '',
                    quantity: 0,
                    required: false,
                    visible: false,
                    productChoiceId: 0,
                    options: []
                  })
                "
                >Crear elección</Button
              >
              <fieldset class="InputGroup" v-for="(field, idx) in fields" :key="field.key">
                <AppInputGroup
                  label="Eleccion"
                  :id="`choice_${idx}`"
                  :name="`choices[${idx}].choice`"
                />
                <AppInputGroup
                  label="Cantidad"
                  :id="`quantity_${idx}`"
                  :name="`choices[${idx}].quantity`"
                  type="number"
                />
                <div class="flex justify-between">
                  <AppInputGroup
                    label="Requerido"
                    :id="`required_${idx}`"
                    :name="`choices[${idx}].required`"
                  >
                    <ToggleSwitch :id="`required_${idx}`" v-model="choices![idx].required" />
                  </AppInputGroup>

                  <AppInputGroup
                    label="Visible (Para usuarios)"
                    :id="`visible_${idx}`"
                    :name="`choices[${idx}].visible`"
                  >
                    <ToggleSwitch :id="`visible_${idx}`" v-model="choices![idx].visible" />
                  </AppInputGroup>
                </div>
                <Button
                  label="Eliminar"
                  class="!text-white mb-5"
                  severity="danger"
                  icon="pi pi-trash"
                  iconPos="right"
                  type="button"
                  @click="remove(idx)"
                />
              </fieldset>
            </FieldArray>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>
