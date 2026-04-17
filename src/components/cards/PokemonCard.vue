<template>
  <NCard
    :class="[
      'pokemon-card',
      `pokemon-card--${size}`,
      { 'is-selected': selected, 'is-disabled': disabled },
    ]"
    :content-style="{ padding: size === 'sm' ? '10px' : '14px' }"
    :segmented="{ content: true }"
    @click="handleClick"
  >
    <div class="card-image-wrapper">
      <img :src="card.imgUrl" :alt="card.name" class="card-image" />
    </div>

    <div class="card-header">
      <NText depth="3" class="pokedex-number">#{{ card.pokedexNumber }}</NText>
      <NTag
        size="small"
        :bordered="false"
        :style="{ backgroundColor: typeColor }"
      >
        {{ card.type }}
      </NTag>
    </div>

    <NText strong class="card-name">{{ card.name }}</NText>

    <NSpace justify="space-between" size="small" align="center">
      <NText>HP: {{ card.hp }}</NText>
      <NText>ATK: {{ card.attack }}</NText>
    </NSpace>

    <NProgress
      v-if="typeof currentHp === 'number'"
      type="line"
      :percentage="hpPercent"
      :height="12"
      :show-indicator="false"
      :color="hpColor"
      :rail-color="'rgba(0, 0, 0, 0.08)'"
      style="margin-top: 8px"
    />
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useColors } from '@/composables/useColors'
import type { Card } from '@/types'

interface Props {
  card: Card
  size?: 'sm' | 'md'
  selectable?: boolean
  selected?: boolean
  disabled?: boolean
  currentHp?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  selectable: false,
  selected: false,
  disabled: false,
  currentHp: undefined,
})

const emit = defineEmits<{
  select: [cardId: number]
}>()

const { getTypeColor, hpColor: getHpColor } = useColors()

const typeColor = computed(() => getTypeColor(props.card.type))
const hpPercent = computed(() => {
  if (typeof props.currentHp !== 'number') return 0
  return Math.max(0, Math.min(100, (props.currentHp / props.card.hp) * 100))
})
const hpColor = computed(() => getHpColor(hpPercent.value))

const handleClick = () => {
  if (!props.selectable || props.disabled) return
  emit('select', props.card.id)
}
</script>

<style scoped>
.pokemon-card {
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease;
  border: 2px solid transparent;
}

.pokemon-card:hover {
  transform: translateY(-2px);
}

.pokemon-card.is-selected {
  border-color: #18a058;
  box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.15);
}

.pokemon-card.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.pokemon-card--sm .card-image-wrapper {
  height: 96px;
}

.pokemon-card--md .card-image-wrapper {
  height: 140px;
}

.card-image-wrapper {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
  background: #f5f5f5;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.card-name {
  display: block;
  margin-bottom: 6px;
}

.pokedex-number {
  font-size: 12px;
}
</style>
