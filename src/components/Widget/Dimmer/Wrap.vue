<template>
  <div>
    <slot name="header" :type="props.type" :id="idDevice" :status="status" :colors="props.colors"></slot>
    <slot name="widget" :type="props.type" :id="idDevice" :color="color"></slot>
    <slot name="footer" :type="props.type" :id="idDevice" :change-controll="changeColor"></slot>
  </div>
</template>

<script setup lang="ts">

import { PropType, ref, onBeforeUnmount, onMounted } from 'vue';
import { WidgetType } from '@/components/Widget';
import { colorChannel, TrackingResponse } from '@/components/Widget/Dimmer';

import { useCommonStore } from '@/store'

const commonStore = useCommonStore();

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

const idDevice = '7821-84e0-b478';
const color = ref<colorChannel>(props.colors[0]);
const countColorPresent = ref<number>(0);
const status = ref<boolean>(false);
let idTrackingTimeout: NodeJS.Timeout;
const poolingTracking = 10;

const pathTracking = `/${idDevice}/dimmer/tracking`;

const changeColor = () => {
  if (countColorPresent.value >= 0 && countColorPresent.value < props.colors.length - 1) {
    countColorPresent.value = countColorPresent.value + 1;
  } else {
    countColorPresent.value = 0;
  }
  color.value = props.colors[countColorPresent.value];
}


if (commonStore.mqttBroker?.connected) {
  commonStore.mqttBroker.on('message', function (topic, message) {
    console.log(topic);
    if (topic === pathTracking) {
      const payload: TrackingResponse = JSON.parse(message.toString() ?? '');

      status.value = true;
      if (idTrackingTimeout) { clearTimeout(idTrackingTimeout) }
      idTrackingTimeout = setTimeout(() => {
        status.value = false;
      }, poolingTracking * 1000);
    }
  })
}

onMounted(() => {

  if (commonStore.mqttBroker?.connected) {
    commonStore.mqttBroker.subscribe(pathTracking, (err) => {
      if (!err) {
        console.log('sub path = ', pathTracking);
      }
    });
  }
});

onBeforeUnmount(() => {
  if (commonStore.mqttBroker?.connected) {
    commonStore.mqttBroker.unsubscribe(pathTracking, () => {
      console.log('unsucribe => ', pathTracking);
    });
    commonStore.mqttBroker.removeAllListeners('message');
  }
})

</script>

<style scoped></style>