export interface ApiResponse<T> {
  ok: boolean
  data: T | null
  message?: string
  generalErrors: GeneralErrorsType
  errors: ValidationError | null
}

interface ValidationError {
  [x: string]: string[]
}

export type GeneralErrorsType = string[] | null | undefined

export interface Audit {
  creator: string
  createdAt: Date
  modifier?: string
  updatedAt?: Date
}
