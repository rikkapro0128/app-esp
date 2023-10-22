<template>
  <n-modal :show="props.show" transform-origin="center" :on-mask-click="() => $emit('close')">
    <n-card style="margin: 0 1rem;" :bordered="false" size="medium" role="dialog" aria-modal="true">
      <template #header>
        <div class="flex items-center">
          <i style="line-height: 0;" class="fi fi-rr-calendar-plus mr-2"></i>
          <span>Tạo bộ hẹn giờ</span>
        </div>
      </template>
      <n-space vertical>
        <n-time-picker :default-value="new Date().getTime()" @update-value="handleConfirm" :actions="null" input-readonly
          :status="statePicker ? 'success' : 'error'" />
        <exec-picker :d-type="props.dType" @change="handleChangeExecControll" :defailt-value="payloadControll" />
      </n-space>
      <template #footer>
        <n-space justify="end">
          <n-button @click="() => $emit('close')">
            Huỷ
          </n-button>
          <n-button @click="handleCreateSchedule" :loading="creatingCountDown" type="success">Xác nhận
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import ExecPicker from '@/components/Widget/Dimmer/Schedule/ExecPicker.vue';
import { NModal, NCard, NButton, NSpace, NCheckbox, NTimePicker } from 'naive-ui';

import { storeToRefs } from 'pinia'
import { useCommonStore } from '@/store'
import { ref, onUnmounted } from 'vue';

import notyf from '@/notyf';

import { LoadType, WidgetType, PickerTouch, PacketProps, PacketControll, TouchProps, TypeSchedule } from '@/components/Widget';

const props = defineProps<{
  show: boolean,
  idDevice?: string,
  loadFrom: LoadType,
  dType?: WidgetType,
}>();

const emit = defineEmits<{
  (e: 'close'): void
}>();

const { ipMeshRoot, wsClient } = storeToRefs(useCommonStore());

const payloadControll = ref<PickerTouch>({
  mode: 1,
  state: true
});

const statePicker = ref<boolean>(false);
const secondPicker = ref<number>(0);
const creatingCountDown = ref<boolean>(false);

const handleCreateSchedule = () => {
  if (secondPicker == 0) { return }
  if (props.loadFrom === 'ws') {
    const packet: PacketProps<PacketControll<TouchProps>> = {
      target: props.idDevice as string,
      payload: {
        pType: 'countdown',
        dType: props.dType,
        pAction: 'CREATE',
        timestamp: secondPicker.value,
        ...payloadControll.value,
      }
    };
    // console.log(packet);
    if (wsClient.value) {
      wsClient.value.send(JSON.stringify(packet));
    }
    emit('close');
  }
}

const handleConfirm = (value: number | null) => {
  const timePresent = Math.round(new Date().getTime() / 1000);
  const timePicker = value / 1000;

  if (timePicker - timePresent <= 0) {
    notyf.error('Vui lòng chọn thời gian lớn hơn thời gian hiện tại!');
    statePicker.value = false;
  } else {
    statePicker.value = true;
    secondPicker.value = Math.round(timePicker - timePresent);
  }
}

const handleChangeExecControll = (payload: PickerTouch) => {
  payloadControll.value = payload.mode === 1 ? { mode: payload.mode, state: payload.state } : payload;
}

</script>

<style lang="scss" scoped></style>