import { isAxiosError } from 'axios'
import type { ApiResponse } from '../types/api.interface'

const handleHttpError = <T>(error: unknown): ApiResponse<T> => {
  if (isAxiosError(error)) {
    if (error.response) {
      return error.response.data
    } /* else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
      console.log('Error', error.message)
    } */

    return {
      ok: false,
      generalErrors: [error.message],
      data: null,
      errors: null
    }
  } else if (error instanceof Error) {
    return { ok: false, generalErrors: [error.message], data: null, errors: null }
  }

  return {
    ok: false,
    generalErrors: ['Ha ocurrido un error inesperado'],
    data: null,
    errors: null
  }
}

export default handleHttpError
