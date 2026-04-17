<template>
  <NGrid
    responsive="screen"
    cols="2 s:3 m:4 l:5"
    :x-gap="12"
    :y-gap="12"
    class="card-grid"
  >
    <NGi v-for="card in cards" :key="card.id">
      <PokemonCard
        :card="card"
        :size="size"
        :selectable="selectable"
        :selected="selectedIds.includes(card.id)"
        :disabled="isCardDisabled(card.id)"
        :current-hp="currentHpByCardId?.[card.id]"
        @select="toggleCard"
      />
    </NGi>
  </NGrid>
</template>

<script setup lang="ts">
import PokemonCard from '@/components/cards/PokemonCard.vue'
import type { Card } from '@/types'

interface Props {
  cards: Card[]
  size?: 'sm' | 'md'
  selectable?: boolean
  selectedIds?: number[]
  maxSelected?: number
  currentHpByCardId?: Record<number, number>
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  selectable: false,
  selectedIds: () => [],
  maxSelected: undefined,
  currentHpByCardId: undefined,
})

const emit = defineEmits<{
  'update:selectedIds': [value: number[]]
}>()

const isCardDisabled = (cardId: number) => {
  if (!props.selectable) return false
  if (props.selectedIds.includes(cardId)) return false
  if (typeof props.maxSelected !== 'number') return false

  return props.selectedIds.length >= props.maxSelected
}

const toggleCard = (cardId: number) => {
  if (!props.selectable) return
  if (isCardDisabled(cardId)) return

  if (props.selectedIds.includes(cardId)) {
    emit(
      'update:selectedIds',
      props.selectedIds.filter((id) => id !== cardId),
    )
    return
  }

  emit('update:selectedIds', [...props.selectedIds, cardId])
}
</script>

<style scoped>
.card-grid {
  width: 100%;
}
</style>
