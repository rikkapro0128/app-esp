import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Connection from '../views/Connection.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/connection'
  },
  {
    path: '/connection',
    name: 'connection',
    component: Connection
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
