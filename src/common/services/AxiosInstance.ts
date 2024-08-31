import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const AxiosInstance = axios.create({
  baseURL: API_BASE_URL
})

AxiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.replace('/auth/login')
    }
    throw error
  }
)

/* AxiosInstance.interceptors.request.use(
  function (config) {
    config.withCredentials = true
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
) */

export default AxiosInstance
