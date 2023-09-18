import * as mqtt from "mqtt/dist/mqtt.min";

import { App } from "vue";

import { useCommonStore } from "@/store";

const connectBroker = (app: App<Element>) => {
  const commonStore = useCommonStore();

  const client = mqtt.connect("ws://broker.hivemq.com:8000", {
    path: "/mqtt",
    protocolId: "MQIsdp",
    protocolVersion: 3,
  });

  commonStore.mqttBroker = client;
  app.config.globalProperties.$clientMQTT = client;

  client.on("connect", () => {
    console.log("connect");
  });

  client.on("offline", () => {
    console.log("offline");
  });

  client.on("reconnect", () => {
    console.log("reconnect");
  });

  client.on("disconnect", () => {
    console.log("disconnect");
  });

  client.on("error", () => {
    console.log("error");
  });

  client.on("close", () => {
    console.log("close");
  });
};

const connectSocketServer = (hostname: string) => {
  const commonStore = useCommonStore();

  if (commonStore.wsClient) {
    if (commonStore.wsClient?.readyState === WebSocket.OPEN) {
      commonStore.wsClient.onclose = null;
      commonStore.wsClient.close(); // close connection if DNS change
    }
  }

  startWebsocket(hostname, (ws) => {
    commonStore.wsClient = ws;
  });
};

const startWebsocket = (hostname: string, cb: (ctx: WebSocket) => void) => {
  let ws = new WebSocket(`ws://${hostname}/ws`);

  cb(ws);

  // event occur when socket is connected
  ws.onopen = function (event) {
    console.log("Kết nối đã được thiết lập");
  };

  // event occur when socket recieved message
  ws.onmessage = function (event) {
    const message = event.data;
    console.log("Nhận được dữ liệu từ server:", message);
  };

  // event occur when socket lost connection
  ws.onclose = function (event) {
    console.log("Kết nối đã đóng");
    setTimeout(() => {
      console.log("Đang kết nối lại...");
      startWebsocket(hostname, cb);
    }, 3000);
  };

  ws.onerror = function (err) {
    console.log("Đã có lỗi xảy ra: ", err);
    ws.onclose = null;
    ws.close();
  };
};

export { connectSocketServer };

export default connectBroker;
