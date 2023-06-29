<template>
  <div class="pb-4 relative z-10">
    <i class="fi fi-rr-dot-circle mr-2"></i>
    <n-ellipsis class="text-xl font-thin">{{ translateType[props.type] }} {{ props.title }}
    </n-ellipsis>
  </div>
</template>

<script setup lang="ts">

import { NEllipsis } from 'naive-ui'

import { PropType } from 'vue';

import { WidgetType } from '@/components/Widget/InfoWrap.vue';

const translateType = {
  'dimmer': 'Dimmer',
  'switch': 'Công tắc',
  'color': 'Màu sắc',
}

const props = defineProps({
  type: {
    type: String as PropType<WidgetType>,
    default: 'dimmer',
  },
  title: {
    type: String,
  }
});

</script>

<style scoped></style>