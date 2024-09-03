<script setup lang="tsx">
import { ref } from 'vue'

import AuthService from '@/common/services/AuthService'
import AppInputGroup from '@/components/Inputs/AppInputGroup.vue'
import GeneralErrors from '@/components/Errors/GeneralErrors.vue'

import Card from 'primevue/card'
import Password from 'primevue/password'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as zod from 'zod'
import { useMutation } from '@tanstack/vue-query'

import type { GeneralErrorsType } from '@/common/types/api.interface'
import type { ChangePasswordRequest } from '@/common/types/auth.interface'
import { passwordRegex } from '@/common/utils/regexes'
import router from '@/router'

const validationSchema = toTypedSchema(
  zod
    .object({
      oldPassword: zod
        .string({ message: 'Debes ingresar tu contraseña actual' })
        .min(4, { message: 'Debes ingresar tu contraseña actual' }),
      newPassword: zod
        .string({ message: 'Debes ingresar tu nueva contraseña' })
        .refine(
          (value) => passwordRegex.test(value),
          'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un carácter, una letra minúscula y un número'
        ),
      confirmPassword: zod.string({ message: 'Debes confirmar tu nueva contraseña' })
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword']
    })
)

const { handleSubmit, errors, defineField, setErrors } = useForm({
  validationSchema
})

const [oldPassword] = defineField('oldPassword')
const [newPassword] = defineField('newPassword')
const [confirmPassword] = defineField('confirmPassword')

const generalErrors = ref<GeneralErrorsType>(null)

const { isPending, mutate: changePassword } = useMutation({
  mutationFn: (request: ChangePasswordRequest) => AuthService.ChangePassword(request),
  onSuccess(response) {
    if (response.ok) {
      return
    }

    if (response.errors !== null) {
      setErrors(response.errors!)
      return
    }

    generalErrors.value = response.generalErrors
  }
})

const onSubmit = handleSubmit((request) => {
  changePassword(request)
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-5">
    <Card class="max-w-[400px] w-full">
      <template #title>
        <h1 class="text-center">Cambiar contraseña</h1>
      </template>
      <template #content>
        <form @submit.prevent="onSubmit">
          <AppInputGroup label="Contraseña" id="oldPassword" name="oldPassword" icon="pi-lock">
            <Password
              class="w-full"
              id="oldPassword"
              placeholder="*******"
              toggleMask
              v-model="oldPassword"
              :inputProps="{ autocomplete: 'current-password', class: 'w-full', name: 'password' }"
              :feedback="false"
              :invalid="errors.oldPassword !== undefined"
            />
          </AppInputGroup>
          <AppInputGroup
            label="Nueva Contraseña"
            id="newPassword"
            name="newPassword"
            icon="pi-lock"
          >
            <Password
              class="w-full"
              id="newPassword"
              placeholder="*******"
              toggleMask
              v-model="newPassword"
              :inputProps="{ autocomplete: 'new-password', class: 'w-full', name: 'password' }"
              :feedback="false"
              :invalid="errors.newPassword !== undefined"
            />
          </AppInputGroup>
          <AppInputGroup
            label="Confirmar Contraseña"
            id="confirmPassword"
            name="confirmPassword"
            icon="pi-lock"
          >
            <Password
              class="w-full"
              id="confirmPassword"
              placeholder="*******"
              toggleMask
              v-model="confirmPassword"
              :inputProps="{ autocomplete: 'new-password', class: 'w-full', name: 'password' }"
              :feedback="false"
              :invalid="errors.confirmPassword !== undefined"
            />
          </AppInputGroup>
          <Button type="submit" :disabled="isPending" class="w-full mb-5">Cambiar</Button>
          <GeneralErrors :generalErrors="generalErrors" />
        </form>
      </template>
      <template #footer>
        <div class="flex items-center justify-end">
          <Button as="a" label="Cancelar" severity="warn" @click="router.go(-1)" />
        </div>
      </template>
    </Card>
  </div>
</template>
