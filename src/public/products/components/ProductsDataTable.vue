<script setup lang="ts">
import type { Product } from '../../../common/types/product.interface'

defineProps<{ products: Product[]; tenantId: string }>()

const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
</script>

<template>
  <div class="card">
    <DataTable :value="products" tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">Productos</span>
          <Button icon="pi pi-refresh" rounded raised />
        </div>
      </template>
      <Column field="productName" header="Nombre"></Column>
      <Column header="Imagen">
        <template #body="slotProps">
          <img
            :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
            :alt="slotProps.data.image"
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
      <template #footer>
        In total there are {{ products ? products.length : 0 }} products.
      </template>
    </DataTable>
  </div>
</template>
