<template></template>

<script setup lang="ts">
import { useDialog } from "naive-ui";

import { WifiWizard2 } from "@awesome-cordova-plugins/wifi-wizard-2";

import { StatusInternet } from "@/type";


const dialog = useDialog();

// router.beforeEach(async (to, from) => {
//   if (to.meta.requireInternet) {
    // try {
    //   const status = await WifiWizard2.canConnectToInternet();
    //   if (status === StatusInternet.IS_CONNECTED_TO_INTERNET) {
    //     return to;
    //   }
    //   console.log(status);

    // } catch (error) {
    //   console.log(error);

    //   if (error === StatusInternet.NOT_CONNECTED_TO_INTERNET) {
    //     // const ctxD = dialog.warning({
    //     //   title: "Yêu cầu WiFi",
    //     //   content: "Vui lòng kết nối mạng có internet để tiếp tục!",
    //     //   positiveText: "Mở wifi setting",
    //     //   negativeText: "Thôi",
    //     //   maskClosable: false,
    //     //   onPositiveClick: async () => {
    //     //     ctxD.loading = true;
    //     //   },
    //     //   onAfterLeave: () => {
    //     //     ctxD.loading = false;
    //     //   },
    //     // });
    //     return from;
    //   }
    // }
//   }
// });
</script>