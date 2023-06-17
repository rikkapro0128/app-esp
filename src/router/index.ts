import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Connection from "@/views/Connection.vue";
import DeviceInfo from "@/views/DeviceInfo.vue";
import RequireAccessNetwork from "@/views/RequireAccessNetwork.vue";
import Controll from "@/views/Controll.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/device-info",
  },
  {
    path: "/connection",
    name: "connection",
    component: Connection,
  },
  {
    path: "/require-internet",
    name: "require-internet",
    component: RequireAccessNetwork,
  },
  {
    path: "/device-info",
    name: "device-info",
    meta: {
      requireInternet: true,
    },
    component: DeviceInfo,
  },
  {
    path: "/controll-device",
    name: "controll-device",
    meta: {
      // requireInternet: true,
    },
    component: Controll,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
