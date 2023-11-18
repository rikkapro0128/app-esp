import { createRouter, createWebHistory } from "vue-router";
import { RouteRecordRaw } from "vue-router";
import Connection from "@/views/Connection.vue";
import DeviceInfo from "@/views/DeviceInfo.vue";
import OTAUpgrade from "@/views/OTAUpgrade.vue";
import MeshOTAUpgrade from "@/views/MeshOTA.vue";
import ControllDevice from "@/views/Controll.vue";
import MeshControllTest from "@/views/MeshControllTest.vue";
import MeshSetting from "@/views/MeshSetting.vue";
import Something from "@/views/Something.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/mesh-controll",
  },
  {
    path: "/connection",
    name: "connection",
    component: Connection,
  },
  {
    path: "/demo",
    name: "demo",
    component: Something,
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
    path: "/mesh-ota-upgrade",
    name: "mesh-ota-upgrade",
    component: MeshOTAUpgrade,
  },
  {
    path: "/mesh-setting",
    name: "mesh-setting",
    component: MeshSetting,
  },
  {
    path: "/mesh-controll",
    name: "mesh-controll",
    meta: {
      requireInternet: true,
    },
    component: MeshControllTest,
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
