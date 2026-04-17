<template>
  <NSpace vertical :size="16">
    <NSpace justify="space-between" align="center">
      <NText strong style="font-size: 20px">Mes decks</NText>
      <RouterLink :to="ROUTES.DECK_CREATE">
        <NButton type="primary">Créer un deck</NButton>
      </RouterLink>
    </NSpace>

    <NSpin :show="isLoading">
      <NEmpty
        v-if="!isLoading && decks.length === 0"
        description="Aucun deck pour le moment"
      />

      <NGrid v-else responsive="screen" cols="1 m:2" :x-gap="16" :y-gap="16">
        <NGi v-for="deck in decks" :key="deck.id">
          <NCard :title="deck.name" size="small">
            <NSpace vertical>
              <NSpace :size="4" class="deck-preview-list">
                <img
                  v-for="(cardId, index) in getDeckCardIds(deck)"
                  :key="`${deck.id}-${cardId}-${index}`"
                  :src="cardsMap[cardId]?.imgUrl"
                  :alt="cardsMap[cardId]?.name ?? `Carte ${cardId}`"
                  class="deck-preview-image"
                />
              </NSpace>

              <NText depth="3">10 cartes</NText>

              <NSpace>
                <RouterLink :to="`${ROUTES.DECK_DETAIL}/${deck.id}`">
                  <NButton quaternary>Voir</NButton>
                </RouterLink>
                <RouterLink :to="`${ROUTES.DECK_EDIT}/${deck.id}`">
                  <NButton quaternary type="warning">Modifier</NButton>
                </RouterLink>
                <NPopconfirm @positive-click="removeDeck(deck.id)">
                  <template #trigger>
                    <NButton quaternary type="error">Supprimer</NButton>
                  </template>
                  Supprimer ce deck ?
                </NPopconfirm>
              </NSpace>
            </NSpace>
          </NCard>
        </NGi>
      </NGrid>
    </NSpin>
  </NSpace>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import type { Card, Deck } from '@/types'

const api = useApi()
const message = useMessage()

const isLoading = ref(true)
const decks = ref<Deck[]>([])
const cardsMap = ref<Record<number, Card>>({})

const getDeckCardIds = (deck: Deck) => deck.cards.map((card) => card.cardId)

const loadDecks = async () => {
  decks.value = await api.getMyDecks()
}

const loadCards = async () => {
  const cards = await api.getCards()
  cardsMap.value = cards.reduce(
    (acc, card) => {
      acc[card.id] = card
      return acc
    },
    {} as Record<number, Card>,
  )
}

const loadData = async () => {
  isLoading.value = true
  try {
    await Promise.all([loadDecks(), loadCards()])
  } catch (error) {
    message.error((error as Error).message)
  } finally {
    isLoading.value = false
  }
}

const removeDeck = async (deckId: number) => {
  try {
    await api.deleteDeck(deckId)
    message.success('Deck supprimé')
    await loadDecks()
  } catch (error) {
    message.error((error as Error).message)
  }
}

onMounted(loadData)
</script>

<style scoped>
.deck-preview-list {
  flex-wrap: nowrap;
  overflow-x: auto;
}

.deck-preview-image {
  width: 34px;
  height: 34px;
  border-radius: 4px;
  object-fit: cover;
  background: #f3f3f3;
}
</style>
