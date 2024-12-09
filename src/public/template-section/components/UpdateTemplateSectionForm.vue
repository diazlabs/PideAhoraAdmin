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
import router from '@/router'
import type { SectionById, UpdateSectionRequest } from '@/common/types/section.interface'
import type { Product } from '@/common/types/product.interface'
import type { DataTableRowReorderEvent } from 'primevue/datatable'
import { useToast } from 'primevue/usetoast'
import SectionService from '@/common/services/SectionService'

const props = defineProps<{
  tenantTemplateId: string
  tenantId: string
  products: Product[]
  section: SectionById
}>()

const validationSchema = toTypedSchema(
  zod.object({
    sectionName: zod
      .string({ message: 'El nombre de la seccion es requerida' })
      .max(30, { message: 'El nombre de la pagina no puede ser mayor a 30 caracteres' }),
    sectionDescription: zod
      .string({ message: 'La descripcion es requerida' })
      .min(2, { message: 'La descripcion es requerida' })
      .max(100, { message: 'La descripcion no pouede ser mayor a 100 caracteres' }),
    visible: zod.boolean().default(false),
    products: zod
      .array(
        zod.object({
          productId: zod.number({ message: 'Debes seleccionar un producto es requerido' }),
          order: zod.number()
        })
      )
      .default([]),
    configs: zod
      .array(
        zod.object({
          sectionConfigId: zod.number(),
          configName: zod
            .string({ message: 'El nombre de la configuraion es requerido' })
            .min(2, { message: 'El nombre de la configuracion no puede ser menor a 2 caracteres' })
            .max(30, {
              message: 'El nombre de la configuracion no puede ser mayor a 30 caracteres'
            }),
          configValue: zod
            .string({ message: 'El valor de la configuracion es requerido' })
            .min(2, { message: 'El valor de la configuracion no puede ser menor a 2 caracteres' })
            .max(100, 'El valor de la configuracion no puede ser mayor a 100 caracteres')
        })
      )
      .default([])
  })
)

const { handleSubmit, setErrors, errors, defineField } = useForm({
  validationSchema,
  initialValues: {
    ...props.section,
    configs: props.section.configurations.map((x) => ({
      configName: x.sectionConfigName,
      configValue: x.sectionConfigValue,
      sectionConfigId: x.sectionConfigId
    })),
    products: props.section.products
  }
})

const visible = ref<boolean>(props.section.visible)
const [sectionDescription] = defineField('sectionDescription')
const [configs] = defineField('configs')
const selectedProduct = ref<Product>()
const filteredProducts = ref<Product[]>(
  props.products.filter((x) => !props.section.products.some((y) => y.productId === x.productId))
)
const selectedProducts = ref<Product[]>(
  props.section.products.map((x) => ({
    productId: x.productId,
    productName: x.productName,
    image: '',
    productPrice: 0,
    productDescription: '',
    productType: '',
    visible: false
  }))
)

const generalErrors = ref<GeneralErrorsType>(null)

const toast = useToast()

const { isPending, mutate: updateTemplateSection } = useMutation({
  mutationFn: (request: UpdateSectionRequest) => SectionService.Update(request),
  onSuccess(response) {
    if (response.ok) {
      router.push({ name: 'templates', params: { tenantId: props.tenantId } })

      toast.add({
        severity: 'success',
        summary: 'Seccion actualizada',
        detail: 'Se ha actualizado la seccion correctamente',
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

const onRowReorder = ({ dragIndex, dropIndex }: DataTableRowReorderEvent) => {
  const productDrag = selectedProducts.value[dragIndex]
  const productDrop = selectedProducts.value[dropIndex]

  selectedProducts.value[dragIndex] = productDrop
  selectedProducts.value[dropIndex] = productDrag
}

const onAddProduct = () => {
  if (selectedProduct.value === undefined) return

  if (selectedProducts.value.find((x) => x.productId === selectedProduct.value!.productId)) return

  filteredProducts.value = filteredProducts.value.filter(
    (x) => x.productId !== selectedProduct.value!.productId
  )
  selectedProducts.value.push(selectedProduct.value)
}

const onRemoveProduct = (productId: number) => {
  const product = selectedProducts.value.find((x) => x.productId === productId)

  if (product === undefined) return
  filteredProducts.value.push(product)

  selectedProducts.value = selectedProducts.value.filter((x) => x.productId !== productId)
}

const onSubmit = handleSubmit((values) => {
  updateTemplateSection({
    ...values,
    templateSectionId: props.section.templateSectionId,
    tenantTemplateId: props.tenantTemplateId,
    tenantId: props.tenantId,
    visible: visible.value,
    products: selectedProducts.value.map((x, index) => ({
      productId: x.productId,
      order: index + 1
    }))
  })
})
</script>

<template>
  <div class="flex justify-center p-5">
    <Card class="max-w-[400px] w-full min-h-96">
      <template #title>
        <h1 class="text-center">Actualizar seccion</h1>
      </template>
      <template #content>
        <form @submit.prevent="">
          <Tabs value="0" scrollable>
            <TabList>
              <Tab value="0">Datos de la seccion</Tab>
              <Tab value="1">Productos</Tab>
              <Tab value="2">Configuraciones</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="0">
                <AppInputGroup label="Nombre de la seccion" id="sectionName" name="sectionName" />
                <AppInputGroup
                  label="Descripcion"
                  id="sectionDescription"
                  name="sectionDescription"
                >
                  <Textarea
                    v-model="sectionDescription"
                    label="sectionDescription"
                    name="sectionDescription"
                    rows="4"
                    auto-resize
                    class="w-full"
                  />
                </AppInputGroup>
                <AppInputGroup label="Visible (Para usuarios)" id="visible" name="visible">
                  <ToggleSwitch v-model="visible" />
                </AppInputGroup>
              </TabPanel>
              <TabPanel value="1">
                <AppInputGroup label="Producto" id="products" name="products">
                  <Select
                    id="products"
                    name="products"
                    v-model="selectedProduct"
                    :options="filteredProducts"
                    optionLabel="productName"
                    placeholder="Seleccióna un producto"
                    class="w-full"
                  />
                </AppInputGroup>
                <Button
                  type="button"
                  severity="warn"
                  class="mb-5 !text-white w-full"
                  @click="onAddProduct"
                  >Añadir producto</Button
                >
                <p v-show="selectedProducts.length > 0" class="mb-4">
                  Nota: puedes ordernar los productos para que aparezcan en ese orden.
                </p>
                <DataTable
                  v-show="selectedProducts.length > 0"
                  :value="selectedProducts"
                  @row-reorder="onRowReorder"
                >
                  <Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false" />
                  <Column field="productName" header="Producto">
                    <template #body="slotProps">
                      <div class="flex gap-3 justify-between items-center">
                        <span>{{ slotProps.data.productName }}</span>
                        <Button
                          @click="onRemoveProduct(slotProps.data.productId)"
                          type="button"
                          v-tooltip="'Eliminar producto'"
                          severity="danger"
                          icon="pi pi-trash"
                        />
                      </div> </template
                  ></Column>
                </DataTable>
              </TabPanel>
              <TabPanel value="2">
                <FieldArray v-if="configs !== undefined" name="configs" v-slot="{ fields }">
                  <fieldset class="InputGroup" v-for="(field, idx) in fields" :key="field.key">
                    <AppInputGroup
                      :label="configs[idx].configName"
                      :id="`configs_${idx}.configValue`"
                      :name="`configs[${idx}].configValue`"
                    />
                    <p>{{ errors.configs }}</p>
                  </fieldset>
                </FieldArray>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Button type="button" @click="onSubmit" :disabled="isPending" class="w-full mb-5"
            >Actualizar seccion</Button
          >
          <GeneralErrors :generalErrors="generalErrors" />
        </form>
      </template>
    </Card>
  </div>
</template>
