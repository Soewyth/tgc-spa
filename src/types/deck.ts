import type { DeckCard } from './card.js'

export interface Deck {
  id: string
  name: string
  userId: string
  createdAt?: string
  updatedAt?: string
  cards: DeckCard[]
}

export interface DeckPayload {
  name: string
  cards: (string | number)[]
}
