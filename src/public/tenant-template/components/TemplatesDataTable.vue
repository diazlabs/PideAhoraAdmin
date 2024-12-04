<script setup lang="ts">
import { useMutation, type RefetchOptions } from '@tanstack/vue-query'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { imageCdn } from '@/common/constants/cdn'
import type { TemplateById } from '@/common/types/template.interface'
import TemplateService from '@/common/services/TemplateService'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  templates: TemplateById[]
  tenantId: string
  refetch: (options?: RefetchOptions) => Promise<any>
}>()

const confirm = useConfirm()
const toast = useToast()
const { isAdmin } = useAuthStore()

const deleteMutation = useMutation({
  mutationFn: (templateId: string) => TemplateService.Delete(props.tenantId, templateId),
  onSuccess(response) {
    if (response.ok) {
      props.refetch()
      toast.add({
        severity: 'info',
        summary: 'Confirmado',
        detail: response.message ?? 'Template eliminado',
        life: 5000,
        closable: true
      })
      return
    }

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: response.generalErrors?.join(', ') ?? 'Error al eliminar el template',
      life: 3000,
      closable: true
    })
  }
})

const deleteConfirmation = (templateId: string, event: any) => {
  confirm.require({
    target: event.currentTarget,
    message: '¿Estas seguro de eliminar este template?',
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
      deleteMutation.mutate(templateId)
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
    <DataTable :value="templates" tableStyle="min-width: 50rem">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">Templates</span>
          <div class="flex gap-4">
            <Button icon="pi pi-refresh" rounded raised @click="refetch()" />
            <Button
              as="router-link"
              target="_blank"
              :to="`/tenant/${tenantId}/create-template`"
              icon="pi pi-plus-circle"
              rounded
              raised
            />
          </div>
        </div>
      </template>
      <Column field="name" header="Nombre"></Column>
      <Column header="Logo">
        <template #body="slotProps">
          <img
            :src="`${imageCdn}/${slotProps.data.logo}`"
            :alt="slotProps.data.name"
            class="w-24 rounded"
          />
        </template>
      </Column>
      <Column field="header" header="Header"></Column>
      <Column field="description" header="Descripcion"></Column>
      <Column field="productId" header="Acciones">
        <template #body="slotProps">
          <div class="flex gap-3">
            <template v-if="isAdmin">
              <Button
                as="router-link"
                target="_blank"
                v-tooltip="'Crear seccion'"
                :to="`/tenant/${tenantId}/templates/${slotProps.data.tenantTemplateId}/create-section`"
                icon="pi pi-plus"
              />
            </template>
            <Button
              as="router-link"
              target="_blank"
              v-tooltip="'Editar template'"
              :to="`/tenant/${tenantId}/templates/${slotProps.data.tenantTemplateId}/update`"
              icon="pi pi-pencil"
            />
            <Button
              @click="($event: any) => deleteConfirmation(slotProps.data.tenantTemplateId, $event)"
              type="button"
              v-tooltip="'Eliminar template'"
              severity="danger"
              icon="pi pi-trash"
            />
          </div>
        </template>
      </Column>
      <template #footer> En total hay {{ templates ? templates.length : 0 }} templates. </template>
    </DataTable>
  </div>
</template>
