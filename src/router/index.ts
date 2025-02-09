import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LLMView from '../views/LLMView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: LoginView,
    },
    {
      path: '/chat',
      name: 'chat',
      component: LLMView,
    },
  ],
})

import { useUserStore } from '@/stores/store'

router.beforeEach((to) => {
  if (to.path != '/') {
    const userStore = useUserStore()

    console.log('User is', JSON.stringify(userStore.user))
    if (JSON.stringify(userStore.user) != '{}') {
      window.location.href = '/chat'
    }
  }
})

export default router
