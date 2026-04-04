<template>
  <div class="container">
    <div class="content">
      <DeckList />
      <GameLobby />
    </div>
  </div>
</template>

<script setup lang="ts">
import DeckList from '../components/decks/DeckList.vue'
import GameLobby from '../components/game/GameLobby.vue'
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  padding: 40px 16px 24px;
}

.content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

@media (max-width: 640px) {
  .container {
    padding: 16px 12px 20px;
  }

  .content {
    gap: 20px;
  }
}
</style>
