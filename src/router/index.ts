import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Connection from "@/views/Connection.vue";
import SystemInfo from "@/views/SystemInfo.vue";

import { WifiWizard2 } from "@awesome-cordova-plugins/wifi-wizard-2";

import { StatusInternet } from "@/type";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/connection",
  },
  {
    path: "/connection",
    name: "connection",
    component: Connection,
  },
  {
    path: "/system-info",
    name: "system-info",
    meta: {
      requireInternet: true,
    },
    component: SystemInfo,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeResolve(async (to, from) => {
  if (to.meta.requireInternet) {
    try {
      const status = await WifiWizard2.canConnectToInternet();
      if (status === StatusInternet.IS_CONNECTED_TO_INTERNET) {
        return to;
      } 
      console.log(status);
      
    } catch (error) {
      console.log(error);
      
      if (error === StatusInternet.NOT_CONNECTED_TO_INTERNET) {
        // const ctxD = dialog.warning({
        //   title: "Yêu cầu WiFi",
        //   content: "Vui lòng kết nối mạng có internet để tiếp tục!",
        //   positiveText: "Mở wifi setting",
        //   negativeText: "Thôi",
        //   maskClosable: false,
        //   onPositiveClick: async () => {
        //     ctxD.loading = true;
        //   },
        //   onAfterLeave: () => {
        //     ctxD.loading = false;
        //   },
        // });
        return from;
      }
    }
  }
});

export default router;
