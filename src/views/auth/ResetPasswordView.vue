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
import type { ResetPasswordRequest } from '@/common/types/auth.interface'
import { passwordRegex } from '@/common/utils/regexes'
import router from '@/router'

const email = router.currentRoute.value.query.email as string
const token = router.currentRoute.value.query.token as string

if (!email || !token) {
  router.push({ name: 'login' })
}

const validationSchema = toTypedSchema(
  zod.object({
    password: zod
      .string({ message: 'Debes ingresar tu nueva contraseña' })
      .refine(
        (value) => passwordRegex.test(value),
        'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un carácter, una letra minúscula y un número'
      )
  })
)

const { handleSubmit, errors, defineField, setErrors } = useForm({
  validationSchema
})

const [password] = defineField('password')

const generalErrors = ref<GeneralErrorsType>(null)

const { isPending, mutate: resetPasword } = useMutation({
  mutationFn: (request: ResetPasswordRequest) => AuthService.ResetPassword(request),
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

const onSubmit = handleSubmit(({ password }) => {
  resetPasword({
    password,
    email,
    token
  })
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
          <AppInputGroup label="Contraseña" id="password" name="password" icon="pi-lock">
            <Password
              class="w-full"
              id="password"
              placeholder="*******"
              toggleMask
              v-model="password"
              :inputProps="{ autocomplete: 'new-password', class: 'w-full', name: 'password' }"
              :feedback="false"
              :invalid="errors.password !== undefined"
            />
          </AppInputGroup>
          <Button type="submit" :disabled="isPending" class="w-full mb-5">Restablecer</Button>
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
