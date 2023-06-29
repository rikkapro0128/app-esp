<template>
  <div class="pb-4 relative z-10">
    <i class="fi fi-rr-dot-circle mr-2"></i>
    <n-ellipsis class="text-xl font-thin">{{ translateType[props.type] }} {{ props.brigdeKey }} {{ props.title }}
    </n-ellipsis>
  </div>
</template>

<script setup lang="ts">

import { NEllipsis } from 'naive-ui'

export type WidgetType = 'dimmer' | 'switch' | 'color';

const translateType = {
  'dimmer': 'Dimmer',
  'switch': 'Công tắc',
  'color': 'Màu sắc',
}

interface Props {
  type: WidgetType,
  brigdeKey?: string,
  title: string,
}

const props = defineProps<Props>();

</script>

<style scoped></style>