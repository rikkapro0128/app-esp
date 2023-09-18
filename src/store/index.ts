import { defineStore } from "pinia";

import * as mqtt from "mqtt/dist/mqtt.min";

interface StateProps {
  mqttBroker: mqtt.Client | undefined,
  wsClient: WebSocket | undefined,
  ipMeshRoot: string | undefined,
}

export const useCommonStore = defineStore("common", {
  state: (): StateProps => ({
    mqttBroker: undefined,
    wsClient: undefined,
    ipMeshRoot: undefined,
  }),
  getters: {},
  actions: {},
});
