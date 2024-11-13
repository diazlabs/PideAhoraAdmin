<script setup lang="ts">
import { useField } from 'vee-validate'
import type { InputHTMLAttributes, InputTypeHTMLAttribute } from 'vue'

type InputAttributes = Omit<InputHTMLAttributes, 'size'>
interface Props {
  label: string
  icon?: string
  type?: InputTypeHTMLAttribute
  placeholder?: string
  name: string
  id?: string
  inputProps?: Partial<InputAttributes>
}

const props = defineProps<Props>()

const { errors, value } = useField(() => props.name)
</script>

<template>
  <div class="flex flex-col gap-2 mb-5">
    <label :for="props?.id">{{ label }}</label>
    <InputGroup>
      <template v-if="icon">
        <InputGroupAddon>
          <i :class="`pi ${icon}`"></i>
        </InputGroupAddon>
      </template>

      <slot>
        <InputText
          :placeholder="placeholder"
          v-model="value as string"
          :type="type ?? 'text'"
          :name="name"
          v-bind="inputProps"
          :invalid="errors.length > 0"
          :id="props?.id"
        />
      </slot>
    </InputGroup>
    <template v-if="errors.length > 0">
      <small v-for="(error, index) in errors" :key="index">{{ error }}</small>
    </template>
  </div>
</template>
