<template>
  <NCard :title="isEditMode ? 'Modifier le deck' : 'Créer un deck'">
    <NSpace vertical :size="16">
      <NForm>
        <NFormItem label="Nom du deck">
          <NInput v-model:value="name" placeholder="Ex: Team Feu" />
        </NFormItem>
      </NForm>

      <NInput
        v-model:value="search"
        placeholder="Rechercher une carte par nom"
        clearable
      />

      <NSpace justify="space-between" align="center">
        <NText>Sélectionnées : {{ selectedIds.length }} / 10</NText>
        <NText depth="3">{{ filteredCards.length }} carte(s) affichée(s)</NText>
      </NSpace>

      <NSpin :show="isLoadingCards || isLoadingDeck">
        <CardGrid
          :cards="filteredCards"
          selectable
          :selected-ids="selectedIds"
          :max-selected="10"
          @update:selected-ids="selectedIds = $event"
        />
      </NSpin>

      <NSpace justify="end">
        <NButton
          type="primary"
          :loading="isSubmitting"
          :disabled="isSubmitDisabled"
          @click="submit"
        >
          {{ isEditMode ? 'Enregistrer' : 'Créer le deck' }}
        </NButton>
      </NSpace>
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import CardGrid from '@/components/cards/CardGrid.vue'
import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import type { Card, Deck } from '@/types'

interface Props {
  deckId?: number
}

const props = defineProps<Props>()

const api = useApi()
const router = useRouter()
const message = useMessage()

const cards = ref<Card[]>([])
const isLoadingCards = ref(true)
const isLoadingDeck = ref(false)
const isSubmitting = ref(false)

const name = ref('')
const selectedIds = ref<number[]>([])
const search = ref('')

const isEditMode = computed(() => typeof props.deckId === 'number')
const filteredCards = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return cards.value
  return cards.value.filter((card) => card.name.toLowerCase().includes(term))
})

const isSubmitDisabled = computed(() => {
  return !name.value.trim() || selectedIds.value.length !== 10
})

const loadCards = async () => {
  isLoadingCards.value = true
  try {
    cards.value = await api.getCards()
  } catch (error) {
    message.error((error as Error).message)
  } finally {
    isLoadingCards.value = false
  }
}

const applyDeck = (deck: Deck) => {
  name.value = deck.name
  selectedIds.value = deck.cards.map((card) => card.cardId)
}

const fillFromDeck = async (deckId: number) => {
  isLoadingDeck.value = true
  try {
    const deck = await api.getDeck(deckId)
    applyDeck(deck)
  } catch (error) {
    message.error((error as Error).message)
  } finally {
    isLoadingDeck.value = false
  }
}

const submit = async () => {
  if (isSubmitDisabled.value) return

  isSubmitting.value = true
  try {
    const payload = {
      name: name.value.trim(),
      cards: selectedIds.value,
    }

    if (isEditMode.value && props.deckId) {
      const deck = await api.updateDeck(props.deckId, payload)
      message.success('Deck mis à jour')
      await router.push(`${ROUTES.DECK_DETAIL}/${deck.id}`)
      return
    }

    await api.createDeck(payload)
    message.success('Deck créé')
    await router.push(ROUTES.HOME)
  } catch (error) {
    message.error((error as Error).message)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await loadCards()
  if (props.deckId) {
    await fillFromDeck(props.deckId)
  }
})
</script>
