<template>
  <div class="max-h-full overflow-hidden flex flex-col bg-transparent">
    <div class="h-fit">
      <div class="h-12">
        <h1 class="text-2xl pb-4">Điều khiển thiết bị MESH</h1>
      </div>
      <n-text type="primary">
        hostname: esp-skytech.local với IP: {{ ipMeshRoot }}
      </n-text>
      <div class="flex items-center justify-between my-2">
        <div class="flex items-center mb-2">
          <i style="line-height: 0" class="fi fi-rr-vector-alt"></i>
          <h2 class="text-lg ml-2">danh sách các node</h2>
        </div>

        <n-button round type="info" @click="getNodes(ipMeshRoot)">làm mới <i style="line-height: 0"
            class="fi fi-rr-refresh ml-2" :class="refreshing ? 'animate-spin' : ''"></i></n-button>
      </div>
    </div>
    <div class="flex-1 overflow-y-scroll">
      <switch-group @group-controll="(payload) => controllNode(payload, node)" v-for="node in nodes.value"
        :key="node.macAddress" :type="node.deviceType" :id="node.macAddress" :info-switch="(node as NodeMeshProps)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CapacitorHttp } from '@capacitor/core';
import { NButton, NSpace, NText } from "naive-ui";
import Node, { NodeMeshProps, ControllProps } from "@/components/MeshNodeDemo.vue";
import { storeToRefs } from 'pinia'
import { useCommonStore } from '@/store';
import { ref, watch, onMounted, reactive } from "vue";

import SwitchGroup, { GroupControllProps } from '@/components/Widget/Switch/Group.vue';

import { PacketProps, TouchProps, PacketControll, TypeControll, WidgetType, PacketType, MessageSocketProps } from '@/components/Widget';

interface ResponseNode {
  nodes: Array<NodeMeshProps>,
  message: string,
}

const nodes = reactive<{ value: Array<NodeMeshProps> }>({ value: [] });
const refreshing = ref<boolean>(false);

const { ipMeshRoot, wsClient } = storeToRefs(useCommonStore());

const getNodes = async (ip: string | undefined) => {
  if (typeof ip === 'string') {
    refreshing.value = true;
    const response = await CapacitorHttp.get({ url: `http://${ip}/api/v1/mesh/topology` });
    const payload: ResponseNode = response.data;

    if (payload.message === 'FIND_NODE_SUCCESSFULLY') {
      console.log(payload.nodes);
      nodes.value = payload.nodes;
    }
    refreshing.value = false;
  }
}

const controllNode = (payload: GroupControllProps, node: NodeMeshProps) => {
  const packet: PacketProps<PacketControll<TouchProps>> = {
    target: node.macAddress,
    payload: {
      pType: 'controll',
      dType: node.deviceType,
      position: payload.position,
      state: payload.state,
    }
  };

  if (wsClient.value) {
    if (wsClient.value.readyState === wsClient.value.OPEN) {
      console.log(packet);
      wsClient.value.send(JSON.stringify(packet));
    }
  }

}

const onMessage = (event: MessageEvent<any>) => {
  const payload: MessageSocketProps = JSON.parse(typeof event.data === 'string' ? event.data : '');

  if (payload) {
    if (payload.payload.pType === 'controll') {
      nodes.value.forEach((node, index) => {
        if (node.macAddress === payload.target) {
          node.value.forEach((value, jndex) => {
            if (value.position === payload.payload.position) {
              nodes.value[index].value[jndex].state = payload.payload.state as boolean;
              return;
            }
          })
          return;
        }
      })
    }
  }
}

watch(nodes.value, (vl) => {
  console.log(vl);
}, { deep: true })

onMounted(() => {
  if (wsClient.value) {
    if (wsClient.value.readyState === wsClient.value.OPEN) {
      wsClient.value.addEventListener('message', onMessage);
    }
  }
})

getNodes(ipMeshRoot.value);

watch(ipMeshRoot, (ip) => {
  getNodes(ip);
})

</script>

<style scoped></style>
