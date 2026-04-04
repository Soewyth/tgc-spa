<template>
  <NModal
    :show="true"
    preset="card"
    title="Fin de la partie"
    style="max-width: 340px"
  >
    <div class="modal-content">
      <NText strong>
        {{ winner === myRole ? 'Victoire !' : 'Défaite...' }}
      </NText>

      <NButton block type="primary" class="mt-16" @click="emitReset">
        Retour au lobby
      </NButton>
    </div>
  </NModal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useGameStore } from '@/stores/game'

defineProps<{
  winner?: string | null
}>()

const emit = defineEmits<(e: 'reset') => void>()

const { myRole } = storeToRefs(useGameStore())

function emitReset() {
  emit('reset')
}
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 18px 0 8px;
}
.mt-16 {
  margin-top: 16px;
}
</style>
