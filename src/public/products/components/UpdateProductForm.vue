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
import type { Product, ProductById, UpdateProductRequest } from '@/common/types/product.interface'
import InputNumber from 'primevue/inputnumber'
import router from '@/router'
import { imageCdn } from '@/common/constants/cdn'

interface Props {
  tenantId: string
  tenantName: string
  products: Product[]
  productId: number
  product: ProductById
}

const props = defineProps<Props>()

const validationSchema = toTypedSchema(
  zod.object({
    productName: zod
      .string({ message: 'Debes ingresar el nombre del producto' })
      .max(30, { message: 'El nombre del producto no puede ser mayor a 30 caracteres' }),
    productPrice: zod
      .number({ message: 'Debes ingresar el precio del producto' })
      .min(0, { message: 'Debes ingresar un precio mayor igual a 0' }),
    productDescription: zod
      .string()
      .max(100, { message: 'La descripcion no puede ser mayor a 100 caracteres' })
      .optional(),
    visible: zod.boolean().default(true),
    choices: zod
      .array(
        zod.object({
          productChoiceId: zod.number().default(0),
          choice: zod.string().min(2, { message: 'Debes ingresar el texto de la elección' }),
          quantity: zod
            .number({ message: 'Debes ingresar la cantidad que se puede escoger' })
            .min(1, { message: 'La cantidad minima es 1' }),
          required: zod.boolean().default(false),
          visible: zod.boolean().default(true),
          options: zod
            .array(
              zod.object({
                choiceOptionId: zod.number().default(0),
                optionPrice: zod
                  .number()
                  .min(0, { message: 'Debes ingresar un precio mayor igual a 0' }),
                visible: zod.boolean(),
                productId: zod.any()
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

const { handleSubmit, setErrors, defineField, setFieldError, errors } = useForm({
  validationSchema,
  initialValues: {
    ...props.product,
    image: undefined,
    choices: props.product.choices.map((c) => ({
      ...c,
      options: c.options.map((o) => ({
        ...o,
        productId: props.products.find((x) => x.productId === o.productId)
      }))
    }))
  }
})

const [choices] = defineField('choices')
const [productPrice] = defineField('productPrice')
const [image] = defineField('image')
const [visible] = defineField('visible')

const generalErrors = ref<GeneralErrorsType>(null)

const toast = useToast()

const { isPending, mutate: updateProduct } = useMutation({
  mutationFn: (request: UpdateProductRequest) => ProductService.Update(request),
  onSuccess(response) {
    if (response.ok) {
      router.push({ name: 'products', params: { tenantId: props.tenantId } })

      toast.add({
        severity: 'success',
        summary: 'Producto Actualizado',
        detail: 'Se ha actualizado el producto correctamente',
        life: 5000,
        closable: true
      })
      return
    }

    generalErrors.value = response.generalErrors

    if (response.errors !== null) {
      setErrors(response.errors!)
      return
    }
  }
})

const onSelectFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  image.value = target.files![0]
}

const onSubmit = handleSubmit((values) => {
  let isError = false

  values.choices.forEach((choice, index) => {
    choice.options.forEach((option, optionIndex) => {
      if (!option.productId.productId) {
        isError = true
        setFieldError(
          `choices.${index}.options.${optionIndex}.productId`,
          'Debes selecciónar un producto'
        )
      }
    })
  })

  if (isError) {
    return
  }

  updateProduct({
    ...values,
    productId: props.productId,
    tenantId: props.tenantId,
    image: image.value,
    choices: values.choices.map((x) => ({
      ...x,
      options: x.options.map((y) => ({ ...y, productId: y.productId.productId }))
    }))
  })
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-10">
    <Card :class="`max-w-[400px] pr-0 ${products.length > 0 && 'md:min-w-full'}`">
      <template #title>
        <h1 class="text-center">Actualizar producto para la tienda {{ tenantName }}</h1>
      </template>
      <template #content>
        <form
          @submit.prevent="onSubmit"
          :class="
            products.length > 0 &&
            'overflow-y-auto md:grid md:grid-cols-3 h-[80vh] max-h-[80vh]: gap-10 scrollbar pr-3 md:pr-0'
          "
        >
          <div class="p-0.5">
            <AppInputGroup label="Nombre" id="productName" name="productName" />
            <AppInputGroup label="Descripcion" id="productDescription" name="productDescription" />
            <AppInputGroup label="Precio" id="productPrice" name="productPrice">
              <InputNumber
                v-model="productPrice"
                input-id="productPrice"
                mode="currency"
                currency="HNL"
                locale="es-HN"
                input-class="w-full"
              />
            </AppInputGroup>
            <AppInputGroup label="Visible (Para usuarios)" id="visible" name="visible">
              <ToggleSwitch id="visible" v-model="visible" />
            </AppInputGroup>
            <AppInputGroup label="Imagen" id="iamge" name="iamge" class="overflow-hidden">
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

            <tempalte v-if="props.product.image">
              <img
                :src="`${imageCdn}/${props.productId}`"
                :alt="props.product.productName"
                class="mb-5"
              />
            </tempalte>

            <Button type="submit" :disabled="isPending" class="w-full mb-5 lg:mb-0"
              >Actualizar producto</Button
            >
            <GeneralErrors :generalErrors="generalErrors" />
          </div>
          <div class="overflow-y-auto scrollbar p-0.5 md:pr-4 col-span-2">
            <template v-if="products.length > 0">
              <FieldArray name="choices" v-slot="{ fields, push, remove }">
                <fieldset class="InputGroup" v-for="(field, idx) in fields" :key="field.key">
                  <AppInputGroup
                    label="Elección"
                    :id="`choice_${idx}`"
                    :name="`choices[${idx}].choice`"
                  />

                  <div class="flex gap-4 items-center">
                    <AppInputGroup
                      class="w-1/2 md:w-32"
                      label="Cantidad"
                      :id="`quantity_${idx}`"
                      :name="`choices[${idx}].quantity`"
                    >
                      <InputNumber
                        :id="`quantity_${idx}`"
                        :name="`choices[${idx}].quantity`"
                        v-model="choices![idx].quantity"
                        :min="0"
                        :input-class="`w-full`"
                      />
                    </AppInputGroup>

                    <AppInputGroup
                      label="Requerido"
                      :id="`required_${idx}`"
                      :name="`choices[${idx}].required`"
                    >
                      <ToggleSwitch :id="`required_${idx}`" v-model="choices![idx].required" />
                    </AppInputGroup>

                    <AppInputGroup
                      label="Visible"
                      :id="`visible_${idx}`"
                      :name="`choices[${idx}].visible`"
                    >
                      <ToggleSwitch :id="`visible_${idx}`" v-model="choices![idx].visible" />
                    </AppInputGroup>
                  </div>

                  <FieldArray
                    :name="`choices[${idx}].options`"
                    v-slot="{ fields: optionsFields, push: optionsPush, remove: optionsRemove }"
                  >
                    <fieldset
                      class="border border-solid border-gray-600 dark:border-gray-300 p-3 flex flex-col md:flex-row md:items-end gap-4 mb-4"
                      v-for="(optionField, optionIndex) in optionsFields"
                      :key="optionField.key"
                    >
                      <AppInputGroup
                        label="Producto"
                        :id="`choices[${idx}].options[${optionIndex}].productId`"
                        :name="`choices[${idx}].options[${optionIndex}].productId`"
                      >
                        <Select
                          :id="`choices[${idx}].options[${optionIndex}].productId`"
                          :name="`choices[${idx}].options[${optionIndex}].productId`"
                          v-model="choices![idx].options[optionIndex].productId"
                          :options="products"
                          optionLabel="productName"
                          placeholder="Seleccióna un producto"
                          class="w-full"
                        />
                      </AppInputGroup>

                      <AppInputGroup
                        label="Precio"
                        :id="`choices[${idx}].options[${optionIndex}].optionPrice`"
                        :name="`choices[${idx}].options[${optionIndex}].optionPrice`"
                      >
                        <InputNumber
                          :id="`price_${optionIndex}`"
                          :name="`choices[${idx}].options[${optionIndex}].optionPrice`"
                          v-model="choices![idx].options[optionIndex].optionPrice"
                          :min="0"
                          :input-class="`w-full`"
                        />
                      </AppInputGroup>
                      <Button
                        class="!text-white mb-5"
                        severity="danger"
                        icon="pi pi-trash"
                        iconPos="right"
                        type="button"
                        @click="optionsRemove(optionIndex)"
                      />
                    </fieldset>
                    <Button
                      type="button"
                      severity="warn"
                      class="mb-5 !text-white mr-5"
                      @click="
                        optionsPush({
                          visible: true,
                          optionPrice: 0,
                          choiceOptionId: 0,
                          productId: 0
                        })
                      "
                      >Añadir opcion</Button
                    >
                  </FieldArray>
                  <Button
                    label="Eliminar elección"
                    class="!text-white mb-5"
                    severity="danger"
                    icon="pi pi-trash"
                    iconPos="right"
                    type="button"
                    @click="remove(idx)"
                  />
                  <p>{{ errors.choices }}</p>
                </fieldset>

                <Button
                  type="button"
                  severity="warn"
                  class="mb-5 !text-white w-full"
                  @click="
                    push({
                      choice: '',
                      quantity: 0,
                      required: false,
                      visible: true,
                      productChoiceId: 0,
                      options: []
                    })
                  "
                  >Añadir elección</Button
                >
              </FieldArray>
            </template>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>
