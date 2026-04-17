<template>
  <div class="home-page">
    <DeckList />
  </div>
</template>

<script setup lang="ts">
import DeckList from '@/components/decks/DeckList.vue'
</script>

<style scoped>
.home-page {
  width: 100%;
  max-width: 1100px;
  margin: 24px auto;
}
</style>
