<template>
  <div class="h-full overflow-hidden flex flex-col bg-transparent">
    <div class="h-fit">
      <div class="h-12">
        <h1 class="text-2xl pb-4">Điều khiển thiết bị MESH</h1>
      </div>
      <n-text class="flex items-center justify-between" type="primary">
        <span>{ esp-skytech.local</span>
        <i class="fi fi-rr-link text-xs mx-1"></i>
        <span>{{ ipMeshRoot }} }</span>
        <n-popover
          :show="cmdBtnShow"
          :on-update:show="cmdPopoverSetting"
          style="padding: 0"
          trigger="click"
          placement="bottom-end"
        >
          <template #trigger>
            <n-button round icon-placement="right" size="small">
              <template #icon>
                <i
                  style="line-height: 0"
                  class="fi fi-rr-settings font-bold transition-transform"
                  :class="cmdBtnShow ? 'rotate-90' : ''"
                ></i>
              </template>
              cài đặt
            </n-button>
          </template>
          <n-button-group size="large" vertical>
            <n-button
              :key="option.key"
              v-for="option in optionsDropdownCmd"
              @click="handleActiveCmd(option.key as CmdCode)"
            >
              <i style="line-height: 0" class="mr-2" :class="option.icon"></i>
              <span>{{ option.label }}</span>
            </n-button>
          </n-button-group>
        </n-popover>
      </n-text>
      <div class="flex items-center justify-between my-2">
        <div class="flex items-center mb-2">
          <i style="line-height: 0" class="fi fi-rr-vector-alt"></i>
          <h2 class="text-lg ml-2">Danh sách {{ value.length }} node</h2>
        </div>

        <n-button round type="info" @click="reloadNodes"
          >làm mới
          <i
            style="line-height: 0"
            class="fi fi-rr-refresh ml-2"
            :class="refreshing ? 'animate-spin' : ''"
          ></i
        ></n-button>
      </div>
    </div>
    <div class="flex-1 overflow-y-scroll mt-2">
      <div v-if="value.length > 0">
        <switch-group
          @group-controll="(payload) => controllNode(payload, node)"
          v-for="node in value"
          :info-switch="node"
        />
      </div>
      <div v-else class="h-full flex justify-center items-center">
        <n-space vertical align="center">
          <n-spin size="medium" />
          <p class="animate-pulse">đang tải</p>
        </n-space>
      </div>
    </div>
    <n-drawer
      v-model:show="drawer.schedule"
      default-height="70%"
      placement="bottom"
    >
      <n-drawer-content>
        <template #header>
          <div class="flex items-center">
            <i style="line-height: 0" class="fi fi-rr-calendar-clock mr-2"></i>
            <span>Lập lịch</span>
          </div>
        </template>
        <div class="flex flex-col h-full">
          <n-space justify="end">
            <n-button @click="handleActiveModalSchedule" round type="tertiary">
              <template #icon>
                <i style="line-height: 0" class="fi fi-rr-calendar-plus"></i>
              </template>
              <span>tạo mới</span>
            </n-button>
          </n-space>
          <load-schedule
            :id-device="(pickSelectMenuItemByNode?.id as string)"
            :load-from="'ws'"
            :d-type="pickSelectMenuItemByNode?.dType"
          />
        </div>
      </n-drawer-content>
    </n-drawer>

    <n-drawer
      v-model:show="drawer.countdown"
      default-height="70%"
      placement="bottom"
    >
      <n-drawer-content>
        <template #header>
          <div class="flex items-center">
            <i style="line-height: 0" class="fi fi-rr-calendar-clock mr-2"></i>
            <span>Hẹn giờ</span>
          </div>
        </template>
        <div class="flex flex-col h-full">
          <n-space justify="end">
            <n-button @click="handleActiveModalCountDown" round type="tertiary">
              <template #icon>
                <i style="line-height: 0" class="fi fi-rr-calendar-plus"></i>
              </template>
              <span>tạo mới</span>
            </n-button>
          </n-space>
          <load-count-down
            :id-device="(pickSelectMenuItemByNode?.id as string)"
            :load-from="'ws'"
            :d-type="pickSelectMenuItemByNode?.dType"
          />
        </div>
      </n-drawer-content>
    </n-drawer>

    <n-drawer
      v-model:show="drawer.scene"
      default-height="100%"
      placement="bottom"
    >
      <n-drawer-content closable>
        <template #header>
          <div class="flex items-center">
            <i style="line-height: 0" class="fi fi-rr-calendar-clock mr-2"></i>
            <span>Ngữ cảnh</span>
          </div>
        </template>
        <div class="flex flex-col h-full">
          <n-space justify="end">
            <n-button
              @click="handleActiveModalCreateScene"
              round
              type="tertiary"
            >
              <template #icon>
                <i style="line-height: 0" class="fi fi-rr-calendar-plus"></i>
              </template>
              <span>tạo mới</span>
            </n-button>
          </n-space>
          <load-scene
            :target="(pickSelectMenuItemByNode?.id as string)"
            :d-type="(pickSelectMenuItemByNode?.dType as WidgetType)"
          />
        </div>
      </n-drawer-content>
    </n-drawer>

    <n-drawer
      v-model:show="drawer.automation"
      default-height="100%"
      placement="bottom"
    >
      <n-drawer-content closable>
        <template #header>
          <div class="flex items-center">
            <i style="line-height: 0" class="fi fi-rr-calendar-clock mr-2"></i>
            <span>Tự động</span>
          </div>
        </template>
        <div class="flex flex-col h-full">
          <n-space justify="end">
            <n-button
              @click="handleActiveModalCreateAutomation"
              round
              type="tertiary"
            >
              <template #icon>
                <i style="line-height: 0" class="fi fi-rr-calendar-plus"></i>
              </template>
              <span>tạo mới</span>
            </n-button>
          </n-space>
          <load-autonmation
            :target="(pickSelectMenuItemByNode?.id as string)"
            :d-type="(pickSelectMenuItemByNode?.dType as WidgetType)"
          />
        </div>
      </n-drawer-content>
    </n-drawer>

    <n-drawer
      v-model:show="drawer.info"
      default-height="100%"
      placement="bottom"
    >
      <n-drawer-content closable>
        <template #header>
          <div class="flex items-center">
            <i style="line-height: 0" class="fi fi-rr-comment-info mr-2"></i>
            <span>Thông tin</span>
          </div>
        </template>
        <div class="flex flex-col h-full">
          <load-info :node-base="pickSelectMenuItemByNode" />
        </div>
      </n-drawer-content>
    </n-drawer>

    <modal-schedule
      :id-device="(pickSelectMenuItemByNode?.id as string)"
      :show="modalSchedule"
      :load-from="'ws'"
      :d-type="(pickSelectMenuItemByNode?.dType as WidgetType)"
      v-on:close="handleCloseModalSchedule"
    />

    <modal-create
      :id-device="(pickSelectMenuItemByNode?.id as string)"
      :show="modalCountDown"
      :load-from="'ws'"
      :d-type="(pickSelectMenuItemByNode?.dType as WidgetType)"
      v-on:close="handleCloseModalCountDown"
    />

    <modal-create-scene
      :node-base="pickSelectMenuItemByNode"
      :show="modalScene"
      v-on:close="handleCloseModalScene"
    />

    <modal-create-automation
      :node-base="pickSelectMenuItemByNode"
      :show="modalAutomation"
      v-on:close="handleCloseModalAutomation"
    />
  </div>
</template>

<script setup lang="ts">
import { CapacitorHttp } from "@capacitor/core";
import {
  NButton,
  NText,
  NDrawer,
  NDrawerContent,
  NSpace,
  NPopover,
  NButtonGroup,
  NSpin,
} from "naive-ui";
import { storeToRefs } from "pinia";
import {
  useCommonStore,
  useNodeStore,
  FullInfoNodeProps,
  CmdCode,
} from "@/store";
import {
  ref,
  watch,
  onMounted,
  onUnmounted,
  reactive,
  getCurrentInstance,
} from "vue";
import { Emitter, EventType, Handler } from "mitt";

import SwitchGroup, {
  GroupControllProps,
} from "@/components/Widget/Switch/Group.vue";

import LoadSchedule from "@/components/Widget/Dimmer/Schedule/LoadItem.vue";
import LoadCountDown from "@/components/Widget/CountDown/LoadItem.vue";
import LoadScene from "@/components/Widget/Scene/LoadScene.vue";
import LoadAutonmation from "@/components/Widget/Automation/LoadAutonmation.vue";
import LoadInfo from "@/components/Widget/Info/LoadInfo.vue";

import ModalSchedule from "@/components/Widget/Dimmer/Schedule/Modal.vue";
import ModalCreate from "@/components/Widget/CountDown/ModalCreate.vue";
import ModalCreateScene from "@/components/Widget/Scene/ModalCreate.vue";
import ModalCreateAutomation from "@/components/Widget/Automation/ModalCreate.vue";

import {
  PacketProps,
  TouchProps,
  PacketControll,
  MessageSocketProps,
  MenuProps,
  WidgetType,
} from "@/components/Widget";

const optionsDropdownCmd = [
  {
    label: "Bật hết thiết bị",
    key: "on-all",
    icon: "fi fi-rr-light-switch-on",
  },
  {
    label: "Tắt hết thiết bị",
    key: "off-all",
    icon: "fi-rr-light-switch-off",
  },
];

const app = getCurrentInstance();
const emitter = app?.appContext.config.globalProperties.emitter as Emitter<
  Record<EventType, MenuProps>
>;

const cmdBtnShow = ref<boolean>(false);
const refreshing = ref<boolean>(false);
const drawer = reactive({
  schedule: false,
  countdown: false,
  scene: false,
  info: false,
  automation: false,
});
const modalSchedule = ref<boolean>(false);
const modalCountDown = ref<boolean>(false);
const modalScene = ref<boolean>(false);
const modalAutomation = ref<boolean>(false);
let pickSelectMenuItemByNode = reactive<MenuProps>({
  dType: "touch_4",
  id: "",
  select: "schedule",
});

const { ipMeshRoot, wsClient } = storeToRefs(useCommonStore());
const { value } = storeToRefs(useNodeStore());
const { getNodes, controlMutiNodeByCMD } = useNodeStore();

const controllNode = (payload: GroupControllProps, node: FullInfoNodeProps) => {
  const packet: PacketProps<PacketControll<TouchProps>> = {
    target: node.target,
    payload: {
      pType: "controll",
      pAction: "UPDATE",
      mode: 0,
      position: payload.position,
      state: payload.state,
    },
  };

  if (wsClient.value) {
    if (wsClient.value.readyState === WebSocket.OPEN) {
      // console.log(packet);
      wsClient.value.send(JSON.stringify(packet));
    }
  }
};

const reloadNodes = () => {
  if (typeof ipMeshRoot.value === "string" && wsClient.value) {
    getNodes(ipMeshRoot.value, wsClient.value);
  }
};

const handleActiveCmd = (cmd: CmdCode) => {
  // console.log(cmd);
  controlMutiNodeByCMD(cmd);
  cmdBtnShow.value = false;
};

const cmdPopoverSetting = (value: boolean) => {
  cmdBtnShow.value = value;
};

const openMenu = (e: MenuProps) => {
  // console.log(e.select);

  if (e.select === "schedule") {
    drawer.schedule = true;
  } else if (e.select === "countdown") {
    drawer.countdown = true;
  } else if (e.select === "scene") {
    drawer.scene = true;
  } else if (e.select === "info_node") {
    drawer.info = true;
  } else if (e.select === "automation") {
    drawer.automation = true;
  }
  pickSelectMenuItemByNode = e;
};

const handleActiveModalSchedule = () => {
  modalSchedule.value = true;
};

const handleActiveModalCountDown = () => {
  modalCountDown.value = true;
};

const handleActiveModalCreateScene = () => {
  modalScene.value = true;
};

const handleActiveModalCreateAutomation = () => {
  modalAutomation.value = true;
};

const handleCloseModalSchedule = () => {
  modalSchedule.value = false;
};

const handleCloseModalCountDown = () => {
  modalCountDown.value = false;
  // drawerCountDown.value = false;
};

const handleCloseModalScene = () => {
  modalScene.value = false;
};

const handleCloseModalAutomation = () => {
  modalAutomation.value = false;
};

if (emitter) {
  emitter.on("contextmenu", openMenu);
}
</script>

<style scoped></style>
