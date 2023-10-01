<template>
  <div class="bg-white p-4 shadow-sm rounded-sm flex justify-between">
    <div class="flex-1">
      <p><b>MAC</b>: {{ props.nodeValue.macAddress }}</p>
      <p><b>IP</b>: {{ props.nodeValue.ipAddress }}</p>
      <p><b>PORT</b>: {{ props.nodeValue.port }}</p>
    </div>
    <n-space align="center">
      <n-button @click="controllNode(props.nodeValue, {
        some: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus rutrum tellus pellentesque eu tincidunt tortor. Nisl nisi scelerisque eu ultrices vitae auctor eu. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus.'
      })" type="primary">
        gửi dữ liệu
      </n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { NButton, NSpace } from "naive-ui";

interface StateSwitchProps {
  position: number,
  state: boolean,
}

export interface NodeMeshProps {
  macAddress: string;
  ipAddress: string;
  port: number;
  deviceType: string;
  value: Array<StateSwitchProps>
}

export interface ControllProps {
  target: NodeMeshProps;
  payload: any;
}

const emit = defineEmits<{
  (e: 'controll', value: ControllProps): void
}>()

const props = defineProps<{
  nodeValue: NodeMeshProps;
}>();

const controllNode = async (target: NodeMeshProps, payload: any) => {
  emit('controll', { target, payload });
};

</script>
