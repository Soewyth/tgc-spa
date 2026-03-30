<template>
  <!-- Responsive grid for displaying cards -->
  <NGrid responsive="screen" :cols="gridCols" :x-gap="12" :y-gap="12">
    <NGridItem v-for="card in filteredCards" :key="card.id">
      <!-- Card component with selection logic -->
      <PokemonCard
        :card="card"
        :size="size"
        :selectable="selectable"
        :selected="selectedSet.has(String(card.id))"
        :disabled="isCardDisabled(String(card.id))"
        @select="toggleCard"
      />
    </NGridItem>
  </NGrid>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Card } from '../../types/index.js'
import PokemonCard from './PokemonCard.vue'

// Props for card grid configuration
const props = withDefaults(
  defineProps<{
    cards: Card[]
    size?: 'sm' | 'md'
    selectable?: boolean
    selectedIds?: (string | number)[]
    maxSelected?: number
    searchTerm?: string
  }>(),
  {
    size: 'md',
    selectable: false,
    selectedIds: () => [],
    maxSelected: undefined,
    searchTerm: '',
  },
)

// Emits for selection events
const emit =
  defineEmits<(e: 'update:selectedIds' | 'toggle', ids: string[]) => void>()

// Set of currently selected card IDs
const selectedSet = computed(() => new Set(props.selectedIds.map(String)))

// Responsive columns based on card size
const gridCols = computed(() =>
  props.size === 'sm' ? '2 m:3 l:4' : '1 m:2 l:3',
)

// Filter cards by search term
const filteredCards = computed(() => {
  const term = props.searchTerm.trim().toLowerCase()
  if (!term) return props.cards
  return props.cards.filter((card) => card.name.toLowerCase().includes(term))
})

// Disable card if selection limit reached
const isCardDisabled = (cardId: string) => {
  const normalizedId = String(cardId)
  if (!props.selectable) return false
  if (selectedSet.value.has(normalizedId)) return false
  if (props.maxSelected === undefined) return false
  return selectedSet.value.size >= props.maxSelected
}

// Toggle card selection
const toggleCard = (cardId: string | number) => {
  const normalizedId = String(cardId)
  if (!props.selectable) return
  if (isCardDisabled(normalizedId)) return

  const nextSelected = new Set(selectedSet.value)

  if (nextSelected.has(normalizedId)) {
    nextSelected.delete(normalizedId)
  } else {
    nextSelected.add(normalizedId)
  }

  const nextIds = [...nextSelected]
  emit('update:selectedIds', nextIds)
  emit('toggle', nextIds)
}
</script>

<style scoped>
.pokemon-card {
  width: 100%;
  box-sizing: border-box;
}
</style>
