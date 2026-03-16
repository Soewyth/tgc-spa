<template>
  <NSpace wrap :size="[14, 14]" justify="start">
    <PokemonCard
      v-for="card in cards"
      :key="card.id"
      :card="card"
      :size="size"
      :selectable="selectable"
      :selected="selectedSet.has(card.id)"
      :disabled="isCardDisabled(card.id)"
      @select="toggleCard"
    />
  </NSpace>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Card } from '../../types/index.js'
import PokemonCard from './PokemonCard.vue'

const props = withDefaults(
  defineProps<{
    cards: Card[]
    size?: 'sm' | 'md'
    selectable?: boolean
    selectedIds?: string[]
    maxSelected?: number
  }>(),
  {
    size: 'md',
    selectable: false,
    selectedIds: () => [],
    maxSelected: undefined,
  },
)

const emit =
  defineEmits<(e: 'update:selectedIds' | 'toggle', ids: string[]) => void>()

const selectedSet = computed(() => new Set(props.selectedIds))

const isCardDisabled = (cardId: string) => {
  if (!props.selectable) return false
  if (selectedSet.value.has(cardId)) return false
  if (props.maxSelected === undefined) return false
  return selectedSet.value.size >= props.maxSelected
}

const toggleCard = (cardId: string) => {
  if (!props.selectable) return
  if (isCardDisabled(cardId)) return

  const nextSelected = new Set(selectedSet.value)

  if (nextSelected.has(cardId)) {
    nextSelected.delete(cardId)
  } else {
    nextSelected.add(cardId)
  }

  const nextIds = [...nextSelected]
  emit('update:selectedIds', nextIds)
  emit('toggle', nextIds)
}
</script>
