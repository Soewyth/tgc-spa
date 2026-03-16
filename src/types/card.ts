export type PokemonType =
  | 'Normal'
  | 'Fire'
  | 'Water'
  | 'Electric'
  | 'Grass'
  | 'Ice'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Dragon'
  | 'Dark'
  | 'Steel'
  | 'Fairy'

export interface Card {
  id: string
  name: string
  hp: number
  attack: number
  type: PokemonType
  pokedexNumber: number
  imageUrl: string
  imgUrl?: string
}

export interface DeckCard {
  id: string
  deckId: string
  cardId: string
  card?: Card
}
