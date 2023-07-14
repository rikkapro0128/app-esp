import * as mqtt from "mqtt/dist/mqtt.min"

const connectBroker = (): mqtt.MqttClient => {

  const client = mqtt.connect('ws://broker.hivemq.com:8000', {
    path: '/mqtt',
    protocolId: 'MQIsdp',
    protocolVersion: 3
  });

  return client;

}

export default connectBroker;
