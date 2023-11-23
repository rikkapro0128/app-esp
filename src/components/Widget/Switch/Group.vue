<template>
  <div>
    <title-switch :is-root="props.infoSwitch.info?.isRoot" :id="props.infoSwitch.target" :name="props.infoSwitch.info.name" :type="(props.infoSwitch.info.dType as WidgetType)"
      :ram-size="props.infoSwitch.info.ramUse" :status="props.infoSwitch.status"></title-switch>
    <div class="flex mt-8 mb-4">
      <div v-if="props.infoSwitch.value.length > 0" class="w-full grid grid-cols-4">
        <switch-device @controll="(state) => hanldeTouch(sw.position, state)" v-for="sw in props.infoSwitch.value"
          :key="sw.position" :name="sw?.name ?? `Công tắc ${sw.position}`" :state="sw.state" />
      </div>
      <div v-else>thiết bị trống</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref, watch } from 'vue';

import { WidgetType } from '@/components/Widget';

import TitleSwitch from '@/components/Widget/Title.vue';
import SwitchDevice from '@/components/Widget/Switch/Switch.vue';

import { FullInfoNodeProps } from '@/store'

export interface GroupControllProps {
  position: number,
  state: boolean,
}

interface Props {
  infoSwitch: FullInfoNodeProps,
}

const emit = defineEmits<{
  (e: 'group-controll', value: GroupControllProps): void
}>()

const props = defineProps<Props>();

const hanldeTouch = (index: number, state: boolean) => {
  emit('group-controll', { position: index, state });
}

</script>

<style scoped></style>