<template>
  <div class="deck-detail-page">
    <NSpace vertical :size="16">
      <NSpace justify="space-between" align="center">
        <NButton quaternary @click="router.push(ROUTES.HOME)">Retour</NButton>
        <RouterLink :to="`${ROUTES.DECK_EDIT}/${deckId}`">
          <NButton type="warning">Modifier</NButton>
        </RouterLink>
      </NSpace>

      <NCard>
        <NSpin :show="isLoading">
          <NEmpty v-if="!deck" description="Deck introuvable" />
          <template v-else>
            <NText strong style="font-size: 24px">{{ deck.name }}</NText>
            <NDivider />
            <CardGrid :cards="deckCards" />
          </template>
        </NSpin>
      </NCard>
    </NSpace>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CardGrid from '@/components/cards/CardGrid.vue'
import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import type { Card, Deck } from '@/types'

const route = useRoute()
const router = useRouter()
const api = useApi()
const message = useMessage()

const isLoading = ref(true)
const deck = ref<Deck | null>(null)
const cardsMap = ref<Record<number, Card>>({})

const deckId = computed(() => Number(route.params.id))
const deckCards = computed(() => {
  if (!deck.value) return []

  return deck.value.cards
    .map((deckCard) => cardsMap.value[deckCard.cardId])
    .filter((card): card is Card => Boolean(card))
})

const loadData = async () => {
  isLoading.value = true
  try {
    const [deckData, cards] = await Promise.all([
      api.getDeck(deckId.value),
      api.getCards(),
    ])

    deck.value = deckData
    cardsMap.value = cards.reduce(
      (acc, card) => {
        acc[card.id] = card
        return acc
      },
      {} as Record<number, Card>,
    )
  } catch (error) {
    message.error((error as Error).message)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.deck-detail-page {
  width: 100%;
  max-width: 980px;
  margin: 24px auto;
}
</style>
