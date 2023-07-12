<template>
  <n-space vertical>
    <n-divider style="margin: 0.4rem 0;" title-placement="left">
      <span class="font-bold text-lg">Thay đổi</span>
    </n-divider>
    <n-space vertical v-for="(color, index) in props.colors">
      <n-space justify="space-between">
        <span>Màu: {{ translateColorChannel[color] }}</span>
        <span>{{ dimmerBrightness[color] }}%</span>
      </n-space>
      <n-slider v-model:value="dimmerBrightness[color]" :step="1" />
    </n-space>
  </n-space>
</template>

<script setup lang="ts">

import { reactive, watch } from 'vue';
import { NSlider, NSpace, NDivider } from 'naive-ui';

import { colorChannel, BrightnessColor } from '@/components/Widget/Dimmer';

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

const dimmerBrightness: BrightnessColor = reactive({ ...props.colors.reduce((ctx, color) => ({ ...ctx, [color]: 50 }), {}) })

const emit = defineEmits<{
  (e: 'change-brightness', colorsBrightness: BrightnessColor): void
}>()

watch(dimmerBrightness, (payload: BrightnessColor) => {
  emit('change-brightness', payload);
})

</script>

<style scoped></style>