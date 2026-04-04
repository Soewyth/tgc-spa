<template>
  <div class="player-hand">
    <div class="hand-cards">
      <PokemonCard
        v-for="card in hand"
        :key="card.id"
        :card="card"
        size="sm"
        :selectable="canPlay"
        :disabled="!canPlay"
        @select="emitPlayCard(card.id)"
      />
    </div>

    <div class="deck-count">Deck : {{ deckCount }} cartes</div>
  </div>
</template>

<script setup lang="ts">
import PokemonCard from '@/components/cards/PokemonCard.vue'
import type { Card } from '@/types/card'

withDefaults(
  defineProps<{
    hand?: Card[]
    deckCount?: number
    canPlay?: boolean
  }>(),
  {
    hand: () => [],
    deckCount: 0,
    canPlay: false,
  },
)

const emit = defineEmits<(e: 'play-card', cardId: string) => void>()

function emitPlayCard(cardId: string) {
  emit('play-card', cardId)
}
</script>

<style scoped>
.player-hand {
  margin-top: 16px;
  width: 100%;
}
.hand-cards {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.deck-count {
  margin-top: 8px;
  text-align: right;
  color: #888;
  font-size: 13px;
}
</style>
