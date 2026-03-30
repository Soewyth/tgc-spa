<template>
  <article
    class="pokemon-card"
    :class="[
      `size-${size}`,
      {
        'is-selectable': selectable,
        'is-selected': selected,
        'is-disabled': disabled,
      },
    ]"
    @click="handleClick"
  >
    <img :src="imageSrc" :alt="card.name" class="card-image" loading="lazy" />

    <div class="card-header">
      <NText depth="3" class="pokedex">#{{ formattedPokedex }}</NText>
      <NTag
        size="small"
        round
        :bordered="false"
        :color="{ color: typeColor, textColor: '#fff' }"
      >
        {{ card.type }}
      </NTag>
    </div>

    <NText strong class="card-name">{{ card.name }}</NText>

    <div class="stats-row">
      <NText>❤️ {{ card.hp }}</NText>
      <NText>⚔️ {{ card.attack }}</NText>
    </div>

    <div v-if="hasCurrentHp" class="hp-track">
      <NText depth="3" class="hp-label"
        >Current HP: {{ safeCurrentHp }} / {{ card.hp }}</NText
      >
      <NProgress
        type="line"
        :show-indicator="false"
        :height="8"
        :percentage="hpPercent"
        :color="hpColor"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useColors } from '../../composables/useColors.js'
import type { Card } from '../../types/index.js'

const props = withDefaults(
  defineProps<{
    card: Card
    size?: 'sm' | 'md'
    selectable?: boolean
    selected?: boolean
    disabled?: boolean
    currentHp?: number
  }>(),
  {
    size: 'md',
    selectable: false,
    selected: false,
    disabled: false,
    currentHp: undefined,
  },
)

const emit = defineEmits<(e: 'select', cardId: string) => void>()

const { getTypeColor, hpColor: getHpColor } = useColors()

const formattedPokedex = computed(() =>
  String(props.card.pokedexNumber).padStart(3, '0'),
)
const typeColor = computed(() => getTypeColor(props.card.type))
const imageSrc = computed(() => props.card.imageUrl || props.card.imgUrl || '')

const hasCurrentHp = computed(() => props.currentHp !== undefined)
const safeCurrentHp = computed(() => Math.max(0, props.currentHp ?? 0))
const hpPercent = computed(() => {
  if (props.card.hp <= 0) return 0
  const raw = (safeCurrentHp.value / props.card.hp) * 100
  return Math.max(0, Math.min(100, raw))
})
const hpColor = computed(() => getHpColor(hpPercent.value))

const handleClick = () => {
  if (!props.selectable || props.disabled) return
  emit('select', props.card.id)
}
</script>

<style scoped>
.pokemon-card {
  border: 2px solid #d8dee9;
  border-radius: 14px;
  padding: 12px;
  background: linear-gradient(170deg, #ffffff 0%, #f7f9fc 100%);
  display: grid;
  gap: 10px;
  transition:
    transform 0.14s ease,
    box-shadow 0.14s ease,
    border-color 0.14s ease;
}

.size-sm {
  width: 180px;
}

.size-md {
  width: 230px;
}

.pokemon-card.is-selectable {
  cursor: pointer;
}

.pokemon-card.is-selectable:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgb(17 24 39 / 12%);
}

.pokemon-card.is-selected {
  border-color: #18a058;
  box-shadow: 0 0 0 2px rgb(24 160 88 / 18%);
}

.pokemon-card.is-disabled {
  opacity: 0.45;
  filter: grayscale(0.2);
  cursor: not-allowed;
}

.card-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 10px;
  background: #eceff4;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.pokedex {
  font-size: 12px;
}

.card-name {
  font-size: 18px;
  line-height: 1.2;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-weight: 600;
}

.hp-track {
  display: grid;
  gap: 4px;
}

.hp-label {
  font-size: 12px;
}
</style>
