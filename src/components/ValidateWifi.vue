<template></template>

<script setup lang="ts">
import { useDialog } from 'naive-ui';
import { Network } from '@capacitor/network';
import { onBeforeUnmount } from 'vue';

const dialog = useDialog();

Network.addListener('networkStatusChange', async (value) => {
  const { connected, connectionType } = value;
  if (connectionType !== 'wifi') {
    dialog.warning({
      title: 'Yêu cầu WiFi',
      content: 'bạn đã tắt WiFi vui lòng bật lại nhé!',
      positiveText: 'Đã hiểu',
      negativeText: 'Thôi',
      onPositiveClick: () => {

      },
      onNegativeClick: () => {

      }
    });
  }
})

onBeforeUnmount(() => {
  Network.removeAllListeners();
})

</script>

<style scoped></style>