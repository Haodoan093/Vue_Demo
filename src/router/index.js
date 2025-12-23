import { createRouter, createWebHistory } from 'vue-router'
import Candidates from '../views/candidates/CandidatePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Candidates,
    },
  ],
})

export default router
