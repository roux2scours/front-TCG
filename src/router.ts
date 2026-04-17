// src/router.ts
import { createRouter, createWebHistory } from 'vue-router'

import DeckCreatePage from './pages/DeckCreatePage.vue'
import DeckDetailPage from './pages/DeckDetailPage.vue'
import DeckEditPage from './pages/DeckEditPage.vue'
import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import SignupPage from './pages/SignupPage.vue'

export const ROUTES = {
  HOME: '/',
  DECK_CREATE: '/decks/create',
  DECK_DETAIL: '/decks',
  DECK_EDIT: '/decks/edit',
  GAME: '/game',
  LOGIN: '/login',
  SIGNUP: '/signup',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  {
    path: ROUTES.DECK_CREATE,
    component: DeckCreatePage,
    meta: { requiresAuth: true },
  },
  {
    path: `${ROUTES.DECK_DETAIL}/:id`,
    component: DeckDetailPage,
    meta: { requiresAuth: true },
  },
  {
    path: `${ROUTES.DECK_EDIT}/:id`,
    component: DeckEditPage,
    meta: { requiresAuth: true },
  },
  { path: ROUTES.LOGIN, component: LoginPage, meta: { requiresAuth: false } },
  { path: ROUTES.SIGNUP, component: SignupPage, meta: { requiresAuth: false } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    return ROUTES.LOGIN
  }
  return true
})

export default router
