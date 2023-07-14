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
        <cron-picker @change="handleChangeCronJob" />
        <n-checkbox v-model:checked="activeRepeat">
          cho phép lặp lại
        </n-checkbox>
        <exec-picker :colors="props.colors" @change-brightness="handleChangeBrightness" />
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

import { colorChannel, BrightnessColor } from '@/components/Widget/Dimmer';
import notyf from '@/notyf';

import { ref, getCurrentInstance } from 'vue';

import { NModal, NCard, NButton, NSpace, NCheckbox } from 'naive-ui';

import * as mqtt from "mqtt/dist/mqtt.min"

const app = getCurrentInstance();
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

const pathPublishSchedule = props.idDevice ? `/${props.idDevice}/dimmer/write/schedule` : undefined;

const clientMQTT = app?.appContext.config.globalProperties.$clientMQTT as mqtt.MqttClient;

const activeRepeat = ref<boolean>(true);
const cronjob = ref<string>('* * * * * *');
const dimmerBrightness = ref<BrightnessColor>({ ...props.colors.reduce((ctx, color) => ({ ...ctx, [color]: 50 }), {}) })

const emit = defineEmits<{
  (e: 'close'): void
}>()

const creatingSchedule = ref<boolean>(false);

const handleChangeCronJob = (job: string) => {
  cronjob.value = job;
}

const handleChangeBrightness = (brightness: BrightnessColor) => {
  dimmerBrightness.value = brightness;
}

const resetSchedule = () => {
  cronjob.value = '* * * * * *';
  dimmerBrightness.value = { ...props.colors.reduce((ctx, color) => ({ ...ctx, [color]: 50 }), {}) };
}

const handleCreateSchedule = () => {
  console.log('create schedule!');
  const schedule = { cronjob: cronjob.value, brightness: dimmerBrightness.value, repeat: activeRepeat.value }
  console.log(schedule);
  if (clientMQTT.connected && pathPublishSchedule) {
    clientMQTT.publish(pathPublishSchedule, JSON.stringify(schedule), (err) => {
      if (!err) {
        notyf.success('Tạo lập lịch thành công!');
      }
      resetSchedule();
    });
  }
  emit('close');
}

</script>

<style scoped></style>