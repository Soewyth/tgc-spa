<template>
  <div class="container">
    <NCard title="Modifier le deck" class="page-card">
      <NSpin :show="isLoading">
        <NAlert
          v-if="errorMessage"
          type="error"
          :show-icon="true"
          class="mb-12"
        >
          {{ errorMessage }}
        </NAlert>

        <NSpace v-else vertical :size="18">
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

          <NEmpty
            v-if="!isLoading && cards.length === 0"
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

          <NButton
            type="primary"
            size="large"
            block
            :loading="isSubmitting"
            :disabled="!canSubmit"
            @click="handleUpdateDeck"
          >
            Enregistrer les modifications
          </NButton>
        </NSpace>
      </NSpin>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CardGrid from '../components/cards/CardGrid.vue'
import { useApi } from '../composables/useApi.js'
import { ROUTES } from '../router.js'
import type { Card, Deck } from '../types/index.js'

const MAX_CARDS = 10

const api = useApi()
const route = useRoute()
const router = useRouter()
const message = useMessage()

const cards = ref<Card[]>([])
const deck = ref<Deck | null>(null)
const deckName = ref('')
const selectedCardIds = ref<string[]>([])

const isLoading = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const deckId = computed(() => {
  const rawId = route.params.id
  return typeof rawId === 'string' ? rawId : ''
})

const selectedCount = computed(() => selectedCardIds.value.length)
const hasValidDeckName = computed(() => deckName.value.trim().length > 0)
const hasExactCardCount = computed(() => selectedCount.value === MAX_CARDS)
const canSubmit = computed(
  () =>
    Boolean(deck.value) &&
    hasValidDeckName.value &&
    hasExactCardCount.value &&
    !isLoading.value &&
    !isSubmitting.value,
)

const fetchData = async () => {
  if (!deckId.value) {
    errorMessage.value = 'Identifiant de deck invalide'
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

    const fetchedDeck = await api.getDeck(deckId.value)
    deck.value = fetchedDeck
    deckName.value = fetchedDeck.name
    selectedCardIds.value = fetchedDeck.cards
      .map((entry) => String(entry.cardId || entry.card?.id || ''))
      .filter((id) => id.length > 0)

    try {
      cards.value = await api.getCards()
    } catch {
      const fallbackCards = fetchedDeck.cards
        .map((entry) => entry.card)
        .filter((card): card is Card => Boolean(card))
      cards.value = fallbackCards
      if (fallbackCards.length === 0) {
        errorMessage.value =
          "Impossible de charger les cartes pour l'edition du deck"
      }
    }

    // Keep only selected IDs that exist in the currently displayed catalog.
    const availableIds = new Set(cards.value.map((card) => String(card.id)))
    selectedCardIds.value = selectedCardIds.value.filter((id) =>
      availableIds.has(id),
    )
  } catch (error) {
    const nextMessage =
      error instanceof Error
        ? error.message
        : "Impossible de charger le formulaire d'edition"
    errorMessage.value = nextMessage
  } finally {
    isLoading.value = false
  }
}

const handleUpdateDeck = async () => {
  if (!canSubmit.value || !deckId.value) return

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

    await api.updateDeck(deckId.value, {
      name: deckName.value.trim(),
      cards: payloadCardIds,
    })

    message.success('Deck mis a jour')
    await router.push(ROUTES.deckDetail(deckId.value))
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Impossible de mettre a jour le deck'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  void fetchData()
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

.mb-12 {
  margin-bottom: 12px;
}
</style>
