<script setup lang="ts">
import { formatCurrency } from '@/common/utils/intl'
import type { Order } from '@/common/types/order.interface'
import type { RefetchOptions } from '@tanstack/vue-query'
import { ref } from 'vue'

const props = defineProps<{
  orders: Order[]
  tenantId: string
  refetch: (options?: RefetchOptions) => Promise<any>
}>()

const expandedRows = ref<Record<string, boolean>>({})

const expandAll = () => {
  expandedRows.value = props.orders.reduce(
    (acc, p) => (acc[p.orderId] = true) && acc,
    {} as Record<string, boolean>
  )
}
const collapseAll = () => {
  expandedRows.value = {}
}
</script>

<template>
  <div class="card p-6">
    <DataTable
      v-model:expandedRows="expandedRows"
      :value="orders"
      size="small"
      paginator
      removableSort
      sortMode="multiple"
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      stripedRows
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">Ordenes</span>
          <div class="flex gap-4">
            <Button icon="pi pi-refresh" rounded raised @click="refetch()" />
            <Button text icon="pi pi-plus" label="Expand All" @click="expandAll" />
            <Button text icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
          </div>
        </div>
      </template>
      <Column expander style="width: 5rem" />
      <Column field="name" header="Nombre" sortable />
      <Column field="phoneNumber" header="Telefono" />
      <Column field="total" sortable header="Total">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.total) }}
        </template>
      </Column>
      <Column field="createdAt" sortable header="Fecha de creación" />
      <Column field="status" sortable header="Estado de orden" />
      <Column field="orderNotes" header="Notas de orden" />
      <Column field="deliveryNotes" header="Notas de entrega" />
      <Column field="deliveryType" sortable header="Tipo de entrega" />
      <Column field="deliveryAddress" header="Direccion de entrega" />
      <Column field="deliveryDate" sortable header="Fecha de entrega" />
      <Column field="orderId" header="Acciones">
        <template #body="slotProps">
          <div class="flex gap-3">
            <Button
              as="router-link"
              target="_blank"
              :to="`/products/${tenantId}/${slotProps.data.productId}`"
              icon="pi pi-pencil"
            />
          </div>
        </template>
      </Column>
      <template #footer> En total hay {{ orders.length }} productos. </template>

      <template #expansion="slotProps">
        <div class="p-4">
          <h5>Detalles</h5>
          <DataTable :value="slotProps.data.details">
            <Column field="productName" header="Producto" sortable></Column>
            <Column field="image" header="Imagen"></Column>
            <Column field="quantity" header="Cantidad" sortable></Column>
            <Column field="productPrice" header="Precio" sortable>
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.amount) }}
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
  </div>
</template>
