<template>
  <div class="flex-1 -mx-[1.55rem] py-4 overflow-hidden">
    <transition name="fade" mode="out-in" :duration="200">
      <n-empty v-if="stateSchedule === StateSchedule.NO_SCHEDULE" class="h-full flex flex-col justify-center"
        description="chưa có lập lịch nào được tạo.">
        <template #icon>
          <i style="line-height: 0;" class="fi fi-rr-calendar-xmark"></i>
        </template>
      </n-empty>
      <div class="h-full flex justify-center items-center" v-else-if="stateSchedule === StateSchedule.START_LOAD">
        <n-space vertical align="center">
          <n-spin size="medium" />
          <p class="animate-pulse">đang tải</p>
        </n-space>
      </div>
      <div class="h-full overflow-y-scroll" v-else-if="stateSchedule === StateSchedule.END_LOAD">
        <div
          class="bg-white flex justify-between flex-nowrap relative z-10 miru__shadow--soft px-4 py-2 rounded-md mx-5 mb-2"
          :class="index != 0 ? '' : ''" :key="schedule.id" v-for="(schedule, index) in schedules">
          <div>
            <span class="text-xs opacity-50">#id: {{ schedule.id }}</span>
            <p class="flex">
            <p class="font-bold flex items-center h-fit">
              <i style="line-height: 0;" class="fi fi-rr-clock-five mr-2"></i>
              <span class="font-bold">Thời gian:</span>
            </p>
            <n-ellipsis style="max-width: 120px" line-clamp="1" expand-trigger="click" class="ml-1">{{
              schedule.expression
            }}</n-ellipsis>
            </p>
            <p class="flex items-center"><i style="line-height: 0;" class="fi fi-rr-rotate-right mr-2"></i><span
                class="font-bold">Lặp lại</span>: {{
                  schedule.loop ? 'có' : 'không'
                }}</p>
            <div v-if="props.dType === 'light_dimmer'" class="flex items-center">
              <i style="line-height: 0;" class="fi fi-rr-brightness mr-2"></i>
              <p><span class="font-bold">Trắng</span>: {{ schedule.percent_white }}%</p>
              <span class="mx-2">-</span>
              <p><span class="font-bold">Vàng</span>: {{ schedule.percent_yellow }}%</p>
            </div>
            <div v-else-if="props.dType?.includes('touch')" class="flex items-center">
              <div v-if="schedule.mode === 1">
                <p><span class="font-bold">trạng thái</span>: {{ schedule.state ? 'bật' : 'tắt' }} hết</p>
              </div>
              <div class="flex" v-else>
                <i style="line-height: 0;" class="fi fi-rr-brightness mr-2"></i>
                <p><span class="font-bold">vị trí</span>: chạm {{ schedule.position }}</p>
                <span class="mx-2">-</span>
                <p><span class="font-bold">trạng thái</span>: {{ schedule.state ? 'bật' : 'tắt' }}</p>
              </div>
            </div>
          </div>
          <div class="flex items-center">
            <n-button @click="removeSchedule(schedule.id)" round type="error">
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

import { MessageSocketProps, PacketProps, PacketControll, TouchProps, WidgetType, ScheduleProps, LoadType } from '@/components/Widget';

import { useCommonStore } from '@/store'

interface ScheduleJob {
  id: string,
  percent_white?: number,
  percent_yellow?: number,
  cron: string,
  repeat: boolean,
  status?: string,
  cronExpresssion?: string,
}

enum StateSchedule {
  END_LOAD,
  START_LOAD,
  NO_SCHEDULE,
}

const props = defineProps<{
  idDevice: string,
  loadFrom: LoadType,
  dType?: WidgetType,
}>()

const commonStore = useCommonStore();

const { ipMeshRoot, wsClient } = storeToRefs(useCommonStore());

let signal_received = false;

const stateSchedule = ref<StateSchedule>(StateSchedule.START_LOAD);

const scheduleJobs = ref<Array<ScheduleJob> | []>([]);
const schedules = ref<Array<ScheduleProps> | []>([]);

const pathScheduleJob = props.idDevice ? `/${props.idDevice}/dimmer/schedule/job` : undefined;

const pathReadSchedule = props.idDevice ? `/${props.idDevice}/dimmer/read/schedule` : undefined;
const pathRemoveSchedule = props.idDevice ? `/${props.idDevice}/dimmer/remove/schedule` : undefined;

const ctx_listener = (topic: string, message: any) => {
  if (topic === pathScheduleJob) {
    const payload: ScheduleJob = JSON.parse(message.toString() ?? '');
    console.log(payload);
    if (payload?.status === 'END') {
      signal_received = false;
      stateSchedule.value = StateSchedule.END_LOAD;
    }
    if (signal_received) {
      let cronstr;
      try {
        cronstr = cronstrue.toString(payload.cron, { use24HourTimeFormat: true });
      } catch (error) {
        cronstr = 'không hợp lệ';
      }
      scheduleJobs.value = [...scheduleJobs.value, { ...payload, cronExpresssion: cronstr }];
    }
    if (payload?.status === 'START') {
      signal_received = true;
      stateSchedule.value = StateSchedule.START_LOAD;
      scheduleJobs.value = [];
    } else if (payload?.status === 'JOB_ZERO') {
      signal_received = false;
      stateSchedule.value = StateSchedule.NO_SCHEDULE;
    }
  }
}

const onMessage = (event: MessageEvent<any>) => {
  const { target, payload }: MessageSocketProps = JSON.parse(typeof event.data === 'string' ? event.data : '');

  if (target !== props.idDevice) { // check device id of payload
    return;
  }

  if (payload) {
    const { dType, pAction, pType, schedule, id, message } = payload;
    /* handle via action type =)) */
    if (pType === 'schedule') {
      console.log(message);
      if (message === 'SCHEDULE_READ_OK') {
        if (schedule) {
          schedules.value = schedule as Array<ScheduleProps>;
          if (schedule.length === 0) {
            stateSchedule.value = StateSchedule.NO_SCHEDULE;
          } else {
            stateSchedule.value = StateSchedule.END_LOAD;
          }
        }
      }
      else if (message === 'SCHEDULE_REMOVE_OK') {
        if (id) {
          notyf.success(`Đã xoá lập lịch với id: ${id}.`);
          schedules.value = schedules.value.filter(schedule => schedule.id != id);
        }
      } else if (message === 'SCHEDULE_CREATE_OK') {
        notyf.success('Tạo lập lịch thành công!');
      }
    }
  }
}

if (typeof pathScheduleJob === 'string') {
  if (props.loadFrom === 'mqtt') {
    commonStore.mqttBroker?.on('message', ctx_listener);
  }
}

const removeSchedule = (id: string) => {
  if (props.loadFrom === 'mqtt') {
    if (typeof pathRemoveSchedule === 'string') {
      commonStore.mqttBroker?.publish(pathRemoveSchedule, JSON.stringify({ id: id }));
      scheduleJobs.value = scheduleJobs.value.filter(schedule => schedule.id !== id);
      if (scheduleJobs.value.length === 0) {
        stateSchedule.value = StateSchedule.NO_SCHEDULE;
      }
      notyf.success(`Đã xoá lập lịch với id: ${id}.`);
    }
  } else if (props.loadFrom === 'ws') {
    const packet: PacketProps<PacketControll<TouchProps>> = {
      target: props.idDevice,
      payload: {
        id,
        mode: 1, // remove single schedule
        pType: 'schedule',
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
  if (props.loadFrom === 'mqtt') {
    if (typeof pathScheduleJob === 'string') {
      commonStore.mqttBroker?.subscribe(pathScheduleJob, (payload) => {
        console.log('sub path = ', pathScheduleJob);
      });
    }

    if (typeof pathReadSchedule === 'string') {
      commonStore.mqttBroker?.publish(pathReadSchedule, 'start');
    }
  } else {
    if (wsClient.value) {
      const packet: PacketProps<PacketControll<TouchProps>> = {
        target: props.idDevice,
        payload: {
          pType: 'schedule',
          dType: props.dType,
          pAction: 'READ',
        }
      };
      if (wsClient.value.readyState === wsClient.value.OPEN) {
        wsClient.value.addEventListener('message', onMessage);
        wsClient.value.send(JSON.stringify(packet));
      } else {
        stateSchedule.value = StateSchedule.NO_SCHEDULE;
      }
    }
  }
})

onUnmounted(() => {
  if (props.loadFrom === 'mqtt') {
    if (typeof pathScheduleJob === 'string') {
      commonStore.mqttBroker?.unsubscribe(pathScheduleJob, () => {
        console.log('unsucribe => ', pathScheduleJob);
      });
    }
    commonStore.mqttBroker?.removeListener('message', ctx_listener);
  } else if (props.loadFrom === 'ws') {
    if (wsClient.value) {
      wsClient.value.removeEventListener('message', onMessage);
    }
  }
})

</script>

<style scoped></style>