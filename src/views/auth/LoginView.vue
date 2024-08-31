<script setup lang="tsx">
import { ref } from 'vue'

import { useAuthStore } from '../../stores/auth'
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
import type { LoginRequest } from '@/common/types/auth.interface'

const validationSchema = toTypedSchema(
  zod.object({
    email: zod
      .string({ message: 'Debes ingresar tu correo' })
      .min(1, { message: 'Debes ingresar tu correo' })
      .email({ message: 'Debe ser un correo válido' }),
    password: zod
      .string({ message: 'Debes ingresar tu contraseña' })
      .min(4, { message: 'Debes ingresar tu contraseña' })
  })
)
const { handleSubmit, errors, defineField, setErrors } = useForm({
  validationSchema
})

const [password] = defineField('password')

const authStore = useAuthStore()

const generalErrors = ref<GeneralErrorsType>(null)

const { isPending, mutate: login } = useMutation({
  mutationFn: (request: LoginRequest) => AuthService.Login(request),
  onSuccess(response) {
    if (response.ok) {
      authStore.login(response.data!)
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
  login(request)
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-5">
    <Card class="max-w-[400px] w-full">
      <template #title>
        <h1 class="text-center">Pide Ahora admin</h1>
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
          <AppInputGroup label="Password" id="password" name="password" icon="pi-lock">
            <Password
              class="w-full"
              id="password"
              placeholder="*******"
              toggleMask
              v-model="password"
              :inputProps="{ autocomplete: 'current-password', class: 'w-full', name: 'password' }"
              :feedback="false"
              :invalid="errors.password !== undefined"
            />
          </AppInputGroup>
          <Button type="submit" :disabled="isPending" class="w-full mb-5">Inicia sesión</Button>
          <GeneralErrors :generalErrors="generalErrors" />
        </form>
      </template>
      <template #footer>
        <p class="flex items-center">
          ¿Olvidate tu contraseña?
          <Button as="a" label="Restablecer" link href="/auth/forgot-password" />
        </p>
      </template>
    </Card>
  </div>
</template>
