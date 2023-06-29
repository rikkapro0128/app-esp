<template>
  <div>
    <div class="relative h-12">
      <h1 class="text-2xl pb-4 fixed">Điều khiển thiết bị</h1>
    </div>
    <div class="">
      <widget-wrap>
        <template #header>
          <title-wrap type="dimmer" title="phòng ngủ"></title-wrap>
        </template>
        <template #widget>
          <dimmer :colors="['white']" />
        </template>
        <template #footer>
          <n-space class="mt-8" justify="center">
            <n-button round type="primary">
              <i style="line-height: 0;" class="fi fi-rr-refresh"></i>
              <span class="ml-2">Đổi màu</span>
            </n-button>
          </n-space>
        </template>
      </widget-wrap>
      <!-- <widget-wrap class="mt-4">
        <template #header>
          <title-wrap type="switch" title="phòng khách"></title-wrap>
        </template>
        <template #widget>
          <div class="grid grid-cols-12 gap-y-2">
            <div v-for="n in 4" class="col-span-4">
              <Switch :name="`công tắc ${n}`" />
            </div>
          </div>
        </template>
      </widget-wrap> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import WidgetWrap from '@/components/Widget/InfoWrap.vue';
import Dimmer from '@/components/Widget/Dimmer.vue';
import Switch from '@/components/Widget/Switch.vue';
import TitleWrap from '@/components/Widget/Title.vue'

import { NButton, NSpace } from 'naive-ui';

</script>

<style scoped></style>