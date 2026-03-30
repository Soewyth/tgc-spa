<template>
  <div class="container">
    <DeckList />
  </div>
</template>

<script setup lang="ts">
import DeckList from '../components/decks/DeckList.vue'
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  padding: 40px 16px 24px;
}

@media (max-width: 640px) {
  .container {
    padding: 16px 12px 20px;
  }
}
</style>
