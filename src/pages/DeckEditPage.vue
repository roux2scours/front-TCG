<template>
  <div class="deck-form-page">
    <DeckForm :deck-id="deckId" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import DeckForm from '@/components/decks/DeckForm.vue'

const route = useRoute()
const deckId = computed(() => Number(route.params.id))
</script>

<style scoped>
.deck-form-page {
  width: 100%;
  max-width: 980px;
  margin: 24px auto;
}
</style>
