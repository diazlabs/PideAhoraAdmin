<script lang="ts" setup>
import SectionService from '@/common/services/SectionService'
import TemplateService from '@/common/services/TemplateService'
import type { DeleteSectionRequest } from '@/common/types/section.interface'
import type { ArrangeOrder, TempalteSectionDto } from '@/common/types/template.interface'
import { useMutation } from '@tanstack/vue-query'
import type { DataTableRowReorderEvent } from 'primevue/datatable'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'

const props = defineProps<{
  sections: TempalteSectionDto[]
  tenantId: string
}>()

const emit = defineEmits(['deleteSection'])

const confirm = useConfirm()
const toast = useToast()
const rowReOrderEnabled = ref(false)
const filteredSections = ref<TempalteSectionDto[]>([...props.sections])

const arrangeMutation = useMutation({
  mutationFn: (request: ArrangeOrder) => TemplateService.ArrangeSectionOrder(request),
  onSuccess(response) {
    if (response.ok) {
      rowReOrderEnabled.value = !rowReOrderEnabled.value
      emit('deleteSection')
      toast.add({
        severity: 'info',
        summary: 'Confirmado',
        detail: response.message ?? 'El orden de las secciones ha sido modificado',
        life: 5000,
        closable: true
      })
      return
    }

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: response.generalErrors?.join(', ') ?? 'Error al modificar el orden de las secciones',
      life: 3000,
      closable: true
    })
  }
})

const deleteMutation = useMutation({
  mutationFn: (request: DeleteSectionRequest) => SectionService.Delete(request),
  onSuccess(response) {
    if (response.ok) {
      emit('deleteSection')
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

const deleteConfirmation = (tenantTemplateId: string, templateSectionId: number, event: any) => {
  confirm.require({
    target: event.currentTarget,
    message: '¿Estas seguro de eliminar esta seccion?',
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
      deleteMutation.mutate({ tenantId: props.tenantId, tenantTemplateId, templateSectionId })
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

const onRowReorder = ({ dragIndex, dropIndex }: DataTableRowReorderEvent) => {
  const productDrag = filteredSections.value[dragIndex]
  const productDrop = filteredSections.value[dropIndex]

  filteredSections.value[dragIndex] = productDrop
  filteredSections.value[dropIndex] = productDrag
}
</script>

<template>
  <DataTable :value="filteredSections" @row-reorder="onRowReorder">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xl font-bold">Secciones</span>
        <div class="flex gap-4" v-if="filteredSections.length > 0">
          <Button
            v-if="!rowReOrderEnabled"
            @click="rowReOrderEnabled = !rowReOrderEnabled"
            v-tooltip="'Reordenar secciones'"
            icon="pi pi-sort-alt"
            rounded
            raised
          />
          <Button
            v-if="rowReOrderEnabled"
            @click="
              () => {
                arrangeMutation.mutate({
                  tenantId: props.tenantId,
                  sections: filteredSections.map((section, index) => ({
                    templateSectionId: section.templateSectionId,
                    order: index + 1
                  })),
                  tenantTemplateId: props.sections[0].tenantTemplateId
                })
              }
            "
            v-tooltip="'Guardar el nuevo orden las secciones'"
            icon="pi pi-save"
            rounded
            raised
          />
        </div>
      </div>
    </template>
    <Column :rowReorder="rowReOrderEnabled" headerStyle="width: 3rem" :reorderableColumn="false" />
    <Column field="sectionName" header="Nombre de la seccion"></Column>
    <Column field="sectionDescription" header="Descripcion de la seccion"></Column>
    <Column field="productId" header="Acciones">
      <template #body="slotProps">
        <div class="flex gap-3">
          <Button
            as="router-link"
            target="_blank"
            v-tooltip="'Editar seccion'"
            :to="`/tenant/${tenantId}/templates/${slotProps.data.tenantTemplateId}/${slotProps.data.templateSectionId}/update`"
            icon="pi pi-pencil"
          />
          <Button
            @click="
              ($event: any) =>
                deleteConfirmation(
                  slotProps.data.tenantTemplateId,
                  slotProps.data.templateSectionId,
                  $event
                )
            "
            type="button"
            v-tooltip="'Eliminar seccion'"
            severity="danger"
            icon="pi pi-trash"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
