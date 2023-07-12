<template>
  <!-- bg for view should be: #2C2C2C -->
  <div class="knob mx-auto bg-white mt-8" :style="{ 'width': `${size}px`, 'height': `${size}px` }">
    <div class="absolute w-full h-full top-0 left-0 rounded-full knob-gradient"></div>
    <div :style="{ 'background': `radial-gradient(circle, ${props.color} 0%, rgba(255, 255, 255, 0) 60%)` }"
      class="absolute -z-10 w-full h-full top-0 left-0 scale-150 rounded-full transition-colors"></div>
    <div class="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <p class="text-3xl drop-shadow-sm knob--percent text-center">
        {{ percentDimmer }}</p>
      <i class="fi fi-rr-brightness text-center block text-3xl mt-2 drop-shadow-md"></i>
    </div>
    <div ref="dimmer" class="w-full h-full relative">
      <div
        class="w-[90%] h-[90%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 knob--dot after:shadow-inner bg-white rounded-full after:bg-green-400 after:shadow-slate-500">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Draggable } from 'gsap/Draggable';
import gsap from 'gsap';

import { onMounted, ref, onUnmounted, getCurrentInstance, PropType, watch } from 'vue';

import { MqttClient } from 'mqtt/dist/mqtt';

import { colorChannel } from '@/components/Widget/Dimmer';

type BrightChannelColor = {
  [key in colorChannel]?: number;
};

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    default: 0.6,
  },
  paddingX: {
    type: Number,
    default: 20
  },
  color: {
    type: String as PropType<colorChannel>,
    default: 'white'
  }
})

const app = getCurrentInstance();

const dimmer = ref<HTMLElement | null>(null);
// const numColor = ref<number>(props.numColor);
const padingX = 2 * props.paddingX; // 1.25rem = 1.25 * 16px
const percentKnob = props.size;
const size = Math.round((window.innerWidth - padingX) * percentKnob);
const percentDimmer = ref<number>(0);
const minRotation = 0;
const maxRotation = 360;
let idTimeoutDebounce: NodeJS.Timeout;


const pathControll = `/${props.id}/dimmer/write/brightness`;
const pathRequestReadBrightness = `/${props.id}/dimmer/read/brightness`;

const pathResponseReadBrightness = `/${props.id}/dimmer/brightness/status`;

const clientMQTT = app?.appContext.config.globalProperties.$clientMQTT as MqttClient;

const handleControllPercent = () => {
  if (clientMQTT.connected) {
    clientMQTT.publish(pathControll, JSON.stringify({ [`brightness-${props.color}`]: percentDimmer.value }), { qos: 1 });
  }
}

if (clientMQTT.connected) {
  clientMQTT.on('message', function (topic, message) {
    if (topic === pathResponseReadBrightness) {
      const payload: BrightChannelColor = JSON.parse(message.toString() ?? '');

      if (dimmer.value) {
        if (Object.keys(payload)[0] === props.color) {
          gsap.to(dimmer.value, {
            rotate: Math.round((payload[props.color] ?? 0) * maxRotation / 100), onUpdate: function () {
              percentDimmer.value = Math.round((Math.round(parseInt(((dimmer.value?._gsap.rotation ?? '') as string).split('deg')[0])) - minRotation) * 100 / (maxRotation - minRotation));
            },
          })
        }

      }
    }
  })
}

onMounted(() => {

  clientMQTT.publish(pathRequestReadBrightness, JSON.stringify({ [props.color]: true }));

  if (clientMQTT.connected) {
    clientMQTT.subscribe(pathResponseReadBrightness, (payload) => {
      console.log('sub path = ', pathResponseReadBrightness);
    });
  }

  if (dimmer.value) {
    const knob = Draggable.create(dimmer.value, {
      type: 'rotation',
      inertia: true,
      bounds: {
        minRotation,
        maxRotation,
      },
      onMove() {
        if (idTimeoutDebounce) { clearTimeout(idTimeoutDebounce); }
        idTimeoutDebounce = setTimeout(handleControllPercent, 15);
        percentDimmer.value = Math.round((Math.round(this.endRotation) - minRotation) * 100 / (maxRotation - minRotation));
      }
    })
  }

})

watch(() => props.color, (color) => {
  clientMQTT.publish(pathRequestReadBrightness, JSON.stringify({ [color]: true }));
})

onUnmounted(() => {
  if (idTimeoutDebounce) { clearTimeout(idTimeoutDebounce); }

  clientMQTT.unsubscribe(pathResponseReadBrightness, () => {
    console.log('unsucribe => ', pathResponseReadBrightness);
  });
})

</script>

<style scoped>
.knob {
  position: relative;
  border-radius: 50%;
  box-shadow: 0px 8px 15px #b9b9b9, -14px -14px 33px #ffffff;
}

.knob--percent::after {
  position: absolute;
  content: '%';
  top: -20%;
  left: 100%;
  font-size: 0.8rem;
}

.knob--dot::after {
  content: '';
  position: absolute;
  display: block;
  width: 0.6rem;
  height: 0.6rem;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
}

.knob-gradient {
  background: linear-gradient(0deg, rgba(233, 233, 233, 0.38) 0%, rgba(255, 255, 255, 0) 100%);
}
</style>