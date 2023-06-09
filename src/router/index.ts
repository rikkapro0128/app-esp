import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Connection from '@/views/Connection.vue';
import SystemInfo from '@/views/SystemInfo.vue';
import RequireAccessNetwork from '@/views/RequireAccessNetwork.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/connection'
  },
  {
    path: '/connection',
    name: 'connection',
    component: Connection
  },
  {
    path: '/require-network',
    name: 'require-access-network',
    component: RequireAccessNetwork
  },
  {
    path: '/system-info',
    name: 'system-info',
    component: SystemInfo
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
