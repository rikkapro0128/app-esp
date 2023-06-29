<template>
  <div>
    <slot name="header" :type="props.type"></slot>
    <slot name="widget" :type="props.type" :color="color"></slot>
    <slot name="footer" :type="props.type" :change-controll="changeColor"></slot>
  </div>
</template>

<script setup lang="ts">

export type WidgetType = 'dimmer' | 'switch' | 'color';
export type colorChannel = 'white' | 'yellow' | 'blue' | 'green' | 'red';

import { PropType, ref } from 'vue';

const props = defineProps({
  type: {
    type: String as PropType<WidgetType>,
    default: 'dimmer',
  },
  colors: {
    type: Array<colorChannel>,
    default: ['white']
  }
})

const color = ref<colorChannel>(props.colors[0]);
const countColorPresent = ref<number>(0);

const changeColor = () => {
  if (countColorPresent.value >= 0 && countColorPresent.value < props.colors.length - 1) {
    countColorPresent.value = countColorPresent.value + 1;
  } else {
    countColorPresent.value = 0;
  }
  color.value = props.colors[countColorPresent.value];
}

</script>

<style scoped></style>