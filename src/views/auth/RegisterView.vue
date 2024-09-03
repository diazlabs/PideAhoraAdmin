<script setup lang="tsx">
import { computed, ref } from 'vue'

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
import type { RegisterRequest } from '@/common/types/auth.interface'
import { passwordRegex } from '@/common/utils/regexes'
import InputMask from 'primevue/inputmask'

const validationSchema = toTypedSchema(
  zod.object({
    email: zod
      .string({ message: 'Debes ingresar tu correo' })
      .min(1, { message: 'Debes ingresar tu correo' })
      .email({ message: 'Debe ser un correo válido' }),
    firstName: zod
      .string({ message: 'Debes ingresar tus nombres' })
      .min(1, { message: 'Debes ingresar tus nombres' }),
    lastName: zod
      .string({ message: 'Debes ingresar tu apellido ' })
      .min(1, { message: 'Debes ingresar tu apellido' }),
    phoneNumber: zod
      .number({ message: 'Debes ingresar tu numero de telefono' })
      .min(8, { message: 'Debes ingresar tu numero de telefono' }),
    country: zod
      .string({ message: 'Debes ingresar seleccionar un pais valido' })
      .min(2, { message: 'Debes ingresar seleccionar un pais valido' }),
    password: zod
      .string({ message: 'Debes ingresar una contraseña' })
      .refine(
        (value) => passwordRegex.test(value),
        'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un carácter, una letra minúscula y un número'
      )
  })
)

const selectedCountry = ref()
const countries = ref([
  { name: 'New York', code: 'NY', mask: '9999-9999' },
  { name: 'Rome', code: 'RM', mask: '(999) 999-999' },
  { name: 'London', code: 'LDN', mask: '999-999-999' },
  { name: 'Istanbul', code: 'IST', mask: '(999) 999-999' },
  { name: 'Paris', code: 'PRS', mask: '(999) 999-999' }
])

const coutryMask = computed(() => {
  return countries.value.find((x) => x.code === selectedCountry.value)?.mask
})

const { handleSubmit, errors, defineField, setErrors } = useForm({
  validationSchema
})

const [password] = defineField('password')
const [phoneNumber] = defineField('phoneNumber')

const generalErrors = ref<GeneralErrorsType>(null)

const { isPending, mutate: login } = useMutation({
  mutationFn: (request: RegisterRequest) => AuthService.Register(request),
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
          <AppInputGroup label="Email" id="email" name="email" placeholder="johndoe@example.com" />
          <AppInputGroup label="Nombre" id="firstName" name="firstName" placeholder="John" />
          <AppInputGroup label="Apellido" id="lastName" name="lastName" placeholder="Doe" />
          <AppInputGroup label="Pais" id="Country" name="Country">
            <Select
              v-model="selectedCountry"
              :options="countries"
              optionLabel="name"
              placeholder="Selecciona un pais"
              class="w-full"
            />
          </AppInputGroup>
          <AppInputGroup label="Telefono" id="phoneNumber" name="phoneNumber">
            <InputMask
              id="phone"
              v-model="phoneNumber"
              :mask="coutryMask"
              :placeholder="coutryMask"
              fluid
            />
          </AppInputGroup>
          <AppInputGroup label="Password" id="password" name="password">
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
