<script setup lang="tsx">
import { ref } from 'vue'

import AuthService from '@/common/services/AuthService'
import AppInputGroup from '@/components/Inputs/AppInputGroup.vue'
import GeneralErrors from '@/components/Errors/GeneralErrors.vue'

import Card from 'primevue/card'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as zod from 'zod'
import { useMutation } from '@tanstack/vue-query'

import type { GeneralErrorsType } from '@/common/types/api.interface'

const validationSchema = toTypedSchema(
  zod.object({
    email: zod
      .string({ message: 'Debes ingresar tu correo' })
      .min(1, { message: 'Debes ingresar tu correo' })
      .email({ message: 'Debe ser un correo válido' })
  })
)
const { handleSubmit, setErrors } = useForm({
  validationSchema
})

const generalErrors = ref<GeneralErrorsType>(null)

const { isPending, mutate: sendResetPassword } = useMutation({
  mutationFn: (email: string) => AuthService.SendResetPassword(email),
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

const onSubmit = handleSubmit(({ email }) => {
  sendResetPassword(email)
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-5">
    <Card class="max-w-[400px] w-full">
      <template #title>
        <h1 class="text-center">Restablecer contraseña</h1>
      </template>
      <template #content>
        <form @submit.prevent="onSubmit">
          <AppInputGroup
            label="Email"
            id="email"
            name="email"
            icon="pi-user"
            placeholder="johndoe@example.com"
          />
          <Button type="submit" :disabled="isPending" class="w-full mb-5">Enviar correo</Button>
          <GeneralErrors :generalErrors="generalErrors" />
        </form>
      </template>
      <template #footer>
        <p class="flex items-center">
          <Button as="a" label="Iniciar sesión" link href="/auth/forgot-password" />
        </p>
      </template>
    </Card>
  </div>
</template>
