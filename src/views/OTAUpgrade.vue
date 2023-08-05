<template>
  <div class="h-full flex flex-col overflow-hidden max-h-full">
    <h1 class="capitalize text-2xl pb-4 col-span-12">Cập nhật thiết bị (OTA)</h1>
    <n-space vertical>
      <n-space vertical>
        <p class="text-lg flex items-center">
          <i style="list-style: none;" class="fi fi-rr-projector text-xl mr-2"></i>
          <span>Thiết bị</span>
        </p>
        <n-select v-model:value="selectDeviceOTA" :options="opionsDevices" placement="bottom" />
      </n-space>
      <n-space vertical>
        <p class="text-lg flex items-center">
          <i style="list-style: none;" class="fi fi-rr-code-compare text-xl mr-2"></i>
          <span>Phiên bản thiết bị</span>
        </p>
        <n-select v-model:value="devicePresentOTA" disabled :options="opionsUpdateVersion" placement="bottom" />
      </n-space>
      <n-space vertical>
        <p class="text-lg flex items-center">
          <i style="list-style: none;" class="fi fi-rr-code-compare text-xl mr-2"></i>
          <span>Phiên bản hệ thống</span>
        </p>
        <n-select v-model:value="selectVersionOTA" :options="opionsUpdateVersion" placement="bottom" />
      </n-space>
      <n-space vertical>
        <p class="text-lg flex items-center">
          <i style="list-style: none;" class="fi fi-rr-truck-loading text-xl mr-2"></i>
          <span>Tiến trình cập nhật</span>
        </p>
        <n-space vertical>
          <n-progress type="line" :border-radius="4" :color="themeVars.successColor"
            :rail-color="changeColor(themeVars.successColor, { alpha: 0.2 })" :percentage="percentUpdated"
            :indicator-text-color="themeVars.successColor" :height="24" :processing="upgrading" />
          <n-space justify="end">
            <n-button :disabled="!upgrading">
              Huỷ
            </n-button>
            <n-button @click="handleUpgradeFirmware" :loading="upgrading" type="success">Cập nhật
            </n-button>
          </n-space>
        </n-space>
      </n-space>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { NSelect, NSpace, NProgress, useThemeVars, NButton, useDialog } from 'naive-ui';
import { changeColor } from 'seemly';
import { ref, onBeforeUnmount, onMounted } from 'vue';
import { useCommonStore } from '@/store'

interface PercentTopic {
  percent: number
}

interface StatusTopic {
  message: string,
  status_code: StatusUpgrade
}

enum StatusUpgrade {
  FAILURE_SSL_READ_DATA,
  FAILURE_INIT_CONNECTION,
  FAILURE_OPEN_CONNECTION,
  FAILURE_RECEIVE_COMPLETE_FILE,
  FAILURE_SET_BOOT_PARTITION,
  FIRMWARE_INVALID,
  FIRMWARE_UPTODATE,
  FIRMWARE_NOT_FIT,
  SAME_FIRMWARE,
  UPGRADE_SUCCESSFULLY,
  UPGRADE_FAILURE,
  BEGIN_FAILURE,
  WRITE_FAILURE,
  END_FAILURE,
}

const opionsDevices = [
  {
    label: "Dimer",
    value: 'dimmer-something',
    // disabled: true,
  },
  {
    label: "Button",
    value: 'button-something',
    disabled: true,
  },
]

const opionsUpdateVersion = [
  {
    label: "0.1.2 (laster)",
    value: '0.1.2',
    // disabled: true,
  },
  {
    label: "0.1.1",
    value: '0.1.1',
    disabled: true,
  },
  {
    label: "0.1.0",
    value: '0.1.0',
    disabled: true,
  },
]

const themeVars = useThemeVars();
const dialog = useDialog();

const commonStore = useCommonStore();

const upgrading = ref<boolean>(false);

const percentUpdated = ref(100);
const selectDeviceOTA = ref(opionsDevices[0].value);
const devicePresentOTA = ref(opionsUpdateVersion[1].value);
const selectVersionOTA = ref(opionsUpdateVersion[0].value);

const idDevice = '7821-84e0-b478';
let idCLearTimeout: NodeJS.Timeout;

const pathProcess = `/${idDevice}/dimmer/ota/process`;
const pathStatus = `/${idDevice}/dimmer/ota/status`;

commonStore.mqttBroker?.on('message', function (topic, message) {
  // message is Buffer
  // console.log({ topic: topic, message: message.toString() })

  if (topic === pathProcess) {
    const payload: PercentTopic = JSON.parse(message.toString() ?? '');
    percentUpdated.value = parseFloat(payload.percent.toFixed(1));
  } else if (topic === pathStatus) {
    const payload: StatusTopic = JSON.parse(message.toString() ?? '');
    console.log(payload);
    if (payload.status_code === StatusUpgrade.UPGRADE_SUCCESSFULLY) {
      dialog.success({
        title: 'Thành công',
        content: `Cập nhật version thiết bị Dimer(${idDevice}) thành công.`,
        positiveText: 'Đã hiểu',
      })
    }
    else if (payload.status_code === StatusUpgrade.END_FAILURE) {
      dialog.error({
        title: 'Lỗi rồi',
        content: `Hiện server đang không hoạt động hoặc không tìm thấy file.`,
        positiveText: 'Đã hiểu',
      })
    } else if (payload.status_code === StatusUpgrade.FIRMWARE_UPTODATE) {
      dialog.warning({
        title: 'Opps',
        content: `Version của thiết bị hiện đã là mới nhất.`,
        positiveText: 'Đã hiểu',
      })
    }
    upgrading.value = false;
  }
})

onMounted(() => {
  commonStore.mqttBroker?.subscribe(pathProcess, () => {
    console.log('sub path = ', pathProcess);
  });
  commonStore.mqttBroker?.subscribe(pathStatus, () => {
    console.log('sub path = ', pathStatus);
  });

})

const handleUpgradeFirmware = () => {

  if (commonStore.mqttBroker?.connected && !upgrading.value) {
    upgrading.value = true;
    // do send mqtt update firmware
    // console.log('call');
    const pathUpgrade = `/${idDevice}/dimmer/ota/upgrade`;
    console.log('publish path = ', pathUpgrade);
    commonStore.mqttBroker.publish(pathUpgrade, JSON.stringify({ restart: true }), { qos: 1 }, (err) => {
      if (err) {
        upgrading.value = false;
      }
    });

  }
}

onBeforeUnmount(() => {
  commonStore.mqttBroker?.unsubscribe(pathProcess, () => {
    console.log('unsucribe => ', pathProcess);
  });
  commonStore.mqttBroker?.unsubscribe(pathStatus, () => {
    console.log('unsucribe => ', pathStatus);
  });
  commonStore.mqttBroker?.removeAllListeners('message');
})

</script>

<style scoped></style>