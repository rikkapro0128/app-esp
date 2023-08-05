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
          :class="index != 0 ? '' : ''" :key="job.id" v-for="(job, index) in scheduleJobs">
          <div>
            <span class="text-xs opacity-50">#id: {{ job.id }}</span>
            <p class="flex">
            <p class="font-bold flex items-center h-fit">
              <i style="line-height: 0;" class="fi fi-rr-clock-five mr-2"></i>
              <span class="font-bold">Thời gian:</span>
            </p>
            <n-ellipsis style="max-width: 120px" line-clamp="1" expand-trigger="click" class="ml-1">{{
              job?.cronExpresssion
            }}</n-ellipsis>
            </p>
            <p class="flex items-center"><i style="line-height: 0;" class="fi fi-rr-rotate-right mr-2"></i><span
                class="font-bold">Lặp lại</span>: {{
                  job.repeat ? 'có' : 'không'
                }}</p>
            <div class="flex items-center">
              <i style="line-height: 0;" class="fi fi-rr-brightness mr-2"></i>
              <p><span class="font-bold">Trắng</span>: {{ job.percent_white }}%</p>
              <span class="mx-2">-</span>
              <p><span class="font-bold">Vàng</span>: {{ job.percent_yellow }}%</p>
            </div>
          </div>
          <div class="flex items-center">
            <n-button @click="removeSchedule(job.id)" round type="error">
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

import { useCommonStore } from '@/store'

interface ScheduleJob {
  id: string,
  percent_white: number,
  percent_yellow: number,
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

const props = defineProps({
  idDevice: {
    type: String,
  }
})

const commonStore = useCommonStore();

let signal_received = false;

const stateSchedule = ref<StateSchedule>(StateSchedule.START_LOAD);

const scheduleJobs = ref<Array<ScheduleJob> | []>([]);

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

if (typeof pathScheduleJob === 'string') {

  commonStore.mqttBroker?.on('message', ctx_listener);
}

const removeSchedule = (id: string) => {
  if (typeof pathRemoveSchedule === 'string') {
    commonStore.mqttBroker?.publish(pathRemoveSchedule, JSON.stringify({ id: id }));
    scheduleJobs.value = scheduleJobs.value.filter(schedule => schedule.id !== id);
    if (scheduleJobs.value.length === 0) {
      stateSchedule.value = StateSchedule.NO_SCHEDULE;
    }
    notyf.success(`Đã xoá lập lịch với id: ${id}.`);
  }
}

onMounted(() => {
  if (typeof pathScheduleJob === 'string') {
    commonStore.mqttBroker?.subscribe(pathScheduleJob, (payload) => {
      console.log('sub path = ', pathScheduleJob);
    });
  }


  if (typeof pathReadSchedule === 'string') {
    commonStore.mqttBroker?.publish(pathReadSchedule, 'start');
  }

})

onUnmounted(() => {
  if (typeof pathScheduleJob === 'string') {
    commonStore.mqttBroker?.unsubscribe(pathScheduleJob, () => {
      console.log('unsucribe => ', pathScheduleJob);
    });
  }
  commonStore.mqttBroker?.removeListener('message', ctx_listener);
})

</script>

<style scoped></style>