<template>
  <NCard title="Jouer" class="lobby-card" data-component="GameLobby">
    <div class="lobby-flex">
      <!-- Create Room -->
      <section class="lobby-section">
        <NText strong>Créer une partie</NText>

        <NSelect
          v-model:value="selectedDeckId"
          :options="deckOptions"
          placeholder="Choisir un deck"
          :disabled="deckOptions.length === 0"
        />
        <div
          v-if="deckOptions.length === 0"
          style="color: #888; font-size: 13px; margin-top: 6px"
        >
          Aucun deck disponible. <RouterLink to="/">Créer un deck</RouterLink>
        </div>

        <NButton
          type="primary"
          class="mt-8"
          :disabled="!selectedDeckId || deckOptions.length === 0"
          @click="handleCreateRoom"
        >
          Créer
        </NButton>
      </section>

      <!-- Rooms List -->
      <section class="lobby-section">
        <NText strong>Parties disponibles</NText>

        <NList>
          <NListItem v-if="rooms.length === 0">
            <NText depth="3">Aucune room disponible.</NText>
          </NListItem>

          <NListItem v-for="room in rooms" :key="room.id">
            <NThing>
              <template #header>
                <div class="room-header">
                  <NText>{{ room.host }}</NText>
                  <NText depth="3">
                    {{ room.status === 'waiting' ? 'En attente' : 'En cours' }}
                  </NText>
                </div>
              </template>

              <template #footer>
                <div class="room-footer">
                  <NSelect
                    v-model:value="joinDeckId[room.id]"
                    :options="deckOptions"
                    placeholder="Deck pour rejoindre"
                    size="small"
                    style="width: 140px"
                  />

                  <NButton
                    size="small"
                    type="success"
                    class="ml-8"
                    :disabled="
                      !joinDeckId[room.id] || room.status !== 'waiting'
                    "
                    @click="handleJoinRoom(room.id)"
                  >
                    Rejoindre
                  </NButton>
                </div>
              </template>
            </NThing>
          </NListItem>
        </NList>
      </section>
    </div>

    <NAlert v-if="error" type="error" class="mt-12">
      {{ error }}
    </NAlert>
  </NCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'
import { useGameStore } from '@/stores/game'
import type { Deck } from '@/types'

const gameStore = useGameStore()
const authStore = useAuthStore()
const api = useApi()

const { rooms, error } = storeToRefs(gameStore)

const selectedDeckId = ref<string | null>(null)
const joinDeckId = ref<Record<string, string | null>>({})
const decks = ref<Deck[]>([])

const deckOptions = computed(() =>
  decks.value.map((deck) => ({
    label: deck.name,
    value: deck.id,
  })),
)

function handleCreateRoom() {
  if (!selectedDeckId.value) return
  gameStore.createRoom(selectedDeckId.value)
}

function handleJoinRoom(roomId: string) {
  const deckId = joinDeckId.value[roomId]
  if (!deckId) return
  gameStore.joinRoom(roomId, deckId)
}

onMounted(async () => {
  if (!authStore.token) return
  gameStore.connect(authStore.token)
  gameStore.fetchRooms()
  try {
    decks.value = await api.getMyDecks()
  } catch (_e) {
    decks.value = []
  }
})

onUnmounted(() => {
  gameStore.disconnect()
})
</script>

<style scoped>
.lobby-card {
  max-width: 900px;
  margin: 0 auto;
}
.lobby-flex {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}
.lobby-section {
  flex: 1 1 320px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.room-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.room-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}
.mt-8 {
  margin-top: 8px;
}
.mt-12 {
  margin-top: 12px;
}
.ml-8 {
  margin-left: 8px;
}
</style>
