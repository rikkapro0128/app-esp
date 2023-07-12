<template>
  <div>
    <n-popover :show="optionsState" :on-update:show="handlePopoverSetting" style="padding: 0;" trigger="click"
      placement="bottom-end">
      <template #trigger>
        <n-button circle size="small">
          <template #icon>
            <i style="line-height: 0;" class="fi fi-rr-settings font-bold transition-transform"
              :class="settingActive ? 'rotate-90' : ''"></i>
          </template>
        </n-button>
      </template>
      <n-button-group size="large" vertical>
        <n-button @click="handleActiveSchedule">
          <i style="line-height: 0;" class="fi fi-rr-calendar-clock mr-2"></i>
          <span>lập lịch</span>
        </n-button>
        <n-button disabled>
          <i style="line-height: 0;" class="fi fi-rr-share mr-2"></i>
          <span>chia sẻ điều khiển</span>
        </n-button>
      </n-button-group>
    </n-popover>
    <!-- define drawer for schedule -->
    <n-drawer v-model:show="drawerSchedule" default-height="70%" placement="bottom">
      <n-drawer-content>
        <template #header>
          <div class="flex items-center">
            <i style="line-height: 0;" class="fi fi-rr-calendar-clock mr-2"></i>
            <span>Lập lịch</span>
          </div>
        </template>
        <div class="flex flex-col h-full">
          <n-space justify="end">
            <n-button @click="handleActiveModalSchedule" round type="tertiary">
              <template #icon>
                <i style="line-height: 0;" class="fi fi-rr-calendar-plus"></i>
              </template>
              <span>tạo mới</span>
            </n-button>
          </n-space>
          <load-schedule :id-device="props.idDevice" />
        </div>
      </n-drawer-content>
    </n-drawer>
    <!-- define modal for create schedule -->
    <!-- v-bind:show="modalSchedule" -->
    <modal-schedule :id-device="props.idDevice" :show="modalSchedule" :colors="props.colors"
      v-on:close="handleCloseModalSchedule" />
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';

import { NButton, NPopover, NButtonGroup, NDrawer, NDrawerContent, NSpace } from 'naive-ui';

import LoadSchedule from '@/components/Widget/Dimmer/Schedule/LoadItem.vue';
import ModalSchedule from '@/components/Widget/Dimmer/Schedule/Modal.vue';

import { colorChannel } from '@/components/Widget/Dimmer';

const props = defineProps({
  idDevice: {
    type: String,
  },
  colors: {
    type: Array<colorChannel>,
    default: ['white']
  }
})

const optionsState = ref<boolean>(false);
const drawerSchedule = ref<boolean>(false);
const modalSchedule = ref<boolean>(false);

const settingActive = ref<boolean>(false);

const handleCloseModalSchedule = () => {
  modalSchedule.value = false;
  drawerSchedule.value = false;
}

const handleActiveModalSchedule = () => {
  modalSchedule.value = true;
}

const handleActiveSchedule = () => {
  optionsState.value = false;
  drawerSchedule.value = true;
}

const handlePopoverSetting = (value: boolean) => {
  settingActive.value = value;
  optionsState.value = value;
}

</script>

<style scoped></style>