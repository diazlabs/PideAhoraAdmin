export interface ApiResponse<T> {
  ok: boolean
  data: T | null
  generalErrors: GeneralErrorsType
  errors: ValidationError | null
}

interface ValidationError {
  [x: string]: string[]
}

export type GeneralErrorsType = string[] | null | undefined