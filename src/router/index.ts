import { createRouter, createWebHistory } from "vue-router";
import { RouteRecordRaw } from "vue-router";
import Connection from "@/views/Connection.vue";
import DeviceInfo from "@/views/DeviceInfo.vue";
import OTAUpgrade from "@/views/OTAUpgrade.vue";
import ControllDevice from "@/views/Controll.vue";

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
    path: "/ota-upgrade",
    name: "ota-upgrade",
    component: OTAUpgrade,
    meta: {
      requireInternet: true,
    },
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
      requireInternet: true,
    },
    component: ControllDevice,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
