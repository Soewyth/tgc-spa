import { defineStore } from 'pinia'
import { io, type Socket } from 'socket.io-client'
import { computed, ref } from 'vue'

import router from '@/router'
import type { Card, Deck } from '@/types'

import { useAuthStore } from './auth'

export interface Room {
  id: string
  host: string
  guest?: string
  status: 'waiting' | 'playing'
}

export interface PlayerState {
  username: string
  deck: Deck
  ko: number
  activeCard?: Card | null
  hand: Card[]
  board: Card[]
  deckCount: number
}

export interface GameState {
  id: string
  host: PlayerState
  guest: PlayerState
  turn: 'host' | 'guest'
  status: 'playing' | 'ended'
  winner?: 'host' | 'guest' | null
  message?: string
}

export const useGameStore = defineStore('game', () => {
  const socket = ref<Socket | null>(null)
  const socketId = ref<string | null>(null)
  const error = ref<string | null>(null)

  const rooms = ref<Room[]>([])
  const currentRoomId = ref<string | null>(null)

  const game = ref<GameState | null>(null)

  const isInRoom = computed(() => !!currentRoomId.value)
  const isPlaying = computed(
    () => !!game.value && game.value.status === 'playing',
  )
  const isGameEnded = computed(
    () => !!game.value && game.value.status === 'ended',
  )

  function getPlayerRole(): 'host' | 'guest' | null {
    const auth = useAuthStore()

    if (!game.value || !auth.username) return null
    if (game.value.host.username === auth.username) return 'host'
    if (game.value.guest.username === auth.username) return 'guest'

    return null
  }

  const myRole = computed(() => getPlayerRole())

  const isMyTurn = computed(() => {
    if (!game.value || !myRole.value) return false
    return game.value.turn === myRole.value
  })

  const me = computed<PlayerState | null>(() => {
    if (!game.value || !myRole.value) return null
    return myRole.value === 'host' ? game.value.host : game.value.guest
  })

  const opponent = computed<PlayerState | null>(() => {
    if (!game.value || !myRole.value) return null
    return myRole.value === 'host' ? game.value.guest : game.value.host
  })

  // Lobby actions
  function fetchRooms() {
    socket.value?.emit('getRooms')
  }

  function createRoom(deckId: string) {
    socket.value?.emit('createRoom', { deckId })
  }

  function joinRoom(roomId: string, deckId: string) {
    socket.value?.emit('joinRoom', { roomId, deckId })
  }

  // Game actions
  function drawCards() {
    socket.value?.emit('drawCards')
  }

  function playCard(cardId: string) {
    socket.value?.emit('playCard', { cardId })
  }

  function attack() {
    socket.value?.emit('attack')
  }

  function endTurn() {
    socket.value?.emit('endTurn')
  }

  function resetGame() {
    game.value = null
    currentRoomId.value = null
    error.value = null
    router.push('/')
  }

  // Socket connection
  function connect(token: string) {
    if (socket.value?.connected) return

    const s = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
    })

    socket.value = s

    s.on('connect', () => {
      socketId.value = s.id ?? null
      error.value = null
    })

    s.on('disconnect', () => {
      socketId.value = null
    })

    s.on('connect_error', (err: Error) => {
      error.value = err.message
    })

    // Lobby events
    s.on('roomsList', (data: Room[]) => {
      rooms.value = data
    })

    s.on('roomsListUpdated', () => {
      fetchRooms()
    })

    s.on('roomCreated', (roomId: string) => {
      currentRoomId.value = roomId
      error.value = null
    })

    s.on('gameStarted', (gameState: GameState) => {
      game.value = gameState
      currentRoomId.value = gameState.id
      error.value = null
      router.push('/game')
    })

    s.on('error', (data: { message: string }) => {
      error.value = data.message
    })

    // Game events
    s.on('gameStateUpdated', (gameState: GameState) => {
      game.value = gameState
    })

    s.on('gameEnded', (gameState: GameState) => {
      game.value = gameState
    })

    s.on('opponentDisconnected', () => {
      error.value = 'Adversaire déconnecté.'
    })
  }

  function disconnect() {
    socket.value?.disconnect()
    socket.value = null
    socketId.value = null
    error.value = null
    rooms.value = []
    currentRoomId.value = null
    game.value = null
  }

  return {
    socketId,
    error,
    rooms,
    currentRoomId,
    game,
    isInRoom,
    isPlaying,
    isGameEnded,
    myRole,
    isMyTurn,
    me,
    opponent,
    connect,
    disconnect,
    fetchRooms,
    createRoom,
    joinRoom,
    drawCards,
    playCard,
    attack,
    endTurn,
    resetGame,
  }
})
