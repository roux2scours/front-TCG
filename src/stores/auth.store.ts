import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { User } from '@/types'

export const userAuthStore = defineStore('userAuth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null'),
  )

  const isAuthenticated = computed(() => !!token.value)

  const login = (userData: User, authToken: string) => {
    token.value = authToken
    user.value = userData
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = (): void => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, isAuthenticated, login, logout }
})
