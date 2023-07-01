<template>
  <n-space vertical>
    <span class="font-bold">Thay đổi</span>
    <n-space vertical v-for="(color, index) in dimmerBrightness.data">
      <span>Màu: {{ translateColorChannel[props.colors[index]] }}</span>
      <n-slider v-model:value="color[props.colors[index]].brightness" :step="1" />
    </n-space>
  </n-space>
</template>

<script setup lang="ts">

import { reactive, watch } from 'vue';
import { NSlider, NSpace } from 'naive-ui';

import { colorChannel } from '@/components/Widget/Dimmer';

type BrightnessColor = {
  [key in colorChannel]?: number;
};

const translateColorChannel = {
  'white': 'trắng',
  'yellow': 'vàng',
  'blue': 'xanh biển',
  'green': 'xanh lá',
  'red': 'đỏ',
}

const props = defineProps({
  colors: {
    type: Array<colorChannel>,
    default: ['white']
  }
})

const dimmerBrightness = reactive({
  data: [...props.colors.map(color => ({
    [color]: {
      brightness: 50
    }
  }))]
})

const emit = defineEmits<{
  (e: 'change-brightness', colorsBrightness: BrightnessColor): void
}>()

watch(() => dimmerBrightness.data, (payload) => {
  // payload.forEach(some => console.log({ [Object.keys(some)[0]]: some[Object.keys(some)[0]].brightness }))
  const colorsResult: BrightnessColor = payload.reduce((ctx, brightness) => ({ ...ctx, [Object.keys(brightness)[0]]: brightness[Object.keys(brightness)[0]].brightness }), {});
  emit('change-brightness', colorsResult);

}, { deep: true })

</script>

<style scoped></style>