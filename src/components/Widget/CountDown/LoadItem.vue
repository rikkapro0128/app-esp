<template>
  <div class="flex-1 -mx-[1.55rem] py-4 overflow-hidden">
    <transition name="fade" mode="out-in" :duration="200">
      <n-empty v-if="stateCountDown === StateCountDown.NO_COUNTDOWN" class="h-full flex flex-col justify-center"
        description="chưa có bộ hẹn giờ nào được tạo.">
        <template #icon>
          <i style="line-height: 0;" class="fi fi-rr-calendar-xmark"></i>
        </template>
      </n-empty>
      <div class="h-full flex justify-center items-center" v-else-if="stateCountDown === StateCountDown.START_LOAD">
        <n-space vertical align="center">
          <n-spin size="medium" />
          <p class="animate-pulse">đang tải</p>
        </n-space>
      </div>
      <div class="h-full overflow-y-scroll" v-else-if="stateCountDown === StateCountDown.END_LOAD">
        <div
          class="bg-white flex justify-between flex-nowrap relative z-10 miru__shadow--soft px-4 py-2 rounded-md mx-5 mb-2"
          :class="index != 0 ? '' : ''" :key="countdown.id" v-for="(countdown, index) in countdowns">
          <div>
            <span class="text-xs opacity-50">#id: {{ countdown.id }}</span>
            <p class="flex">
            <p class="font-bold flex items-center h-fit">
              <i style="line-height: 0;" class="fi fi-rr-clock-five mr-2"></i>
              <span class="font-bold">Thời gian:</span>
            </p>
            <n-ellipsis style="max-width: 120px" line-clamp="1" expand-trigger="click" class="ml-1">{{
              countdown.timestamp
            }} giây</n-ellipsis>
            </p>
            <p class="flex">
            <p class="font-bold flex items-center h-fit">
              <i style="line-height: 0;" class="fi fi-rr-clock-five mr-2"></i>
              <span class="font-bold">Xử lí sau:</span>
            </p>
            <n-ellipsis style="max-width: 120px" line-clamp="1" expand-trigger="click" class="ml-1">{{
              (countdown.createAt + countdown.timestamp) - timePresentOnRootDevice
            }} giây</n-ellipsis>
            </p>
            <div v-if="props.dType === 'light_dimmer'" class="flex items-center">
              <i style="line-height: 0;" class="fi fi-rr-brightness mr-2"></i>
              <p><span class="font-bold">Trắng</span>: {{ countdown.percent_white }}%</p>
              <span class="mx-2">-</span>
              <p><span class="font-bold">Vàng</span>: {{ countdown.percent_yellow }}%</p>
            </div>
            <div v-else-if="props.dType?.includes('touch')" class="flex items-center">
              <div v-if="countdown.mode === 1">
                <p><span class="font-bold">trạng thái</span>: {{ countdown.state ? 'bật' : 'tắt' }} hết</p>
              </div>
              <div class="flex" v-else>
                <i style="line-height: 0;" class="fi fi-rr-brightness mr-2"></i>
                <p><span class="font-bold">vị trí</span>: chạm {{ countdown.position }}</p>
                <span class="mx-2">-</span>
                <p><span class="font-bold">trạng thái</span>: {{ countdown.state ? 'bật' : 'tắt' }}</p>
              </div>
            </div>
          </div>
          <div class="flex items-center">
            <n-button @click="removeCountDown(countdown.id)" round type="error">
              <template #icon>
                <i style="line-height: 0;" class="fi fi-rr-calendar-plus"></i>
              </template>
              <span>xoá</span>
            </n-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { NEmpty, NSpin, NSpace, NButton, NEllipsis } from 'naive-ui';

import { ref, onUnmounted, onMounted } from 'vue';

import cronstrue from 'cronstrue';
import notyf from '@/notyf';
import { storeToRefs } from 'pinia'

import { MessageSocketProps, PacketProps, PacketControll, TouchProps, WidgetType, CountdownProps, LoadType } from '@/components/Widget';

import { useCommonStore } from '@/store';

enum StateCountDown {
  END_LOAD,
  START_LOAD,
  NO_COUNTDOWN,
}

const props = defineProps<{
  idDevice: string,
  loadFrom: LoadType,
  dType?: WidgetType,
}>()

const { ipMeshRoot, wsClient } = storeToRefs(useCommonStore());

const stateCountDown = ref<StateCountDown>(StateCountDown.START_LOAD);

const countdowns = ref<Array<CountdownProps> | []>([]);
const timePresentOnRootDevice = ref<number>(); // unit - seconds 
const timeCountOnRootDevice = ref<number>(); // unit - seconds 

const onMessage = (event: MessageEvent<any>) => {
  const { target, payload }: MessageSocketProps = JSON.parse(typeof event.data === 'string' ? event.data : '');

  if (target !== props.idDevice) { // check device id of payload
    return;
  }

  if (payload) {
    const { dType, pAction, pType, countdown, id, timestamp, mode, state, position, createAt } = payload;
    /* handle via action type =)) */
    if (dType === props.dType) {
      if (pType === 'countdown') {
        if (pAction === 'READ') {
          if (countdown) {
            countdowns.value = countdown as Array<CountdownProps>;
            if (countdown.length === 0) {
              stateCountDown.value = StateCountDown.NO_COUNTDOWN;
            } else {
              stateCountDown.value = StateCountDown.END_LOAD;
            }
          }
        } else if (pAction === 'DELETE') {
          if (id) {
            notyf.success(`Đã xoá bộ hẹn giờ với id: ${id}.`);
            countdowns.value = countdowns.value.filter(countdown => countdown.id != id);
            if (countdowns.length) {
              stateCountDown.value = StateCountDown.NO_COUNTDOWN;
            }
          }
        } else if (pAction === 'CREATE') {
          notyf.success(`Tạo bộ hẹn giờ thành công - chạy sau ${timestamp}s!`);
          const tmpCountDown = { id, timestamp, mode, state, createAt };
          countdowns.value = [...countdowns.value, mode ? { ...tmpCountDown } : { ...tmpCountDown, position }]
        }
      } else if (pType === 'timestamp') {
        if (pAction === 'READ') {
          if (typeof timestamp === 'number') {
            timePresentOnRootDevice.value = timestamp;
          }
        }
      }
    }
  }
}

const removeCountDown = (id: string) => {
  if (props.loadFrom === 'ws') {
    const packet: PacketProps<PacketControll<TouchProps>> = {
      target: props.idDevice,
      payload: {
        id,
        mode: 1, // remove single schedule
        pType: 'countdown',
        dType: props.dType,
        pAction: 'DELETE',
      }
    };
    if (wsClient.value) {
      if (wsClient.value.readyState === wsClient.value.OPEN) {
        wsClient.value.send(JSON.stringify(packet));
      }
    }
  }
}

onMounted(() => {
  if (props.loadFrom === 'ws') {

    if (wsClient.value) {
      const packet: PacketProps<PacketControll<TouchProps>> = {
        target: props.idDevice,
        payload: {
          pType: 'timestamp',
          dType: props.dType,
          pAction: 'READ',
        }
      };
      if (wsClient.value.readyState === wsClient.value.OPEN) {
        wsClient.value.addEventListener('message', onMessage);
        wsClient.value.send(JSON.stringify(packet)); // request timestamp on device
        packet.payload.pType = 'countdown';
        wsClient.value.send(JSON.stringify(packet)); // request list countdown
      } else {
        stateCountDown.value = StateCountDown.NO_COUNTDOWN;
      }
    }
  }
})

onUnmounted(() => {
  if (props.loadFrom === 'ws') {
    if (wsClient.value) {
      wsClient.value.removeEventListener('message', onMessage);
    }
  }
})

</script>

<style scoped></style>