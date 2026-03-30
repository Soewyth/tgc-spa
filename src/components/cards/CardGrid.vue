<template>
  <NSpace wrap :size="[14, 14]" justify="start">
    <PokemonCard
      v-for="card in filteredCards"
      :key="card.id"
      :card="card"
      :size="size"
      :selectable="selectable"
      :selected="selectedSet.has(String(card.id))"
      :disabled="isCardDisabled(String(card.id))"
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

const emit =
  defineEmits<(e: 'update:selectedIds' | 'toggle', ids: string[]) => void>()

const selectedSet = computed(() => new Set(props.selectedIds.map(String)))

const filteredCards = computed(() => {
  const term = props.searchTerm.trim().toLowerCase()
  if (!term) return props.cards
  return props.cards.filter((card) => card.name.toLowerCase().includes(term))
})

const isCardDisabled = (cardId: string) => {
  const normalizedId = String(cardId)
  if (!props.selectable) return false
  if (selectedSet.value.has(normalizedId)) return false
  if (props.maxSelected === undefined) return false
  return selectedSet.value.size >= props.maxSelected
}

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
