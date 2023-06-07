<template>
  <div class="h-full flex flex-col overflow-hidden max-h-full">
    <h1 class="capitalize text-2xl font-semibold pb-4 col-span-12">thiết lập kết nối mạng</h1>
    <div :style="{ 'max-height': 'calc(100% - 48px)' }" class="grid grid-cols-12 gap-x-4 flex-1">
      <div class="col-span-6 flex flex-col overflow-hidden max-sm:col-span-12">
        <p class="text-lg font-semibold flex items-center">
          <span>Mạng xung quanh</span>
          <Transition name="fade" mode="out-in">
            <n-spin v-if="reload" class="pl-2" :size="18" />
            <CheckCircleIcon v-else class="ml-2 w-6 h-6 text-green-500" />
          </Transition>
        </p>
        <div :style="{ 'max-height': 'calc(100% - 32px)' }" class="pt-4 flex-1">
          <Transition name="fade" mode="out-in">
            <div class="h-full overflow-y-scroll" v-if="!searchWifi">
              <div v-if="wifis.length > 0" @click="pickWifiChange(wifi)" v-for="(wifi) in wifis " :key="wifi.ssid"
                class="active:bg-slate-200 transition-colors flex flex-col cursor-pointer py-3 box-content relative overflow-hidden">
                <div class="flex flex-1">
                  <div class="flex justify-center items-center pl-3 pr-5">
                    <WifiIcon class="h-6 w-6 text-green-500" />
                  </div>
                  <div class="flex-1 flex flex-col">
                    <p>
                      <span>
                        SSID:
                      </span>
                      <span>
                        {{ wifi.ssid }}
                      </span>
                    </p>
                    <p>
                      <span>
                        MAC:
                      </span>
                      <span>
                        {{ wifi.bssid }}
                      </span>
                    </p>
                  </div>
                  <div
                    :class="`flex flex-col ${pickWifi?.ssid === wifi.ssid ? 'active' : ''} transition-transform max-sm:disable-tranform`">
                    <span class="text-center">
                      {{ wifi.rssiPercent }}%
                    </span>
                    <span>
                      {{ wifi.rssiRaw }} dBm
                    </span>
                  </div>
                  <div
                    :class="`flex items-center ${pickWifi?.ssid === wifi.ssid ? '' : 'translate-x-full'} transition-transform max-sm:hidden`">
                    <ArrowRightCircleIcon class="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <div class="overflow-hidden rounded-sm mt-2">
                  <div :style="{ 'transform': `translateX(-${100 - wifi.rssiPercent}%)` }"
                    :class="`h-[5px] ${wifi.rssiPercent < 50 ? 'bg-orange-600' : 'bg-green-500'} rounded-lg`">
                  </div>
                </div>
              </div>
              <div v-else class="h-full flex flex-col justify-center items-center">
                <SignalSlashIcon class="w-20 h-20 text-slate-500 drop-shadow-md" />
                <span class="pt-2">chưa có sóng WiFi nào được chọn để cài đặt kết nối.</span>
              </div>
            </div>
            <div class="h-full flex justify-center" v-else>
              <div class="flex flex-col items-center justify-center">
                <div class="w-20 h-20 flex justify-center items-end">
                  <n-spin size="medium" />
                </div>
                <p class="pt-2">
                  đang quét mạng xung quanh bạn đợi tý nhé.
                </p>
              </div>
            </div>
          </Transition>
        </div>
      </div>
      <div class="col-span-6 flex flex-col max-sm:hidden">
        <div :class="`flex-1 flex flex-col ${pickWifi ? '' : 'justify-center'}`">
          <Transition name="fade" mode="out-in">
            <div class="h-full" v-if="pickWifi">
              <p class="text-lg font-semibold">Kết nối mạng</p>
              <div class="mt-4">
                <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
                  <n-form-item label="SSID" path="ssid">
                    <n-input disabled v-model:value="formValue.ssid" placeholder="Input SSID" />
                  </n-form-item>
                  <n-form-item label="MAC" path="mac">
                    <n-input disabled v-model:value="formValue.mac" placeholder="Input MAC" />
                  </n-form-item>
                  <n-form-item label="Password" path="password">
                    <n-input v-model:value="formValue.password" placeholder="Input Password" />
                  </n-form-item>
                </n-form>
              </div>
              <n-space justify="end">
                <n-button :loading="loadingSendConfig" icon-placement="right" @click="handleConnectWifi">
                  Kết nối
                </n-button>
              </n-space>
            </div>
            <div v-else class="h-full flex flex-col justify-center items-center max-sm:hidden">
              <SignalSlashIcon class="w-20 h-20 text-slate-500 drop-shadow-md" />
              <span class="pt-2">chưa có sóng WiFi nào được chọn để cài đặt kết nối.</span>
            </div>
          </Transition>
        </div>
      </div>
    </div>
    <n-modal style="margin: 0 2rem;" :show="modalPickWifi" :on-mask-click="cancelModalMobile" transform-origin="center">
      <n-card title="Kết nối WiFi" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <template #header-extra>
          <n-button @click="cancelModalMobile" strong secondary circle>
            <template #icon>
              <XCircleIcon />
            </template>
          </n-button>
        </template>
        <transition name="fade" mode="out-in">
          <div v-if="connectionState === StateConnection.SUCCESS">
            <CheckBadgeIcon class="w-20 h-20 text-green-500 mx-auto" />
            <p class="text-center mt-2">bạn đã thiết lập kết nối thành công.</p>
          </div>
          <div v-else-if="connectionState === StateConnection.FAILURE">
            <XCircleIcon class="w-20 h-20 text-red-500 mx-auto" />
            <p class="text-center mt-2">thiết lập kết nối thất bại.</p>
          </div>
          <n-form v-else ref="formRef" :label-width="80" :model="formValue" :rules="rules">
            <n-form-item label="SSID" path="ssid">
              <n-input disabled v-model:value="formValue.ssid" placeholder="Input SSID" />
            </n-form-item>
            <n-form-item label="MAC" path="mac">
              <n-input disabled v-model:value="formValue.mac" placeholder="Input MAC" />
            </n-form-item>
            <n-form-item label="Password" path="password">
              <n-input v-model:value="formValue.password" placeholder="Input Password" />
            </n-form-item>
          </n-form>
        </transition>
        <template #footer>
          <n-space justify="end">
            <n-button type="tertiary" @click="cancelModalMobile">
              huỷ
            </n-button>
            <n-button v-if="connectionState === StateConnection.UNKNOWN" type="primary" :loading="loadingSendConfig"
              icon-placement="right" @click="handleConnectWifi">
              Kết nối
            </n-button>
            <n-button v-else type="primary" @click="connectionState = StateConnection.UNKNOWN">
              nhập lại
            </n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { WifiIcon, XCircleIcon, ArrowRightCircleIcon, SignalSlashIcon, CheckCircleIcon, CheckBadgeIcon } from '@heroicons/vue/24/solid';
import { NModal, NCard, NButton, NForm, NFormItem, NInput, NSpin, NSpace, type FormRules, type FormItemRule } from 'naive-ui';
import axios from 'axios';

export interface WifiType {
  ssid: string;
  rssiRaw: number;
  rssiPercent: number;
}

export interface WifiInfo {
  ssid: string,
  rssi: number,
  bssid: string,
  channel: number,
  authmode: string,
  'pairwise-cipher': string,
  'group-cipher': string,
}

interface WifiInfoFlat extends WifiInfo {
  rssiPercent: number,
  rssiRaw: number,
}

enum StateConnection {
  SUCCESS,
  FAILURE,
  UNKNOWN,
}

const wifis = ref<Array<WifiInfoFlat> | []>([]);

const pickWifi = ref<WifiInfoFlat | undefined>(undefined);
const searchWifi = ref<boolean>(true);
const reload = ref<boolean>(false);
const loadingSendConfig = ref<boolean>(false);
const modalPickWifi = ref<boolean>(false);
const connectionState = ref<StateConnection>(StateConnection.UNKNOWN);

const formValue = ref({
  ssid: '',
  password: '',
  mac: '',
});

const rules: FormRules = {
  ssid: [{
    required: true,
    message: 'Hãy xin hãy nhập SSID.',
    trigger: ['input', 'blur']
  }],
  mac: [{
    required: true,
    message: 'Hãy xin hãy nhập MAC.',
    trigger: ['input', 'blur']
  }],
  password: [{
    required: true,
    trigger: ['input', 'blur'],
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('Bạn chưa nhập mật khẩu.')
      }
      else if (value.length < 8 || value.length > 32) {
        return new Error('Mật khẩu phải nằm trong khoảng 8 đến 32 ký tự.');
      }
      return true
    },
  }],
}

let intervalId: NodeJS.Timer;

watch(pickWifi, (pickChange) => {
  if (pickChange?.ssid) {
    formValue.value.ssid = pickChange.ssid;
    formValue.value.mac = pickChange.bssid;
  } else {
    formValue.value.ssid = '';
    formValue.value.mac = '';
  }
})

const scanWifiList = async () => {
  if (!searchWifi.value) {
    reload.value = true;
  }
  try {
    const response = await axios.get(`http://${import.meta.env.VITE_SERVER_FETCH}/api/v1/wifi/scan`)
    const wifisPayload = response.data as Array<WifiInfo> | [];
    wifis.value = wifisPayload.map(wifi => ({ ...wifi, rssiRaw: wifi.rssi, rssiPercent: Math.min(Math.max(2 * (wifi.rssi + 100), 0), 100) })).sort((wifiFirst, wifiLast) => wifiLast.rssiPercent - wifiFirst.rssiPercent);
  } catch (error) {
    console.log(error);
  }
  reload.value = false;
}


onMounted(() => {
  const run = async () => {
    searchWifi.value = true;
    await scanWifiList();
    searchWifi.value = false;
    intervalId = setInterval(scanWifiList, import.meta.env.VITE_POOLING_TIME_SCAN * 1 * 1000);
  }
  run();
})

onBeforeUnmount(() => {
  clearInterval(intervalId);
})

const cancelModalMobile = () => {
  if (!loadingSendConfig.value) {
    modalPickWifi.value = false;
  }
}

const pickWifiChange = (wifi: WifiInfoFlat) => {
  pickWifi.value = wifi;
  modalPickWifi.value = true;
  connectionState.value = StateConnection.UNKNOWN;
}

const handleConnectWifi = () => {
  loadingSendConfig.value = true;
  setTimeout(() => {
    loadingSendConfig.value = false;
    connectionState.value = connectionState.value === StateConnection.SUCCESS ? StateConnection.FAILURE : StateConnection.SUCCESS;
  }, 2000);
}
</script>

<style scoped></style>
