export interface User {
  id: string
  email: string
  username: string
}

export interface AuthState {
  token: string | null
  user: User | null
}

export interface AuthResponse {
  token: string
  user: User
}

export interface SignInPayload {
  email: string
  password: string
}

export interface SignUpPayload {
  email: string
  password: string
  username: string
}
