<template>
  <!-- Deck list with responsive grid -->
  <NCard title="Mes decks" class="deck-list">
    <template #header-extra>
      <!-- Button to create a new deck -->
      <NButton size="small" type="primary" @click="handleCreate"
        >Creer un deck</NButton
      >
    </template>

    <!-- Search input for decks -->
    <NInput
      v-model:value="searchTerm"
      size="large"
      placeholder="Rechercher un deck"
      clearable
      class="mb-12"
    />

    <!-- Error alert if needed -->
    <NAlert v-if="errorMessage" type="error" :show-icon="true" class="mb-12">
      {{ errorMessage }}
    </NAlert>

    <NSpin :show="isLoading">
      <NEmpty
        v-if="!isLoading && filteredDecks.length === 0"
        description="Aucun deck pour le moment"
      />

      <!-- Responsive grid for deck cards -->
      <NGrid v-else responsive="screen" cols="1 m:2" :x-gap="16" :y-gap="16">
        <NGridItem v-for="deck in filteredDecks" :key="deck.id">
          <!-- Deck card with preview and actions -->
          <NCard size="small" hoverable class="deck-card">
            <template #header>
              <NSpace
                align="center"
                justify="space-between"
                style="width: 100%"
              >
                <NText strong>{{ deck.name }}</NText>
                <NText depth="3">{{ deck.cards.length }} cartes</NText>
              </NSpace>
            </template>

            <!-- Preview of cards in the deck -->
            <div class="deck-preview" aria-label="Apercu des cartes du deck">
              <img
                v-for="card in getDeckPreviewCards(deck)"
                :key="`${deck.id}-${card.id}`"
                :src="card.imageUrl || card.imgUrl || ''"
                :alt="card.name"
                class="deck-preview__img"
                loading="lazy"
              />
            </div>

            <template #footer>
              <NSpace :size="8" justify="end">
                <!-- Deck actions: view, edit, delete -->
                <NButton size="small" tertiary @click="handleView(deck.id)"
                  >Voir</NButton
                >
                <NButton size="small" tertiary @click="handleEdit(deck.id)"
                  >Modifier</NButton
                >
                <NButton
                  size="small"
                  tertiary
                  type="error"
                  :loading="deletingDeckId === deck.id"
                  @click="handleDelete(deck.id)"
                  >Supprimer</NButton
                >
              </NSpace>
            </template>
          </NCard>
        </NGridItem>
      </NGrid>
    </NSpin>
  </NCard>

  <NModal
    v-model:show="isDeleteModalOpen"
    preset="card"
    title="Supprimer le deck"
    :mask-closable="false"
    style="width: min(92vw, 420px)"
  >
    <NText>
      Confirmer la suppression de
      <NText strong>{{ pendingDeleteDeckName }}</NText>
      ?
    </NText>

    <template #footer>
      <NSpace justify="end" :size="8">
        <NButton @click="closeDeleteModal">Annuler</NButton>
        <NButton
          type="error"
          :loading="Boolean(deletingDeckId)"
          @click="confirmDelete"
        >
          Supprimer
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '../../composables/useApi.js'
import { ROUTES } from '../../router.js'
import type { Card, Deck } from '../../types/index.js'

const api = useApi()
const router = useRouter()
const message = useMessage()

const decks = ref<Deck[]>([])
const searchTerm = ref('')
const filteredDecks = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return decks.value
  return decks.value.filter((deck) => deck.name.toLowerCase().includes(term))
})

const cardCatalog = ref<Card[]>([])
const isLoading = ref(false)
const deletingDeckId = ref<Deck['id'] | null>(null)
const pendingDeleteDeckId = ref<Deck['id'] | null>(null)
const isDeleteModalOpen = ref(false)
const errorMessage = ref('')

const cardCatalogById = computed(() => {
  const byId = new Map<string, Card>()
  for (const card of cardCatalog.value) {
    byId.set(String(card.id), card)
  }
  return byId
})

const pendingDeleteDeckName = computed(() => {
  const deck = decks.value.find((item) => item.id === pendingDeleteDeckId.value)
  return deck?.name ?? 'ce deck'
})

const fetchDecks = async () => {
  try {
    errorMessage.value = ''
    isLoading.value = true
    decks.value = await api.getMyDecks()
    try {
      cardCatalog.value = await api.getCards()
    } catch {
      cardCatalog.value = []
    }
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Impossible de charger les decks'
  } finally {
    isLoading.value = false
  }
}

const getDeckPreviewCards = (deck: Deck): Card[] => {
  return deck.cards
    .map(
      (entry) => entry.card || cardCatalogById.value.get(String(entry.cardId)),
    )
    .filter((card): card is Card => Boolean(card))
}

const handleView = async (deckId: Deck['id']) => {
  await router.push(ROUTES.deckDetail(deckId))
}

const handleEdit = async (deckId: Deck['id']) => {
  await router.push(ROUTES.deckEdit(deckId))
}

const handleCreate = async () => {
  await router.push(ROUTES.DECK_CREATE)
}

const closeDeleteModal = () => {
  if (deletingDeckId.value) return
  isDeleteModalOpen.value = false
  pendingDeleteDeckId.value = null
}

const handleDelete = (deckId: Deck['id']) => {
  pendingDeleteDeckId.value = deckId
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!pendingDeleteDeckId.value) return

  try {
    errorMessage.value = ''
    deletingDeckId.value = pendingDeleteDeckId.value
    await api.deleteDeck(pendingDeleteDeckId.value)
    isDeleteModalOpen.value = false
    pendingDeleteDeckId.value = null
    message.success('Deck supprime')
    await fetchDecks()
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Impossible de supprimer ce deck'
  } finally {
    deletingDeckId.value = null
  }
}

onMounted(() => {
  void fetchDecks()
})
</script>

<style scoped>
.deck-list {
  width: min(100%, 860px);
}

.mb-12 {
  margin-bottom: 12px;
}

.deck-card {
  height: 100%;
}

.deck-preview {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  margin-top: 10px;
}

.deck-preview__img {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
  background: #f3f4f6;
  flex: 0 0 auto;
}
</style>
