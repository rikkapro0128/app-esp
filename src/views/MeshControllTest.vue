<template>
  <div>
    <div class="relative h-12">
      <h1 class="text-2xl pb-4 fixed">Điều khiển thiết bị MESH</h1>
    </div>
    <n-text type="primary">
      hostname: esp-skytech.local với IP: {{ ipMeshRoot }}
    </n-text>
    <div class="flex items-center justify-between my-2">
      <div class="flex items-center mb-2">
        <i style="line-height: 0" class="fi fi-rr-vector-alt"></i>
        <h2 class="text-lg ml-2">danh sách các node</h2>
      </div>

      <n-button type="info" @click="getNodes(ipMeshRoot)">tải lại</n-button>
    </div>
    <div class="">
      <!-- <Node :class="index ? 'mt-2' : ''" v-for="(node, index) in nodes" :key="node.macAddress" :node-value="node"
        @controll="controllNode" /> -->
      <switch-group @group-controll="(payload) => controllNode(payload, node)" v-for="node in nodes"
        :key="node.macAddress" :type="node.deviceType" :id="node.macAddress" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CapacitorHttp } from '@capacitor/core';
import { NButton, NSpace, NText } from "naive-ui";
import Node, { NodeMeshProps, ControllProps } from "@/components/MeshNodeDemo.vue";
import { storeToRefs } from 'pinia'
import { useCommonStore } from '@/store';
import { ref, watch } from "vue";

import SwitchGroup, { GroupControllProps } from '@/components/Widget/Switch/Group.vue';

import { PacketProps, Touch2Props, PacketControll, TypeControll } from '@/components/Widget';

interface ResponseNode {
  nodes: Array<NodeMeshProps>,
  message: string,
}

const nodes = ref<Array<NodeMeshProps>>([]);

const { ipMeshRoot, wsClient } = storeToRefs(useCommonStore());

const getNodes = async (ip: string | undefined) => {
  if (typeof ip === 'string') {
    const response = await CapacitorHttp.get({ url: `http://${ip}/api/v1/mesh/topology` });
    const payload: ResponseNode = response.data;

    if (payload.message === 'FIND_NODE_SUCCESSFULLY') {
      console.log(payload.nodes);
      nodes.value = payload.nodes;
    }
  }
}

const controllNode = (payload: GroupControllProps, node: NodeMeshProps) => {
  const packet: PacketProps<PacketControll<Touch2Props>> = {
    target: node.macAddress,
    payload: {
      pType: 'controll',
      dType: 'touch_2',
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

getNodes(ipMeshRoot.value);

watch(ipMeshRoot, (ip) => {
  getNodes(ip);
})

</script>

<style scoped></style>
