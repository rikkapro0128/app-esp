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

  commonStore.mqttBroker = client;
  app.config.globalProperties.$clientMQTT = client;

  client.on('connect', () => {
    console.log('connect');
  })

  client.on('offline', () => {
    console.log('offline');
  })

  client.on('reconnect', () => {
    console.log('reconnect');
  })

  client.on('disconnect', () => {
    console.log('disconnect');
  })

  client.on('error', () => {
    console.log('error');
    
  })

  client.on('close', () => {
    console.log('close');
  })

}

export default connectBroker;
