import { createRouter, createWebHistory } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import SignInPage from './pages/SignInPage.vue'
import SignUpPage from './pages/SignUpPage.vue'
import { useAuthStore } from './stores/auth.js'

export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/connexion',
  SIGN_UP: '/inscription',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return ROUTES.SIGN_IN
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return ROUTES.HOME
  }

  return true
})

export default router
