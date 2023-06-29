import mqtt from 'mqtt/dist/mqtt';

const connectBroker = (): Promise<mqtt.MqttClient> => {

  const client = mqtt.connect('ws://broker.hivemq.com:8000', {
    path: '/mqtt',
    protocolId: 'MQIsdp',
    protocolVersion: 3
  });

  return new Promise((resolve, reject) => {
  
    client.on('connect', () => {
      console.log('mqtt is connected');
      resolve(client);
    })

    client.on('error', (err) => {
      console.log('mqtt is connect is error: ', err.message);
      resolve(client);
    })

  })

}

export default connectBroker;
