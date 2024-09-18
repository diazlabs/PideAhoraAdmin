<script setup lang="tsx">
import { ref, watch } from 'vue'

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
import type { Country, RegisterRequest } from '@/common/types/auth.interface'
import { passwordRegex } from '@/common/utils/regexes'
import InputMask from 'primevue/inputmask'

interface Props {
  countries: Country[]
}

const props = defineProps<Props>()

const validationSchema = toTypedSchema(
  zod.object({
    email: zod
      .string({ message: 'Debes ingresar tu correo' })
      .min(1, { message: 'Debes ingresar tu correo' })
      .email({ message: 'Debe ser un correo válido' }),
    firstName: zod
      .string({ message: 'Debes ingresar tu nombre' })
      .min(1, { message: 'Debes ingresar tu nombre' }),
    lastName: zod
      .string({ message: 'Debes ingresar tu apellido ' })
      .min(1, { message: 'Debes ingresar tu apellido' }),
    phoneNumber: zod
      .string({ message: 'Debes ingresar tu numero de telefono' })
      .min(7, { message: 'Debes ingresar tu numero de telefono' }),
    country: zod.enum(
      props.countries.length > 0
        ? (props.countries.map((x) => x.code) as [string, ...string[]])
        : ['default'],
      { message: 'Debes seleccionar un pais' }
    ),
    password: zod
      .string({ message: 'Debes ingresar una contraseña' })
      .refine(
        (value) => passwordRegex.test(value),
        'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un carácter, una letra minúscula y un número'
      )
  })
)

const { handleSubmit, errors, defineField, setErrors, setFieldValue } = useForm({
  validationSchema
})

const selectedCountry = ref<Country>()
const countryMask = ref()

watch(selectedCountry, () => {
  countryMask.value = props.countries.find((x) => x.code === selectedCountry.value?.code)?.mask
  setFieldValue('country', selectedCountry.value!.code)
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
    }

    generalErrors.value = response.generalErrors
  }
})

const onSubmit = handleSubmit((values) => {
  login(values)
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
          <AppInputGroup label="Pais" id="country" name="country">
            <Select
              v-model="selectedCountry"
              :options="countries"
              optionLabel="name"
              placeholder="Selecciona un pais"
              class="w-full"
              name="country"
            />
          </AppInputGroup>
          <template v-if="countryMask !== undefined">
            <AppInputGroup label="Telefono" id="phoneNumber" name="phoneNumber">
              <InputMask
                id="phone"
                v-model="phoneNumber"
                :mask="countryMask"
                :placeholder="countryMask"
                fluid
                :invalid="errors.phoneNumber !== undefined"
                name="phoneNumber"
              />
            </AppInputGroup>
          </template>
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
          ¿Ya tienes una cuenta?
          <Button as="router-link" label="Inicia sesion" link to="/auth/login" />
        </p>
      </template>
    </Card>
  </div>
</template>
