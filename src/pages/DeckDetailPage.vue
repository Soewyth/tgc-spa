<template>
  <div class="container">
    <NCard :title="deck?.name || 'Detail du deck'" class="page-card">
      <template #header-extra>
        <NButton
          type="primary"
          size="small"
          :disabled="!deck"
          @click="handleEdit"
        >
          Modifier le deck
        </NButton>
      </template>

      <NSpin :show="isLoading">
        <NAlert
          v-if="errorMessage"
          type="error"
          :show-icon="true"
          class="mb-12"
        >
          {{ errorMessage }}
        </NAlert>

        <NSpace v-else-if="deck" vertical :size="16">
          <NText class="count-text">{{ deckCards.length }} / 10 cartes</NText>

          <CardGrid :cards="deckCards" size="sm" />
        </NSpace>

        <NEmpty v-else description="Deck introuvable" />
      </NSpin>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CardGrid from '../components/cards/CardGrid.vue'
import { useApi } from '../composables/useApi.js'
import { ROUTES } from '../router.js'
import type { Card, Deck } from '../types/index.js'

const api = useApi()
const route = useRoute()
const router = useRouter()

const deck = ref<Deck | null>(null)
const cardCatalog = ref<Card[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

const deckId = computed(() => {
  const rawId = route.params.id
  return typeof rawId === 'string' ? rawId : ''
})

// Compute the full card details for the deck
const deckCards = computed(() => {
  if (!deck.value) return []

  return deck.value.cards
    .map((entry) => {
      if (entry.card) return entry.card
      return cardCatalog.value.find(
        (card) => String(card.id) === String(entry.cardId),
      )
    })
    .filter((card): card is Card => Boolean(card))
})
// fetch the deck details from the api and store it in the deck ref
const fetchDeck = async () => {
  if (!deckId.value) {
    errorMessage.value = 'Identifiant de deck invalide'
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''
    deck.value = await api.getDeck(deckId.value)
    try {
      cardCatalog.value = await api.getCards() // all the cards
    } catch {
      // Deck details can still render using embedded card data.
      cardCatalog.value = []
    }
  } catch (error) {
    const nextMessage =
      error instanceof Error ? error.message : 'Impossible de charger ce deck'
    errorMessage.value = nextMessage
  } finally {
    isLoading.value = false
  }
}
// handleEdit -> navigate to the deck edit page
const handleEdit = async () => {
  if (!deckId.value) return
  await router.push(ROUTES.deckEdit(deckId.value))
}

onMounted(() => {
  void fetchDeck()
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

.count-text {
  font-weight: 700;
}

.mb-12 {
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .container {
    padding-top: 16px;
  }
}
</style>
