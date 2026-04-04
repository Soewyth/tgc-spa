import { createRouter, createWebHistory } from 'vue-router'

import DeckCreatePage from './pages/DeckCreatePage.vue'
import DeckDetailPage from './pages/DeckDetailPage.vue'
import DeckEditPage from './pages/DeckEditPage.vue'
import GamePage from './pages/GamePage.vue'
import HomePage from './pages/HomePage.vue'
import SignInPage from './pages/SignInPage.vue'
import SignUpPage from './pages/SignUpPage.vue'
import { useAuthStore } from './stores/auth.js'

export const ROUTES = {
  HOME: '/',
  GAME: '/game',
  SIGN_IN: '/connexion',
  SIGN_UP: '/inscription',
  DECK_CREATE: '/decks/creation',
  DECK_DETAIL: '/decks/:id',
  DECK_EDIT: '/decks/:id/modifier',
  deckDetail: (id: string | number) => `/decks/${id}`,
  deckEdit: (id: string | number) => `/decks/${id}/modifier`,
} as const

const routes = [
  // Private routes
  {
    path: ROUTES.HOME,
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.GAME,
    component: GamePage,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.SIGN_IN,
    component: SignInPage,
    meta: { guestOnly: true },
  },
  {
    path: ROUTES.SIGN_UP,
    component: SignUpPage,
    meta: { guestOnly: true },
  },
  {
    path: ROUTES.DECK_CREATE,
    component: DeckCreatePage,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.DECK_DETAIL,
    component: DeckDetailPage,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.DECK_EDIT,
    component: DeckEditPage,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  // Redirect guests to sign-in when a route requires auth
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return ROUTES.SIGN_IN
  }

  // Redirect authenticated users away from auth pages
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return ROUTES.HOME
  }

  return true
})

export default router
