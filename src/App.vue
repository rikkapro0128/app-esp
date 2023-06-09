<template>
  <n-dialog-provider>
    <div class="p-5 h-screen relative">
      <router-view></router-view>
      <navigate-center />
      <validate-wifi />
    </div>
  </n-dialog-provider>
</template>

<script setup lang="ts">
import { NDialogProvider } from 'naive-ui';

import NavigateCenter from '@/components/NavigateCenter.vue';
import ValidateWifi from '@/components/ValidateWifi.vue'
</script>
