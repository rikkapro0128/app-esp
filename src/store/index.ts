import { defineStore } from "pinia";

import * as mqtt from "mqtt/dist/mqtt.min";

interface StateProps {
  mqttBroker: mqtt.Client | undefined,
}

export const useCommonStore = defineStore("common", {
  state: (): StateProps => ({
    mqttBroker: undefined,
  }),
  getters: {},
  actions: {},
});
