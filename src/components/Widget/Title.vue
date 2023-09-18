<template>
  <div class="relative z-10 flex items-center">
    <i style="line-height: 0;" class="fi fi-rr-location-crosshairs mr-2"></i>
    <div class="relative">
      <n-ellipsis expand-trigger="click" class="text-xl font-thin">{{ translateType[props.type] }}</n-ellipsis>
      <span class="absolute top-full left-0 whitespace-nowrap">id: {{ props.id ?? NaN }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">

import { NEllipsis } from 'naive-ui'

import { PropType } from 'vue';

import { WidgetType } from '@/components/Widget';

const translateType = {
  'dimmer': 'Dimmer',
  'switch': 'Công tắc',
  'color': 'Màu sắc',
  'touch_1': 'Công tắc 1',
  'touch_2': 'Công tắc 2',
  'touch_3': 'Công tắc 3',
  'touch_4': 'Công tắc 4',
  'light_dimmer': 'Dimmer đèn',
}

const props = defineProps({
  type: {
    type: String as PropType<WidgetType>,
    default: 'dimmer',
  },
  title: {
    type: String,
  },
  id: {
    type: String,
  },
});

</script>

<style scoped></style>