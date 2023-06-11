<template></template>

<script setup lang="ts">
import { useDialog } from 'naive-ui';

import { Network } from '@capacitor/network';
import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2';

import { onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const dialog = useDialog();
let intervalId: NodeJS.Timeout;

Network.addListener('networkStatusChange', async (value) => {
  const { connected, connectionType } = value;
  console.log(value);
  if (connectionType !== 'wifi') {
    const ctxD = dialog.warning({
      title: 'Yêu cầu WiFi',
      content: 'bạn đã tắt WiFi vui lòng bật lại nhé!',
      positiveText: 'Bật mạng',
      negativeText: 'Thôi',
      maskClosable: false,
      onPositiveClick: async () => {
        ctxD.loading = true;
        const statusNetwork = await WifiWizard2.isWifiEnabled() as boolean;
        console.log(statusNetwork);
        if (!statusNetwork) {
          const statusEnable = await WifiWizard2.enableWifi();
          console.log(statusEnable);
          if (statusEnable === 'OK') {
            ctxD.loading = false;
            return true;
          }
        }
        return false;
      },
      onAfterLeave: () => {
        ctxD.loading = false;
      }
    });
  }
})

onBeforeUnmount(() => {
  Network.removeAllListeners();
  clearInterval(intervalId);
})

</script>

<style scoped></style>