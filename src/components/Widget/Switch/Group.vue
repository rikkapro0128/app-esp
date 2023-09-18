<template>
  <div>
    <title-switch :id="props.id" :type="(props.type as WidgetType)"></title-switch>
    <div class="flex mt-8 mb-4">
      <div v-if="sw_count != 0" class="w-full grid grid-cols-4">
        <switch-device @controll="(state) => hanldeTouch(sw, state)" v-for="sw in sw_count" :key="sw"
          :name="`Công tắc ${sw}`" />
      </div>
      <div v-else>thiết bị trống</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { WidgetType } from '@/components/Widget';

import TitleSwitch from '@/components/Widget/Title.vue';
import SwitchDevice from '@/components/Widget/Switch/Switch.vue';

interface Props {
  type: string,
  id: string,
}

export interface GroupControllProps {
  position: number,
  state: boolean,
}

const emit = defineEmits<{
  (e: 'group-controll', value: GroupControllProps): void
}>()

const props = defineProps<Props>();
const sw_count = ref<number>(0);


if (props.type && props.type.includes('touch')) {
  sw_count.value = parseInt(props.type.slice(-1));
}

const hanldeTouch = (index: number, state: boolean) => {
  emit('group-controll', { position: index, state });
}
</script>

<style scoped></style>