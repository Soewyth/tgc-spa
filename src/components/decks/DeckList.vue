<template>
  <NCard title="Mes decks" class="deck-list">
    <template #header-extra>
      <NButton size="small" type="primary" @click="handleCreate"
        >Creer un deck</NButton
      >
    </template>

    <NSpin :show="isLoading">
      <NEmpty
        v-if="!isLoading && decks.length === 0"
        description="Aucun deck pour le moment"
      />

      <NList v-else hoverable bordered>
        <NListItem v-for="deck in decks" :key="deck.id">
          <NThing>
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

            <template #footer>
              <NSpace :size="8" justify="end">
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
                >
                  Supprimer
                </NButton>
              </NSpace>
            </template>
          </NThing>
        </NListItem>
      </NList>
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
import type { Deck } from '../../types/index.js'

const api = useApi()
const router = useRouter()
const message = useMessage()

const decks = ref<Deck[]>([])
const isLoading = ref(false)
const deletingDeckId = ref<Deck['id'] | null>(null)
const pendingDeleteDeckId = ref<Deck['id'] | null>(null)
const isDeleteModalOpen = ref(false)

const pendingDeleteDeckName = computed(() => {
  const deck = decks.value.find((item) => item.id === pendingDeleteDeckId.value)
  return deck?.name ?? 'ce deck'
})

const fetchDecks = async () => {
  try {
    isLoading.value = true
    decks.value = await api.getMyDecks()
  } catch (error) {
    const nextMessage =
      error instanceof Error ? error.message : 'Impossible de charger les decks'
    message.error(nextMessage)
  } finally {
    isLoading.value = false
  }
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
    deletingDeckId.value = pendingDeleteDeckId.value
    await api.deleteDeck(pendingDeleteDeckId.value)
    message.success('Deck supprime')
    await fetchDecks()
    closeDeleteModal()
  } catch (error) {
    const nextMessage =
      error instanceof Error ? error.message : 'Impossible de supprimer ce deck'
    message.error(nextMessage)
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
</style>
