import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useApi } from '../composables/useApi.js'
import { useStorage } from '../composables/useStorage.js'
import type { SignInPayload, SignUpPayload, User } from '../types/index.js'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export const useAuthStore = defineStore('auth', () => {
  const api = useApi()
  const storage = useStorage()

  const token = ref<string | null>(storage.get<string>(TOKEN_KEY))
  const user = ref<User | null>(storage.get<User>(USER_KEY))

  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  const setSession = (nextToken: string, nextUser: User) => {
    token.value = nextToken
    user.value = nextUser
    storage.set(TOKEN_KEY, nextToken)
    storage.set(USER_KEY, nextUser)
  }

  const clearSession = () => {
    token.value = null
    user.value = null
    storage.remove(TOKEN_KEY, USER_KEY)
  }

  const signIn = async (payload: SignInPayload) => {
    const response = await api.signIn(payload)
    setSession(response.token, response.user)
    return response
  }

  const signUp = async (payload: SignUpPayload) => {
    const response = await api.signUp(payload)
    setSession(response.token, response.user)
    return response
  }

  const signOut = () => {
    clearSession()
  }

  return {
    token,
    user,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  }
})
