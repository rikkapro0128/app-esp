import { defineStore } from "pinia";

export const useCommonStore = defineStore("common", {
  state: () => ({
    alert: {
      requireWiFi: false,
      requireConnectESP: false,
    }
  }),
  getters: {},
  actions: {},
});
