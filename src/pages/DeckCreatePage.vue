<template>
  <div class="deck-form-page">
    <DeckForm />
  </div>
</template>

<script setup lang="ts">
import DeckForm from '@/components/decks/DeckForm.vue'
</script>

<style scoped>
.deck-form-page {
  width: 100%;
  max-width: 980px;
  margin: 24px auto;
}
</style>
