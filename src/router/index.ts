import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/SelectUnitView.vue'),
    },
    {
      path: '/:unit',
      name: 'unit',
      component: () => import('../views/SelectLocationView.vue'),
    },
    {
      path: '/:unit/:location',
      name: 'location',
      component: () => import('../views/ReportView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
})

export default router
