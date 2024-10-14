<script setup lang="ts">
import { useMutation, type RefetchOptions } from '@tanstack/vue-query'
import type { Product } from '../../../common/types/product.interface'
import { useConfirm } from 'primevue/useconfirm'
import { formatCurrency } from '@/common/utils/intl'
import { useToast } from 'primevue/usetoast'
import ProductService from '@/common/services/ProductService'
import { imageCdn } from '@/common/constants/cdn'

const props = defineProps<{
  products: Product[]
  tenantId: string
  refetch: (options?: RefetchOptions) => Promise<any>
}>()

const confirm = useConfirm()
const toast = useToast()

const deleteMutation = useMutation({
  mutationFn: (productId: number) => ProductService.Delete(props.tenantId, productId),
  onSuccess(response) {
    if (response.ok) {
      props.refetch()
      toast.add({
        severity: 'info',
        summary: 'Confirmado',
        detail: response.message ?? 'Producto eliminado',
        life: 5000,
        closable: true
      })
      return
    }

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: response.generalErrors?.join(', ') ?? 'Error al eliminar el producto',
      life: 3000,
      closable: true
    })
  }
})

const deleteConfirmation = (productId: number, event: any) => {
  confirm.require({
    target: event.currentTarget,
    message: '¿Estas seguro de eliminar este producto?',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Cancelar',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Eliminar',
      severity: 'danger'
    },
    accept: () => {
      deleteMutation.mutate(productId)
    },
    reject: () => {
      toast.add({
        severity: 'error',
        summary: 'Cancelado',
        detail: 'Haz cancelado la acción',
        life: 3000,
        closable: true
      })
    }
  })
}
</script>

<template>
  <div class="card p-6">
    <DataTable :value="products" tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">Productos</span>
          <div class="flex gap-4">
            <Button icon="pi pi-refresh" rounded raised @click="refetch()" />
            <Button
              as="router-link"
              target="_blank"
              :to="`/products/${tenantId}/create-product`"
              icon="pi pi-plus-circle"
              rounded
              raised
            />
          </div>
        </div>
      </template>
      <Column field="productName" header="Nombre"></Column>
      <Column header="Imagen">
        <template #body="slotProps">
          <img
            :src="`${imageCdn}/${slotProps.data.productId}`"
            :alt="slotProps.data.name"
            class="w-24 rounded"
          />
        </template>
      </Column>
      <Column field="productPrice" header="Precio">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.productPrice) }}
        </template>
      </Column>
      <Column field="productDescription" header="Descripcion"></Column>
      <Column field="productType" header="Tipo"></Column>
      <Column field="productId" header="Acciones">
        <template #body="slotProps">
          <div class="flex gap-3">
            <Button
              as="router-link"
              target="_blank"
              :to="`/products/${tenantId}/${slotProps.data.productId}`"
              icon="pi pi-pencil"
            />
            <Button
              @click="($event) => deleteConfirmation(slotProps.data.productId, $event)"
              type="button"
              severity="danger"
              icon="pi pi-trash"
            />
          </div>
        </template>
      </Column>
      <template #footer> En total hay {{ products ? products.length : 0 }} productos. </template>
    </DataTable>
  </div>
</template>
