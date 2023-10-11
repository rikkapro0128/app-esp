<template>
  <div class="h-full flex flex-col overflow-hidden max-h-full">
    <h1 class="capitalize text-2xl pb-4 col-span-12">Mesh nâng cấp (OTA)</h1>
    <n-space vertical>
      <n-space vertical>
        <p class="text-lg flex items-center">
          <i style="line-height: 0;" class="fi fi-rr-projector text-xl mr-2"></i>
          <span>Loại thiết bị</span>
        </p>
        <n-select v-model:value="selectDeviceOTA" :options="opionsDevices" placement="bottom" />
      </n-space>
      <n-space vertical>
        <p class="text-lg flex items-center">
          <i style="line-height: 0;" class="fi fi-rr-laptop-mobile text-xl mr-2"></i>
          <span>Thiết bị hiện có</span>
        </p>
        <n-select v-model:value="selectNodes" :options="nodesOptions" :max-tag-count="1" multiple placement="bottom" />
      </n-space>
      <n-space vertical>
        <p class="text-lg flex items-center">
          <i style="line-height: 0;" class="fi fi-rr-code-compare text-xl mr-2"></i>
          <span>Phiên bản hệ thống</span>
        </p>
        <n-select v-model:value="selectVersionOTA" :options="versionsOptions" placement="bottom" />
      </n-space>
      <n-space vertical>
        <p class="text-lg flex items-center">
          <i style="line-height: 0;" class="fi fi-rr-cloud-download-alt text-xl mr-2"></i>
          <span>Tiến trình tải xuống</span>
        </p>
        <n-progress type="line" :border-radius="4" :color="themeVars.successColor"
          :rail-color="changeColor(themeVars.successColor, { alpha: 0.2 })" :percentage="downloadInfo.percent"
          :indicator-text-color="themeVars.successColor" :height="24" :processing="downloadInfo.processing" />
      </n-space>
      <n-space vertical>
        <p class="text-lg flex items-center">
          <i style="list-style: none;" class="fi fi-rr-refresh text-xl mr-2"></i>
          <span>Tiến trình cập nhật</span>
        </p>
        <n-space vertical>
          <n-progress type="line" :border-radius="4" :color="themeVars.successColor"
            :rail-color="changeColor(themeVars.successColor, { alpha: 0.2 })" :percentage="upgradeInfo.percent"
            :indicator-text-color="themeVars.successColor" :height="24" :processing="upgradeInfo.processing" />
          <n-space justify="end">
            <n-button :disabled="true">
              Huỷ
            </n-button>
            <n-button @click="upgrade" :loading="downloadInfo.processing || upgradeInfo.processing" type="success">Nâng
              cấp
            </n-button>
          </n-space>
        </n-space>
      </n-space>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { CapacitorHttp } from '@capacitor/core';
import { NSelect, NSpace, NProgress, useThemeVars, NButton, useDialog, SelectOption } from 'naive-ui';
import { changeColor } from 'seemly';
import { ref, reactive, onBeforeUnmount, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { useCommonStore } from '@/store';

import notyf from '@/notyf';

import { NodeProps, MessageSocketProps } from '@/components/Widget';

const { ipMeshRoot, wsClient, statusWs } = storeToRefs(useCommonStore());
const themeVars = useThemeVars();

const opionsDevices = [
  {
    label: "Dimer đèn",
    value: 'light_dimmer',
    disabled: true,
  },
  {
    label: "Công tắc 1",
    value: 'touch_1',
    disabled: false,
  },
  {
    label: "Công tắc 2",
    value: 'touch_2',
    disabled: false,
  },
  {
    label: "Công tắc 3",
    value: 'touch_3',
    disabled: false,
  },
  {
    label: "Công tắc 4",
    value: 'touch_4',
    disabled: false,
  },
]

const hostDownload = 'https://ota-upgrade-esp.onrender.com';

const versions = [
  {
    path: 'touch_4_version_0_0_0.bin',
    typeDevice: 'touch_4',
    version: '0.0.0',
  },
  {
    path: 'touch_4_version_0_0_1.bin',
    typeDevice: 'touch_4',
    version: '0.0.1',
  },
  {
    path: 'touch_4_version_0_0_2.bin',
    typeDevice: 'touch_4',
    version: '0.0.2',
  },
  {
    path: 'touch_4_version_0_0_3.bin',
    typeDevice: 'touch_4',
    version: '0.0.3',
  },
]

const versionsOptions = [
  {
    label: "version 0.0.0",
    value: 'touch_4_version_0_0_0.bin',
    disabled: false,
  },
  {
    label: "version 0.0.1",
    value: 'touch_4_version_0_0_1.bin',
    disabled: false,
  },
  {
    label: "version 0.0.2",
    value: 'touch_4_version_0_0_2.bin',
    disabled: false,
  },
  {
    label: "version 0.0.3",
    value: 'touch_4_version_0_0_3.bin',
    disabled: false,
  },
]

const nodes = reactive<{ value: Array<NodeProps> | [] }>({ value: [] });
const nodesOptions = ref<Array<SelectOption> | []>([]);

const selectDeviceOTA = ref(opionsDevices[4].value);
const selectVersionOTA = ref(versionsOptions[versionsOptions.length - 1].value);
const selectNodes = ref<Array<any>>([]);
const downloadInfo = reactive<{
  processing: boolean,
  percent: number,
}>({
  processing: false,
  percent: 100
});
const upgradeInfo = reactive<{
  processing: boolean,
  percent: number,
}>({
  processing: false,
  percent: 100
});

const getNodes = async (ip: string | undefined) => {
  if (typeof ip === 'string') {

    const response = await CapacitorHttp.get({ url: `http://${ip}/api/v1/mesh/topology` });
    const payload: { nodes: Array<NodeProps>, message: string } = response.data;

    if (payload.message === 'FIND_NODE_SUCCESSFULLY') {
      console.log(payload.nodes);
      nodes.value = payload.nodes;
    }
  }
}

const upgrade = async () => {
  if (!downloadInfo.processing) {
    downloadInfo.percent = 0;
    upgradeInfo.percent = 0;
    // const response = await CapacitorHttp.post({ url: , webFetchExtra: { body:  } });
    const response = await fetch(`http://${ipMeshRoot.value}/api/v1/mesh/ota`, {
      body: JSON.stringify({ 'url': `${hostDownload}/${selectVersionOTA.value}` }),
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const payload: { message: string } = await response.json();
    // const payload: { message: string } = response.data;
    if (payload.message === 'PAYLOAD_OTA_RECEIVED') {
      notyf.success('Đã nhận dữ liệu đang tiến hành tải xuống!');
      downloadInfo.processing = true;
      upgradeInfo.processing = true;
    }
  }
}

const onMessage = (event: MessageEvent<any>) => {
  const payload: MessageSocketProps = JSON.parse(typeof event.data === 'string' ? event.data : '');

  console.log(payload);

  if (payload) {
    if (payload.payload.pType === 'ota') {
      if (payload.payload.status === 'downloading') {
        if (payload.payload?.present && payload.payload?.total) {
          downloadInfo.percent = ((payload.payload.present / payload.payload.total * 100).toFixed(1) as unknown as number) * 1;
          if (downloadInfo.percent === 100) {
            downloadInfo.processing = false;
          }
        }
      } else if (payload.payload.status === 'upgrading') {
        if (payload.payload.value) {
          // console.log(upgradeInfo.percent);
          upgradeInfo.percent = payload.payload.value;
          if (payload.payload.value === 100) { upgradeInfo.processing = false; }
        }
      } else if (payload.payload.status === 'done') {
        notyf.success(`Có ${payload.payload.numSuccessed} thiết bị cập nhật xong, sẽ khởi động sau ${payload.payload.restartAfter}s!`);
        upgradeInfo.processing = false;
      }
    }
  }
}

getNodes(ipMeshRoot.value);

watch([nodes, selectDeviceOTA], () => {
  nodesOptions.value = nodes.value.filter(node => node.deviceType === selectDeviceOTA.value).map((node) => ({ label: node.macAddress, value: node.macAddress }));
})

watch(ipMeshRoot, (ip) => {
  getNodes(ip);
})

watch(nodesOptions, (newOptions) => {
  selectNodes.value = newOptions.map(option => option.value);
})

watch(statusWs, (status) => {
  console.log(status);
  if (status) {
    if (wsClient.value) {
      if (wsClient.value.readyState === wsClient.value.OPEN) {
        wsClient.value.addEventListener('message', onMessage);
      }
    }
  }
})

</script>

<style scoped></style>