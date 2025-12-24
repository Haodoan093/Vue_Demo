import { createRouter, createWebHistory } from 'vue-router'
import Candidates from '../views/candidates/CandidatePage.vue'
import NotFound from '../views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Candidates,
    },
    {
      path: '/:pathMath(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
})

export default router
