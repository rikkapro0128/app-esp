import * as mqtt from "mqtt/dist/mqtt.min";
import { CapacitorHttp } from "@capacitor/core";

import notyf from '@/notyf';

import { App } from "vue";

import {
  useCommonStore,
  useNodeStore,
  useMeshOTAStore,
  MessageReceiveProps,
  NodeInfoProps,
  FullInfoNodeProps,
} from "@/store";

import {
  MessageSocketProps,
  WidgetType,
  TouchProps,
  ResponseNode,
} from "@/components/Widget";

let idPoolPing: NodeJS.Timeout;

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

const initDefaultStateDevice = (dType: WidgetType): Array<TouchProps> => {
  if (dType.includes("touch")) {
    return Array(parseInt(dType.slice(-1)))
      .fill(0)
      .map((_, index) => ({ position: index + 1, state: false }));
  } else {
    return [];
  }
};

const requestDeviceState = (device: FullInfoNodeProps, ws: WebSocket) => {
  const { target, info } = device;
  if (info.dType.includes("touch")) {
    ws.send(
      JSON.stringify({
        target: target,
        payload: {
          pType: "touchpad_state",
          pAction: "READ",
        },
      } as MessageSocketProps)
    );
  }
};

const classifyPacket = (message: MessageSocketProps, ws: WebSocket) => {
  const { payload, target } = message;
  const { pAction, pType } = payload;
  if (pAction === "NOTIFY") {
    const nodeStore = useNodeStore();
    if (pType === "info_node") {
      const { pAction, pType, ...some } = payload as MessageReceiveProps;
      /* check node is exist */
      nodeStore.value = nodeStore.value.filter((node) => node.target != target);
      /* push new node */
      const node = {
        target: target,
        info: some,
        value: initDefaultStateDevice(payload.dType),
        status: true,
      };
      nodeStore.value.push(node as never);
      // console.log(nodeStore.value);
      requestDeviceState(node, ws);
    } else if (pType === "node_enter") {
      const nodeIndex = nodeStore.value.findIndex(
        (node) => node.target === target
      );
      nodeStore.value[nodeIndex].status = true;
    } else if (pType === "node_outer") {
      const nodeIndex = nodeStore.value.findIndex(
        (node) => node.target === target
      );
      nodeStore.value[nodeIndex].status = false;
    } else if (pType === "touchpad_state") {
      const { value } = payload;
      const nodeIndex = nodeStore.value.findIndex(
        (node) => node.target === target
      );
      nodeStore.value[nodeIndex].value = value as Array<TouchProps>;
    } else if (pType === "controll") {
      const { position, state } = payload;

      if (typeof position === "number" && typeof state === "boolean") {
        const nodeIndex = nodeStore.value.findIndex(
          (node) => node.target === target
        );
        if (nodeStore.value[nodeIndex]?.value) {
          nodeStore.value[nodeIndex].value[position - 1].state = state;
        }
      }
    } else if (pType === "ota") {
      const { status } = payload;
      const { upgradeInfo, downloadInfo } = useMeshOTAStore();
      if (status === "downloading") {
        const { present, total } = payload;
        if (present && total) {
          downloadInfo.percent =
            (((present / total) * 100).toFixed(1) as unknown as number) * 1;
          if (downloadInfo.percent === 100) {
            downloadInfo.processing = false;
          }
        }
      } else if (status === "upgrading") {
        const { value } = payload;
        // console.log(upgradeInfo.percent);
        upgradeInfo.percent = typeof value === "number" ? value : 0;
        if (value === 100) {
          upgradeInfo.processing = false;
        }
      }else if(status === 'done') {
        const { numSuccessed, restartAfter } = payload;
        notyf.success(`Có ${numSuccessed} thiết bị cập nhật xong, sẽ khởi động sau ${restartAfter}s!`);
        upgradeInfo.processing = false;
      }
    }
  }
};

const startWebsocket = (hostname: string, cb: (ctx: WebSocket) => void) => {
  let ws = new WebSocket(`ws://${hostname}/ws`);
  const commonStore = useCommonStore();
  const nodeStore = useNodeStore();

  cb(ws);

  // event occur when socket is connected
  ws.onopen = function (event) {
    console.log("Kết nối đã được thiết lập");
    commonStore.statusWs = true;
    nodeStore.getNodes(hostname, ws);
    if (idPoolPing) {
      clearInterval(idPoolPing);
    }
    idPoolPing = setInterval(() => {
      console.log("Ping to esp32");
      ws.send("ping");
    }, 3000);
  };

  // event occur when socket recieved message
  ws.onmessage = function (event) {
    const message = event.data;
    console.log("Nhận được dữ liệu từ server:", message);
    try {
      const payload: MessageSocketProps = JSON.parse(message);
      classifyPacket(payload, ws);
    } catch (error) {
      // console.log(error);
      console.log("Dữ liệu không hợp không thể parse sang kiểu JSON");
    }
  };

  // event occur when socket lost connection
  ws.onclose = function (event) {
    console.log("Kết nối đã đóng");
    setTimeout(() => {
      console.log("Đang kết nối lại...");
      startWebsocket(commonStore.ipMeshRoot as string, cb);
    }, 3000);
    commonStore.statusWs = false;
  };

  ws.onerror = function (err) {
    console.log("Đã có lỗi xảy ra: ", err);
    ws.onclose = null;
    ws.close();
    setTimeout(() => {
      console.log("Đang kết nối lại...");
      startWebsocket(hostname, cb);
    }, 3000);
    startWebsocket(hostname, cb);
  };
};

export { connectSocketServer };

export default connectBroker;
