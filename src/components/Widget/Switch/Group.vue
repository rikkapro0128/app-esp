<template>
  <div>
    <title-switch :id="props.id" :type="(props.type as WidgetType)"></title-switch>
    <div class="flex mt-8 mb-4">
      <div v-if="props.infoSwitch.value.length > 0" class="w-full grid grid-cols-4">
        <switch-device @controll="(state) => hanldeTouch(sw.position, state)" v-for="sw in props.infoSwitch.value"
          :key="sw.position" :name="`Công tắc ${sw.position}`" :state="sw.state" />
      </div>
      <div v-else>thiết bị trống</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref } from 'vue';

import { WidgetType } from '@/components/Widget';
import { NodeMeshProps } from "@/components/MeshNodeDemo.vue";

import TitleSwitch from '@/components/Widget/Title.vue';
import SwitchDevice from '@/components/Widget/Switch/Switch.vue';

interface Props {
  type: string,
  id: string,
  infoSwitch: NodeMeshProps,
}

export interface GroupControllProps {
  position: number,
  state: boolean,
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