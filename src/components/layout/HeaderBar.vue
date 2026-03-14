<template>
  <NLayoutHeader
    bordered
    style="padding: 0 24px; position: sticky; top: 0; z-index: 100"
  >
    <NSpace justify="space-between" align="center" style="height: 56px">
      <NSpace align="center" :size="16">
        <RouterLink to="/">TCG SPA</RouterLink>
        <NButton
          tag="a"
          :href="`${apiBaseUrl.replace('/api', '')}/api-docs`"
          target="_blank"
          text
          size="small"
        >
          API Docs
        </NButton>
        <NButton
          tag="a"
          href="https://making-rerun-61323218.figma.site/"
          target="_blank"
          text
          size="small"
        >
          Maquettes
        </NButton>
      </NSpace>
      <NSpace align="center" :size="16">
        <NText v-if="isAuthenticated" type="info" depth="3">{{
          user?.username
        }}</NText>
        <RouterLink :to="ROUTES.LOGIN">
          <NButton
            v-if="isAuthenticated"
            size="small"
            @click="authStore.logout()"
            >Déconnexion</NButton
          >
        </RouterLink>
      </NSpace>
    </NSpace>
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { ROUTES } from '@/router'
import { userAuthStore } from '@/stores/auth.store'

const authStore = userAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string
</script>
