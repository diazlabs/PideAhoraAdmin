export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: number
  country: string
}

export interface RegisterResponse {}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordResponse {}
