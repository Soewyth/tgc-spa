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
  padding-top: 40px;
}

.home-card {
  width: min(100%, 640px);
}
</style>
