<template>
  <n-dialog-provider>
    <div class="p-5 h-screen relative">
      <!-- <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view> -->
      <router-view></router-view>
      <navigate-center />
      <validate-wifi />
      <validate-router />
    </div>
  </n-dialog-provider>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'

import { NDialogProvider } from 'naive-ui';
import { Emitter, EventType } from 'mitt';

const app = getCurrentInstance();
const emitter = app?.appContext.config.globalProperties.emitter as Emitter<Record<EventType, unknown>>;

import NavigateCenter from '@/components/NavigateCenter.vue';
import ValidateWifi from '@/components/ValidateWifi.vue'
import ValidateRouter from '@/components/ValidateRouter.vue'
</script>
