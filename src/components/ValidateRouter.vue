<template></template>

<script setup lang="ts">
import { useDialog } from "naive-ui";

import { useRouter } from 'vue-router';

import { Network } from '@capacitor/network';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings';

const router = useRouter();
const dialog = useDialog();

router.beforeEach(async (to, from, next) => {
  if (to.meta?.requireInternet) {
    const statusNetwork = await Network.getStatus();
    if (!statusNetwork.connected) {
      const ctxD = dialog.warning({
        title: 'Yêu cầu kết nối internet',
        content: 'bạn vui lòng kết nối wifi có internet để truy cập các giao diện khác nhé!',
        positiveText: 'mở cài đặt wifi',
        negativeText: 'Thôi',
        maskClosable: false,
        transformOrigin: 'center',
        onPositiveClick: async () => {
          ctxD.loading = true;
          try {
            await OpenNativeSettings.open('wifi')
          } catch (error) {
            console.log(error);
          }
          ctxD.loading = false;
        }
      });
      return false;
    } else {
      next();
    }
  } else {
    next();
  }
})

</script>