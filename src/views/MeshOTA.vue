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
        <n-select v-model:value="selectVersionOTA" :options="otaOptions" placement="bottom" />
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
            <n-button @click="cancelUpgrade">
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
import { ref, reactive, onBeforeUnmount, onMounted, watch, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useCommonStore, useNodeStore, useMeshOTAStore } from '@/store';

import notyf from '@/notyf';

import { NodeProps, MessageSocketProps } from '@/components/Widget';

const { ipMeshRoot, wsClient, statusWs } = storeToRefs(useCommonStore());
const { value: nodesStore } = storeToRefs(useNodeStore());
const { downloadInfo, upgradeInfo } = storeToRefs(useMeshOTAStore());
const { startOTA } = useMeshOTAStore();
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
  {
    path: 'touch_4_version_0_0_4.bin',
    typeDevice: 'touch_4',
    version: '0.0.4',
  },
]

const versionsOptions = [
  {
    label: "version 0.0.0",
    value: 'touch_1_version_0_0_0.bin',
    disabled: false,
  },
  {
    label: "version 0.0.0",
    value: 'touch_2_version_0_0_0.bin',
    disabled: false,
  },
  {
    label: "version 0.0.0",
    value: 'touch_3_version_0_0_0.bin',
    disabled: false,
  },
  {
    label: "version 0.0.0",
    value: 'touch_4_version_0_0_0.bin',
    disabled: false,
  },
]

const nodes = reactive<{ value: Array<NodeProps> | [] }>({ value: [] });
const nodesOptions = ref<Array<SelectOption> | []>([]);

const otaOptions = ref(versionsOptions);
const selectDeviceOTA = ref(opionsDevices[4].value);
const selectVersionOTA = ref(null);
const selectNodes = ref<Array<any>>([]);


const upgrade = async () => {
  if (typeof selectVersionOTA.value !== 'string' || selectNodes.value.length === 0) {
    notyf.error('Các tuỳ chọn vẫn chưa đầy đủ!');
    return;
  }
  // console.log(selectNodes.value);
  const state = await startOTA(`http://${ipMeshRoot.value}/api/v1/mesh/ota`, `${hostDownload}/${selectVersionOTA.value}`, selectNodes.value);
  if (state) {
    notyf.success('Đã nhận dữ liệu đang tiến hành tải xuống!');
  }
}

const cancelUpgrade = () => {
  downloadInfo.value.processing = false;
  upgradeInfo.value.processing = false;
  downloadInfo.value.percent = 100;
  upgradeInfo.value.percent = 100;
}

const nodeOptionsChange = () => {
  nodesOptions.value = nodesStore.value.filter(node => node.info.dType === selectDeviceOTA.value).map((node) => ({ label: `${node.target} - ${node.info.appVersion}`, value: node.target }));
  otaOptions.value = versionsOptions.filter(version => version.value.includes(selectDeviceOTA.value));
}

const selectOtionsChange = () => {
  selectNodes.value = nodesOptions.value.map(option => option.value);
}

nodeOptionsChange();
selectOtionsChange();

watch(otaOptions, (options) => {
  if (options.length === 0) {
    selectVersionOTA.value = null;
  }
});

watch([nodesStore, selectDeviceOTA], nodeOptionsChange);

watch(nodesOptions, selectOtionsChange);

watch(wsClient, () => {
  if (wsClient.value?.readyState !== WebSocket.OPEN) {
    notyf.error('Lỗi nâng cấp do bị gián đoạn hoặc mất kết nối!');
    cancelUpgrade();
  }
})

</script>

<style scoped></style>