import { defineStore } from "pinia";

import * as mqtt from "mqtt/dist/mqtt.min";

import {
  WidgetType,
  PacketAction,
  PacketType,
  MessageRequireProps,
  TouchProps,
  ResponseNode,
  MessageSocketProps,
} from "@/components/Widget";

import { CapacitorHttp } from "@capacitor/core";

interface StateProps {
  mqttBroker: mqtt.Client | undefined;
  wsClient: WebSocket | undefined;
  ipMeshRoot: string | undefined;
  statusWs: boolean;
}

export interface NodeInfoProps {
  dType: WidgetType;
  nodeNum: string;
  parentRssi: number;
  parentBssi: string;
  layer: number;
  ramUse: number;
  appVersion: string;
  projectName: string;
  idfVersion: string;
  compileTime: string;
  compileDate: string;
}

export type CmdCode = "on-all" | "off-all";

export interface MessageReceiveProps
  extends MessageRequireProps,
    NodeInfoProps {}

export interface FullInfoNodeProps {
  target: string;
  info: NodeInfoProps;
  value: Array<TouchProps>;
  status: boolean;
}

interface NodeProps {
  value: Array<FullInfoNodeProps> | [];
}

interface ProgressBarProps {
  processing: boolean;
  percent: number;
}

interface MeshProps {
  downloadInfo: ProgressBarProps;
  upgradeInfo: ProgressBarProps;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useCommonStore = defineStore("common", {
  state: (): StateProps => ({
    mqttBroker: undefined,
    wsClient: undefined,
    ipMeshRoot: undefined,
    statusWs: false,
  }),
  getters: {},
  actions: {},
});

export const useNodeStore = defineStore("node", {
  state: (): NodeProps => ({
    value: [],
  }),
  getters: {},
  actions: {
    async getNodes(ip: string | undefined, ctx: WebSocket) {
      if (typeof ip === "string") {
        this.value = [];
        const response = await CapacitorHttp.get({
          url: `http://${ip}/api/v1/mesh/topology`,
        });
        const payload: ResponseNode = response.data;

        if (payload.message === "FIND_NODE_SUCCESSFULLY") {
          // console.log(payload.nodes);
          payload.nodes.forEach((node) => {
            ctx.send(
              JSON.stringify({
                target: node,
                payload: {
                  pType: "info_node",
                  pAction: "READ",
                },
              } as MessageSocketProps)
            );
          });
        }
      }
    },
    async controlMutiNodeByCMD(cmd: CmdCode) {
      const { wsClient } = useCommonStore();
      if (wsClient?.readyState === WebSocket.OPEN) {
        const { value } = useNodeStore();
        for await (const iterator of value) {
          // console.log(iterator);
          wsClient.send(
            JSON.stringify({
              target: iterator.target,
              payload: {
                pType: "controll",
                pAction: "UPDATE",
                mode: 1,
                state: cmd === "on-all" ? true : false,
              },
            } as MessageSocketProps)
          );
          await sleep(100);
        }
      }
    },
  },
});

export const useMeshOTAStore = defineStore("meshOTA", {
  state: (): MeshProps => ({
    downloadInfo: {
      percent: 100,
      processing: false,
    },
    upgradeInfo: {
      percent: 100,
      processing: false,
    },
  }),
  getters: {},
  actions: {
    async startOTA(host: string, url: string, nodes: Array<string>) {
      if (!this.downloadInfo.processing) {
        this.downloadInfo.percent = 0;
        this.upgradeInfo.percent = 0;
        try {
          const response = await fetch(host, {
            body: JSON.stringify({ url, targets: nodes }),
            method: "POST",
            redirect: "follow",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const payload: { message: string } = await response.json();
          // const payload: { message: string } = response.data;
          if (payload.message === "PAYLOAD_OTA_RECEIVED") {
            this.downloadInfo.processing = true;
            this.upgradeInfo.processing = true;
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      }
      return false;
    },
  },
});
