<template>
  <div class="game-zone" :class="{ opponent: isOpponent }">
    <div class="zone-header">
      <NText strong>{{ isOpponent ? 'Adversaire' : 'Vous' }}</NText>
      <NText depth="3">{{ ko }}/{{ maxKo }} KO</NText>
    </div>

    <div class="zone-content">
      <PokemonCard
        v-if="activeCard"
        :card="activeCard"
        :current-hp="activeCard.currentHp"
        size="md"
      />
      <div v-else class="placeholder">Aucune carte active</div>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import PokemonCard from '@/components/cards/PokemonCard.vue'
import type { Card } from '@/types/card'

type CardWithHp = Card & { currentHp?: number }

withDefaults(
  defineProps<{
    isOpponent?: boolean
    ko?: number
    activeCard?: CardWithHp | null
    maxKo?: number
  }>(),
  {
    isOpponent: false,
    ko: 0,
    activeCard: null,
    maxKo: 3,
  },
)
</script>

<style scoped>
.game-zone {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 6%);
  padding: 18px 12px 24px;
  margin-bottom: 12px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.zone-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.zone-content {
  min-height: 120px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.placeholder {
  color: #bbb;
  font-style: italic;
  padding: 24px 0;
}
.opponent {
  background: #f8fafc;
}
</style>
