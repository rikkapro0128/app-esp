import * as mqtt from "mqtt/dist/mqtt.min"

import { App } from 'vue';

import { useCommonStore } from '@/store';

const connectBroker = (app: App<Element>) => {

  const commonStore = useCommonStore();

  const client = mqtt.connect('ws://broker.hivemq.com:8000', {
    path: '/mqtt',
    protocolId: 'MQIsdp',
    protocolVersion: 3
  });

  client.on('connect', () => {
    app.config.globalProperties.$clientMQTT = client;
    commonStore.mqttBroker = client;
  })

  client.on('offline', () => {
  })

  client.on('reconnect', () => {
  })

  client.on('disconnect', () => {
  })

  client.on('error', () => {
    
  })

  client.on('close', () => {
  })

}

export default connectBroker;
