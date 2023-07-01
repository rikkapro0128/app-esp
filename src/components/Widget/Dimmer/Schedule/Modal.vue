<template>
  <n-modal :show="props.show" transform-origin="center" :on-mask-click="() => $emit('close')">
    <n-card style="margin: 0 1rem;" :bordered="false" size="medium" role="dialog" aria-modal="true">
      <template #header>
        <div class="flex items-center">
          <i style="line-height: 0;" class="fi fi-rr-calendar-plus mr-2"></i>
          <span>Tạo lập lịch</span>
        </div>
      </template>
      <n-space vertical>
        <cron-picker />
        <exec-picker :colors="props.colors" v-on:change-brightness="" />
      </n-space>
      <template #footer>
        <n-space justify="end">
          <n-button @click="() => $emit('close')">
            Huỷ
          </n-button>
          <n-button @click="handleCreateSchedule" :loading="creatingSchedule" type="success">Xác nhận
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import CronPicker from '@/components/Widget/Dimmer/Schedule/CronPicker.vue';
import ExecPicker from '@/components/Widget/Dimmer/Schedule/ExecPicker.vue';

import { colorChannel } from '@/components/Widget/Dimmer';

import { ref } from 'vue';

import { NModal, NCard, NButton, NSpace } from 'naive-ui';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  idDevice: {
    type: String,
  },
  colors: {
    type: Array<colorChannel>,
    default: ['white']
  }
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const creatingSchedule = ref<boolean>(false);

const handleCreateSchedule = () => {
  console.log('create schedule!');
  emit('close');
}

</script>

<style scoped></style>