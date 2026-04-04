<template>
  <div class="action-bar">
    <NText strong>
      {{ isMyTurn ? 'Votre tour' : "Tour de l'adversaire" }}
    </NText>

    <div class="actions">
      <NButton size="small" :disabled="!canDraw" @click="$emit('draw')">
        Piocher
      </NButton>

      <NButton
        size="small"
        type="error"
        :disabled="!canAttack"
        @click="$emit('attack')"
      >
        Attaquer
      </NButton>

      <NButton
        size="small"
        type="warning"
        :disabled="!canEndTurn"
        @click="$emit('end-turn')"
      >
        Fin de tour
      </NButton>
    </div>

    <div v-if="message" class="game-message">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    isMyTurn?: boolean
    canDraw?: boolean
    canAttack?: boolean
    canEndTurn?: boolean
    message?: string
  }>(),
  {
    isMyTurn: false,
    canDraw: false,
    canAttack: false,
    canEndTurn: false,
    message: '',
  },
)

defineEmits<(e: 'draw' | 'attack' | 'end-turn') => void>()
</script>

<style scoped>
.action-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
}
.actions {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}
.game-message {
  margin-top: 8px;
  color: #888;
  font-size: 14px;
  text-align: center;
}
</style>
