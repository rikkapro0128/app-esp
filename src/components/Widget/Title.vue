<template>
  <div class="relative z-10 flex justify-between items-center">
    <div class="flex items-center">
      <i style="line-height: 0;" class="fi fi-rr-location-crosshairs mr-2" :class="props?.isRoot ? 'text-red-400' : 'text-green-400'"></i>
      <div class="relative">
        <div class="relative text-xl font-thin flex items-center">
          <n-ellipsis :line-clamp="1">{{ name ?? translateType[props.type] }}</n-ellipsis>
          <p class="border py-1 px-2 rounded-full ml-2 flex items-center"
            :class="props.status ? 'border-green-100' : 'border-slate-200'">
            <span class="text-xs text-slate-500 whitespace-nowrap">{{ props.status ? 'đang kết nối' : 'mất kết nối' }}</span>
            <span class="w-2 h-2 ml-1 rounded-full" :class="props.status ? 'bg-green-200' : 'bg-slate-200'"></span>
          </p>
        </div>
        <div class="absolute top-full left-0 whitespace-nowrap">
          <span>id: {{ props.id ?? NaN }} - {{ props.ramSize }} bytes</span>
        </div>
      </div>
    </div>
    <n-popover :show="optionsState" :on-update:show="handlePopoverSetting" style="padding: 0;" trigger="click"
      placement="bottom-end">
      <template #trigger>
        <n-button class="relative top-1" round icon-placement="right" size="small">
          <template #icon>
            <i style="line-height: 0;" class="fi fi-rr-settings font-bold transition-transform"
              :class="settingActive ? 'rotate-90' : ''"></i>
          </template>
          cài đặt
        </n-button>
      </template>
      <n-button-group size="large" vertical>
        <n-button :key="option.key" v-for="option in optionsDropdown"
          @click="handleActiveSchedule(option.key as TypeMenu)">
          <i style="line-height: 0;" class="mr-2" :class="option.icon"></i>
          <span>{{ option.label }}</span>
        </n-button>
      </n-button-group>
    </n-popover>
  </div>
</template>

<script setup lang="ts">

import { NEllipsis, NButton, NPopover, NButtonGroup } from 'naive-ui'

import { PropType, reactive, ref, getCurrentInstance } from 'vue';

import { translateType } from '@/translate'

import { WidgetType, TypeMenu, MenuProps } from '@/components/Widget';
import { Emitter, EventType } from 'mitt';

const app = getCurrentInstance();
const emitter = app?.appContext.config.globalProperties.emitter as Emitter<Record<EventType, MenuProps>>;

const props = defineProps<{
  type: WidgetType,
  id: string,
  name?: string,
  ramSize: number | undefined,
  status?: boolean,
  isRoot?: boolean,
}>();

const optionsState = ref<boolean>(false);
const settingActive = ref<boolean>(false);

const optionsDropdown = [
  {
    label: 'lập lịch',
    key: 'schedule',
    icon: 'fi fi-rr-calendar-clock'
  },
  {
    label: 'hẹn giờ',
    key: 'countdown',
    icon: 'fi fi-rr-time-add'
  },
  {
    label: 'ngữ cảnh',
    key: 'scene',
    icon: 'fi fi-rr-picture'
  },
  {
    label: 'Thông tin',
    key: 'info_node',
    icon: 'fi fi-rr-comment-info'
  },
]

const handleSelect = (key: string | number) => {
  console.log(key);
};

const handlePopoverSetting = (value: boolean) => {
  settingActive.value = value;
  optionsState.value = value;
}

const handleActiveSchedule = (select: TypeMenu) => {
  optionsState.value = false;
  emitter?.emit('contextmenu', { id: props.id as string, dType: props.type, select })
}

</script>

<style scoped></style>