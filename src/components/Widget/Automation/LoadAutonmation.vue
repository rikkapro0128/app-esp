<template>
  <div>
    <n-collapse>
      <n-collapse-item
        v-for="num in numTouch"
        :title="`Công tắc ${num} - điều khiển => bật ${
          autos[num].on.length || 0
        } - tắt ${autos[num].off.length || 0}`"
        :key="num"
        :name="num"
      >
        <n-collapse>
          <n-collapse-item
            v-for="ctx in contextStateAutoMation"
            :key="ctx.key"
            :title="`Trạng thái ${ctx.label}`"
            :name="ctx.key"
          >
            <n-space
              v-if="autos[num as number][ctx.key as AutoState].length > 0"
            >
              <n-card
                v-for="auto in autos[num as number][ctx.key as AutoState]"
                :key="auto.id"
                :title="`Địa chỉ: ${auto.target}`"
                size="small"
              >
                <template #header-extra>
                  <div class="ml-2">
                    <n-button
                      @click="removeAutomation(auto, num, ctx.value)"
                      type="error"
                      round
                    >
                      Xoá
                    </n-button>
                  </div>
                </template>
                <span> <b>Loại thiết bị:</b> {{ auto.payload.dType }}</span>
                <div>
                  <p>
                    <b>Chế độ điều khiển:</b>
                    {{ auto.payload.mode === 1 ? "tất cả" : "chỉ một" }}
                  </p>
                  <p v-if="auto.payload.mode === 1">
                    <b>Vị trí:</b> chạm {{ auto.payload.position }}
                  </p>
                </div>
                <span
                  ><b>Trạng thái:</b>
                  {{ auto.payload.state ? "bật" : "tắt" }}</span
                >
              </n-card>
            </n-space>
            <n-empty v-else description="chưa có ngữ cảnh nào được tạo.">
              <template #icon>
                <i style="line-height: 0" class="fi fi-rr-calendar-xmark"></i>
              </template>
            </n-empty>
          </n-collapse-item>
        </n-collapse>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<script setup lang="ts">
import {
  NEmpty,
  NSpin,
  NSpace,
  NButton,
  NEllipsis,
  NCollapse,
  NCollapseItem,
  NCard,
} from "naive-ui";
import { onMounted, onUnmounted, reactive, ref } from "vue";

import {
  MessageSocketProps,
  PacketProps,
  PacketControll,
  TouchProps,
  WidgetType,
  CountdownProps,
  LoadType,
} from "@/components/Widget";

import notyf from "@/notyf";
import { storeToRefs } from "pinia";
import { useCommonStore } from "@/store";

import { sleep } from "@/helper";
import { type } from "os";

type AutoState = "on" | "off";

interface AutoProps {
  [key: number]: {
    [key in AutoState]: Array<any>;
  };
}

const contextStateAutoMation = [
  {
    label: "mở",
    key: "on",
    value: true,
  },
  {
    label: "đóng",
    key: "off",
    value: false,
  },
];

const { ipMeshRoot, wsClient } = storeToRefs(useCommonStore());

const props = defineProps<{
  target: string;
  dType: WidgetType;
}>();

const numTouch = ref<number>(parseInt(props.dType.slice(-1)));
let autos = reactive<AutoProps>({});

Array(numTouch.value)
  .fill(0)
  .forEach((_, i) => {
    autos[i + 1] = { on: [], off: [] };
  });

const removeAutomation = (auto: any, position: number, state: boolean) => {
  // console.log(position);
  if (wsClient.value) {
    if (wsClient.value.readyState === wsClient.value.OPEN) {
      const packet = {
        target: props.target,
        payload: {
          pType: "automation",
          pAction: "DELETE",
          mode: 1,
          state: state ? 0 : 1,
          position: position,
          id: auto.id,
        },
      };
      wsClient.value.send(JSON.stringify(packet));
    }
  }
};

const onMessage = (event: MessageEvent<any>) => {
  const { target, payload } = JSON.parse(
    typeof event.data === "string" ? event.data : ""
  );

  if (target !== props.target) {
    // check device id of payload
    return;
  }

  // console.log(payload);

  if (payload) {
    const {
      payload: automation,
      message,
      position,
      pType,
      id,
      state,
    } = payload;

    if (pType !== "automation") {
      return;
    }

    // console.log(automation);

    if (message === "AUTOMATION_CREATE_OK") {
      notyf.success(
        `Thêm automation vào chạm ${position} với trạng thái ${
          state ? "tắt" : "bật"
        } thành công!`
      );
    }

    if (message === "AUTOMATION_CREATE_FAILURE") {
      notyf.error(`Thêm automation vào chạm ${position} thất bại!`);
    } else if (message === "AUTOMATION_DELETE_OK") {
      notyf.success(`Xoá automation thành công!`);
      if (position > 0) {
        autos[position][(state as boolean) ? "off" : "on"] = autos[position][
          (state as boolean) ? "off" : "on"
        ].filter((auto: any) => auto.id !== id);
      }
    } else if (
      message === "AUTOMATION_READ_OK" ||
      message === "AUTOMATION_CREATE_OK"
    ) {
      if (position <= numTouch.value && position > 0 && automation) {
        autos[position][(state as boolean) ? "off" : "on"].push(automation);
      }
      console.log(automation);
    }
  }
};

onMounted(() => {
  if (wsClient.value) {
    if (wsClient.value.readyState === wsClient.value.OPEN) {
      wsClient.value.addEventListener("message", onMessage);
      if (props.dType.includes("touch")) {
        (async () => {
          const nums = Array(parseInt(props.dType.slice(-1)))
            .fill(0)
            .map((_, i) => i + 1);
          // console.log(num);
          const packet = {
            target: props.target,
            payload: {
              pType: "automation",
              pAction: "READ",
              mode: 0, // read all scene at num
              state: 1, // get all automation with state off
              position: 1,
            },
          };
          packet.payload.state = 1; // get all automation with state off
          for await (const num of nums) {
            packet.payload.position = num;
            (wsClient.value as WebSocket).send(JSON.stringify(packet));
            await sleep(100);
          }
          packet.payload.state = 0; // get all automation with state on
          for await (const num of nums) {
            packet.payload.position = num;
            (wsClient.value as WebSocket).send(JSON.stringify(packet));
            await sleep(100);
          }
        })();
      }
    }
  }
});

onUnmounted(() => {
  if (wsClient.value) {
    wsClient.value.removeEventListener("message", onMessage);
  }
});
</script>
