<template>
  <div class="game-page">
    <!-- Opponents zone -->
    <GameZone
      :is-opponent="true"
      :ko="opponent?.ko ?? 0"
      :active-card="opponent?.activeCard ?? null"
      :max-ko="3"
    />

    <!-- Action bar -->
    <ActionBar
      :is-my-turn="isMyTurn"
      :can-draw="canDraw"
      :can-attack="canAttack"
      :can-end-turn="canEndTurn"
      :message="game?.message ?? ''"
      @draw="handleDraw"
      @attack="handleAttack"
      @end-turn="handleEndTurn"
    />

    <!-- Player zone -->
    <GameZone
      :is-opponent="false"
      :ko="me?.ko ?? 0"
      :active-card="me?.activeCard ?? null"
      :max-ko="3"
    >
      <PlayerHand
        :hand="me?.hand ?? []"
        :deck-count="me?.deckCount ?? 0"
        :can-play="canPlayCard"
        @play-card="handlePlayCard"
      />
    </GameZone>

    <GameEndModal
      v-if="isGameEnded"
      :winner="game?.winner ?? null"
      @reset="handleReset"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import ActionBar from '@/components/game/ActionBar.vue'
import GameEndModal from '@/components/game/GameEndModal.vue'
import GameZone from '@/components/game/GameZone.vue'
import PlayerHand from '@/components/game/PlayerHand.vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

const { game, me, opponent, isMyTurn, isGameEnded } = storeToRefs(gameStore)

const canDraw = computed(() => {
  if (!me.value) return false
  return isMyTurn.value && me.value.hand.length < 5 && me.value.deckCount > 0
})

const canAttack = computed(() => {
  if (!me.value || !opponent.value) return false
  return isMyTurn.value && !!me.value.activeCard && !!opponent.value.activeCard
})

const canEndTurn = computed(() => isMyTurn.value)

const canPlayCard = computed(() => {
  if (!me.value) return false
  return isMyTurn.value && !me.value.activeCard
})

function handleDraw() {
  gameStore.drawCards()
}

function handleAttack() {
  gameStore.attack()
}

function handleEndTurn() {
  gameStore.endTurn()
}

function handlePlayCard(cardId: string) {
  gameStore.playCard(cardId)
}

function handleReset() {
  gameStore.resetGame()
}
</script>

<style scoped>
.game-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 700px;
  margin: 0 auto;
  padding: 24px 8px;
}
</style>
