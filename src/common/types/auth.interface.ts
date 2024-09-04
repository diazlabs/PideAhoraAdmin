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
  phoneNumber: string
  country: string
}

export interface RegisterResponse {}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordResponse {}

export interface ResetPasswordRequest {
  token: string
  password: string
  email: string
}

export interface Country {
  name: string
  code: string
  prefix: string
  mask: string
}
