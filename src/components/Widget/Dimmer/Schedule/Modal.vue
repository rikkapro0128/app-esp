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
        <exec-picker :d-type="props.dType" @change="handleChangeExecControll" :defailt-value="payloadControll" />
        <n-checkbox v-model:checked="activeRepeat">
          cho phép lặp lại
        </n-checkbox>
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

// import { colorChannel, BrightnessColor } from '@/components/Widget/Dimmer';
import { LoadType, WidgetType, PickerTouch, PacketProps, PacketControll, TouchProps, TypeSchedule } from '@/components/Widget';
import { storeToRefs } from 'pinia'

import notyf from '@/notyf';

import { ref, onUnmounted } from 'vue';
import { useCommonStore } from '@/store'

import { NModal, NCard, NButton, NSpace, NCheckbox } from 'naive-ui';

const { ipMeshRoot, wsClient } = storeToRefs(useCommonStore());

const props = defineProps<{
  show: boolean,
  idDevice?: string,
  loadFrom: LoadType,
  dType?: WidgetType,
}>();

const pathPublishSchedule = props.idDevice ? `/${props.idDevice}/dimmer/write/schedule` : undefined;

const activeRepeat = ref<boolean>(true);
const cronjob = ref<string>('* * * * * *');

const emit = defineEmits<{
  (e: 'close'): void
}>()

const creatingSchedule = ref<boolean>(false);
const payloadControll = ref<PickerTouch>({
  mode: 1,
  state: true
});

const handleChangeCronJob = (job: string) => {
  cronjob.value = job;
}

const resetSchedule = () => {
  cronjob.value = '* * * * * *';
}

const handleCreateSchedule = () => {
  if (props.loadFrom === 'ws') {
    const packet: PacketProps<PacketControll<TouchProps>> = {
      target: props.idDevice as string,
      payload: {
        pType: 'schedule',
        dType: props.dType,
        pAction: 'CREATE',
        expression: cronjob.value,
        loop: activeRepeat.value,
        ...payloadControll.value,
      }
    };
    // console.log(packet);
    if (wsClient.value) {
      wsClient.value.send(JSON.stringify(packet));
    }
    // console.log('create schedule!');
    resetSchedule();
    emit('close');
  }
}

const handleChangeExecControll = (payload: PickerTouch) => {
  payloadControll.value = payload.mode === 1 ? { mode: payload.mode, state: payload.state } : payload;
}

</script>

<style scoped></style>