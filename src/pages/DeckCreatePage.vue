<template>
  <div class="container">
    <NCard title="Creer un deck" class="page-card">
      <NSpace vertical :size="18">
        <NAlert v-if="errorMessage" type="error" :show-icon="true">
          {{ errorMessage }}
        </NAlert>

        <NInput
          v-model:value="deckName"
          size="large"
          placeholder="Nom du deck"
          :maxlength="40"
          show-count
        />

        <NSpace justify="space-between" align="center">
          <NText class="counter-text"
            >{{ selectedCount }}/{{ MAX_CARDS }} cartes selectionnees</NText
          >
        </NSpace>

        <NSpin :show="isLoadingCards">
          <NEmpty
            v-if="!isLoadingCards && cards.length === 0"
            description="Aucune carte disponible"
          />

          <CardGrid
            v-else
            :cards="cards"
            size="sm"
            selectable
            :selected-ids="selectedCardIds"
            :max-selected="MAX_CARDS"
            @update:selected-ids="selectedCardIds = $event"
          />
        </NSpin>

        <NButton
          type="primary"
          size="large"
          block
          :loading="isSubmitting"
          :disabled="!canSubmit"
          @click="handleCreateDeck"
        >
          Creer le deck
        </NButton>
      </NSpace>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import CardGrid from '../components/cards/CardGrid.vue'
import { useApi } from '../composables/useApi.js'
import { ROUTES } from '../router.js'
import type { Card } from '../types/index.js'

const MAX_CARDS = 10

const api = useApi()
const router = useRouter()
const message = useMessage()

const cards = ref<Card[]>([])
const deckName = ref('')
const selectedCardIds = ref<string[]>([])

const isLoadingCards = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const selectedCount = computed(() => selectedCardIds.value.length)
const hasValidDeckName = computed(() => deckName.value.trim().length > 0)
const hasExactCardCount = computed(() => selectedCount.value === MAX_CARDS)
const canSubmit = computed(
  () =>
    hasValidDeckName.value && hasExactCardCount.value && !isSubmitting.value,
)
// fetch all the deck when the component is mounted
const fetchCards = async () => {
  try {
    errorMessage.value = ''
    isLoadingCards.value = true
    cards.value = await api.getCards()
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Impossible de charger les cartes'
  } finally {
    isLoadingCards.value = false
  }
}
// handleCreateDeck -> called when the use clicks on "creer le deck". send api requests
const handleCreateDeck = async () => {
  if (!canSubmit.value) return

  try {
    errorMessage.value = ''
    isSubmitting.value = true

    const cardsById = new Map(
      cards.value.map((card) => {
        const rawId = (card as { id: string | number }).id
        return [String(rawId), rawId]
      }),
    )
    const payloadCardIds = selectedCardIds.value.map(
      (id) => cardsById.get(id) ?? id,
    )

    await api.createDeck({
      name: deckName.value.trim(),
      cards: payloadCardIds,
    })

    message.success('Deck cree')
    await router.push(ROUTES.HOME)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Impossible de creer le deck'
  } finally {
    isSubmitting.value = false
  }
}
// Fetch the cards when the component is mounted
onMounted(() => {
  void fetchCards()
})
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  padding-top: 28px;
}

.page-card {
  width: min(100%, 860px);
}

.counter-text {
  font-weight: 700;
}
</style>
