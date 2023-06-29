/// <reference types="vite/client" />

declare module "mqtt/dist/mqtt" {
  import MQTT from "mqtt"
  export = MQTT
}
