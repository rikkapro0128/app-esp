<template>
  <div class="knob mx-auto bg-white" :style="{ 'width': `${size}px`, 'height': `${size}px` }">
    <div class="absolute w-full h-full top-0 left-0 rounded-full knob-gradient"></div>
    <p
      class="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-3xl drop-shadow-sm">
      {{ percentDimmer }}</p>
    <div ref="dimmer" class="w-full h-full relative ">
      <div
        class="w-[90%] h-[90%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 knob--dot after:shadow-inner bg-white rounded-full after:bg-green-400 after:shadow-slate-500">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Draggable } from 'gsap/Draggable';

import { onMounted, ref } from 'vue';

const props = defineProps({
  size: {
    type: Number,
    default: 0.6,
  },
  paddingX: {
    type: Number,
    default: 20
  }
})

const dimmer = ref<HTMLElement | null>(null);
const padingX = 2 * props.paddingX; // 1.25rem = 1.25 * 16px
const percentKnob = props.size;
const size = Math.round((window.innerWidth - padingX) * percentKnob);
const percentDimmer = ref<number>(0);
const minRotation = 0;
const maxRotation = 360;

onMounted(() => {
  if (dimmer.value) {
    const knob = Draggable.create(dimmer.value, {
      type: 'rotation',
      inertia: true,
      bounds: {
        minRotation,
        maxRotation,
      },
      onMove() {
        percentDimmer.value = Math.round((Math.round(this.endRotation) - minRotation) * 100 / (maxRotation - minRotation));
      }
    })
  }
})

</script>

<style scoped>
.knob {
  position: relative;
  border-radius: 50%;
  box-shadow: 0px 8px 15px #b9b9b9, -14px -14px 33px #ffffff;
}

.knob--dot::after {
  content: '';
  position: absolute;
  display: block;
  width: 1rem;
  height: 1rem;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
}

.knob-gradient {
  background: linear-gradient(0deg, rgba(233, 233, 233, 0.38) 0%, rgba(255, 255, 255, 0) 100%);
}
</style>