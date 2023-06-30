<template>
  <!-- bg for view: #2B2D42 -->
  <div>
    <div class="relative h-12">
      <h1 class="text-2xl pb-4 fixed">Điều khiển thiết bị</h1>
    </div>
    <div>
      <widget-wrap type="dimmer" :colors="['white', 'yellow']">
        <template #header="{ type }">
          <div class="flex justify-between">
            <title-wrap :type="type" title="phòng ngủ"></title-wrap>
            <n-popover style="padding: 0;" trigger="click" placement="bottom-end">
              <template #trigger>
                <n-button circle size="small">
                  <template #icon>
                    <i style="line-height: 0;" class="fi fi-rr-menu-dots-vertical font-bold"></i>
                  </template>
                </n-button>
              </template>
              <n-button-group size="large" vertical>
                <n-button>
                  <i style="line-height: 0;" class="fi fi-rr-calendar-clock mr-2"></i>
                  <span>tạo schedule</span>
                </n-button>
                <n-button>
                  <i style="line-height: 0;" class="fi fi-rr-share mr-2"></i>
                  <span>chia sẻ điều khiển</span>
                </n-button>
              </n-button-group>
            </n-popover>
          </div>
        </template>
        <template #widget="{ color }">
          <dimmer :color="color" />
        </template>
        <template #footer="{ changeControll }">
          <n-space class="mt-8" justify="center">
            <n-button @click="changeControll" round type="primary">
              <i style="line-height: 0;" class="fi fi-rr-refresh"></i>
              <span class="ml-2">Đổi màu</span>
            </n-button>
          </n-space>
        </template>
      </widget-wrap>
    </div>
  </div>
</template>

<script setup lang="ts">
import WidgetWrap from '@/components/Widget/InfoWrap.vue';
import Dimmer from '@/components/Widget/Dimmer.vue';
import Switch from '@/components/Widget/Switch.vue';
import TitleWrap from '@/components/Widget/Title.vue'

import { NButton, NSpace, NPopover, NList, NListItem, NButtonGroup } from 'naive-ui';

</script>

<style scoped></style>