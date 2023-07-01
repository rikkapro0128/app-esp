<template>
  <!-- bg for view: #2B2D42 -->
  <div>
    <div class="relative h-12">
      <h1 class="text-2xl pb-4 fixed">Điều khiển thiết bị</h1>
    </div>
    <div>
      <dimmer-wrap type="dimmer" :colors="['white', 'yellow']">
        <template #header="{ type, status, id, colors }">
          <div class="flex justify-between items-center">
            <title-wrap :id="id" :type="type" title="phòng ngủ"></title-wrap>
            <n-space align="center" justify="end">
              <status-device :status="status"></status-device>
              <dimmer-options :id-device="id" :colors="colors"></dimmer-options>
            </n-space>
          </div>
        </template>
        <template #widget="{ color, id }">
          <dimmer-controll :color="color" :id="id" />
        </template>
        <template #footer="{ changeControll }">
          <n-space class="mt-8" justify="center">
            <n-button @click="changeControll" round type="primary">
              <i style="line-height: 0;" class="fi fi-rr-refresh"></i>
              <span class="ml-2">Đổi màu</span>
            </n-button>
          </n-space>
        </template>
      </dimmer-wrap>
    </div>
  </div>
</template>

<script setup lang="ts">
import DimmerWrap from '@/components/Widget/Dimmer/Wrap.vue';
import DimmerControll from '@/components/Widget/Dimmer/Controll.vue';
// import Switch from '@/components/Widget/Switch.vue';
import TitleWrap from '@/components/Widget/Title.vue'
import StatusDevice from '@/components/StatusConnection.vue';
import DimmerOptions from '@/components/Widget/Dimmer/Options.vue';

import { NButton, NSpace } from 'naive-ui';

</script>

<style scoped></style>