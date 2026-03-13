<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2 class="auth-title">Connexion</h2>
      <NForm>
        <NFormItem label="Email">
          <NInput v-model:value="emailInput" placeholder="Entrez votre email" />
        </NFormItem>
        <NFormItem label="Mot de passe">
          <NInput
            v-model:value="passwordInput"
            type="password"
            placeholder="Entrez votre mot de passe"
          />
        </NFormItem>
        <NButton
          type="primary"
          round
          attr-type="submit"
          :disabled="isLoading"
          @click="handleLogin"
          >Se connecter</NButton
        >
      </NForm>
      <NText type="info" style="margin-top: 16px">
        Pas de compte ?
        <RouterLink :to="ROUTES.SIGNUP">Inscrivez-vous ici</RouterLink>
      </NText>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NForm, NText } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import { userAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = userAuthStore()
const api = useApi()

const emailInput = ref('')
const passwordInput = ref('')

const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  try {
    const { token, user: userResponse } = await api.signIn({
      email: emailInput.value,
      password: passwordInput.value,
    })
    authStore.login(userResponse, token)
    router.push(ROUTES.HOME)
  } catch (_error) {
    alert(
      'Échec de la connexion. Veuillez vérifier vos identifiants et réessayer.',
    )
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-title {
  margin: 0 0 16px;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
}
</style>
