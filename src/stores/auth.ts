import { defineStore } from 'pinia'

import { useApi } from '../composables/useApi.js'
import { useStorage } from '../composables/useStorage.js'
import type {
  AuthState,
  SignInPayload,
  SignUpPayload,
  User,
} from '../types/index.js'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

const api = useApi()
const storage = useStorage()

export const useAuthStore = defineStore('auth', {
  // Rehydrate auth state from localStorage on app load
  state: (): AuthState => ({
    token: storage.get<string>(TOKEN_KEY),
    user: storage.get<User>(USER_KEY),
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
    username: (state) => state.user?.username ?? '',
  },

  actions: {
    // Keep Pinia state and localStorage in sync
    setSession(nextToken: string, nextUser: User) {
      this.token = nextToken
      this.user = nextUser
      storage.set(TOKEN_KEY, nextToken)
      storage.set(USER_KEY, nextUser)
    },

    clearSession() {
      this.token = null
      this.user = null
      storage.remove(TOKEN_KEY, USER_KEY)
    },

    async signIn(payload: SignInPayload) {
      try {
        const response = await api.signIn(payload)
        // Persist session right after successful login
        this.setSession(response.token, response.user)
        return response
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error('Impossible de se connecter')
      }
    },

    async signUp(payload: SignUpPayload) {
      try {
        const response = await api.signUp(payload)
        // Auto-login behavior after account creation
        this.setSession(response.token, response.user)
        return response
      } catch (error) {
        throw error instanceof Error
          ? error
          : new Error('Impossible de creer le compte')
      }
    },

    signOut() {
      this.clearSession()
    },
  },
})
