<template>
  <n-list>
    <n-list-item>
      <n-thing
        title="Tên thiết bị"
        title-extra="#tên của thiết bị mà bạn muốn đặt"
      />
      <n-input-group>
        <n-input
          ref="inputName"
          v-model:value="modifyInfo.name"
          type="text"
          placeholder="nhập gì đó đi..."
          :disabled="blockInput.name"
        />
        <n-button
          @click="() => handleUpdate('name', $refs.inputName as HTMLInputElement)"
          type="primary"
        >
          {{ blockInput.name ? "Sửa" : "Cập nhật" }}
        </n-button>
      </n-input-group>
    </n-list-item>
    <n-list-item>
      <n-thing
        title="Thiết bị MAC"
        title-extra="#địa chỉ vật lí thiết bị"
        :description="nodeBase.id"
      />
    </n-list-item>
    <n-list-item>
      <n-thing
        title="Phiên bản"
        title-extra="#phiên bản đang chạy trên thiết bị"
        :description="node?.info.appVersion"
      />
    </n-list-item>
    <n-list-item>
      <n-thing
        title="Thời gian"
        title-extra="#thời gian complie của phiên bản"
        :description="`${node?.info.compileTime ?? 'chưa xác định'} - ${
          node?.info.compileDate ?? 'chưa xác định'
        }`"
      />
    </n-list-item>
    <n-list-item>
      <n-thing
        title="Loại thiết bị"
        title-extra="#định danh thiết bị"
        :description="translateType[nodeBase.dType] ?? 'Không xác định'"
      />
    </n-list-item>
    <n-list-item>
      <n-thing
        title="Quản lý MAC"
        title-extra="#đia chỉ mac quản lí node này"
        :description="node?.info.parentBssi"
      />
    </n-list-item>
    <n-list-item>
      <n-thing
        title="Tín hiệu"
        title-extra="#chất lượng tín hiệu của node quản lí"
        :description="`${rssiToPercent(node?.info.parentRssi ?? 0)}%`"
      />
    </n-list-item>
    <n-list-item>
      <n-thing
        title="Ram trống"
        title-extra="#lượng ram còn trống của thiết bị"
        :description="prettyBytes(node?.info.ramUse ?? 0)"
      />
    </n-list-item>
    <n-list-item
      v-if="props.nodeBase.dType.includes('touch') && modifyInfo.touch"
    >
      <n-thing title="Tên công tắc" title-extra="#tên của các công tắc chạm" />
      <n-space vertical>
        <n-input-group
          v-for="(touch, index) in Object.entries(modifyInfo.touch)"
          :key="index"
        >
          <n-button disabled type="tertiary">{{
            `Công tắc ${touch[0]}`
          }}</n-button>
          <n-input
            ref="inputName"
            v-model:value="touch[1].name"
            type="text"
            placeholder="nhập gì đó đi..."
            :disabled="touch[1].block"
          />
          <n-button
            @click="() => handleUpdate('touch', ($el as HTMLInputElement), { position: touch[0] })"
            type="primary"
          >
            {{ touch[1].block ? "Sửa" : "Cập nhật" }}
          </n-button>
        </n-input-group>
      </n-space>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import {
  NSpace,
  NListItem,
  NThing,
  NList,
  NInputGroup,
  NInput,
  NButton,
} from "naive-ui";
import prettyBytes from "pretty-bytes";

import { translateType } from "@/translate";
import { rssiToPercent } from "@/helper";
import { MenuProps } from "@/components/Widget";

import { storeToRefs } from "pinia";
import { useNodeStore, FullInfoNodeProps } from "@/store";

import { ref, reactive, watch } from "vue";

type UpdateType = "name" | "touch";

const { updateNameNode, updateNameTouch } = useNodeStore();
const { value: nodes } = storeToRefs(useNodeStore());

const node = ref<FullInfoNodeProps | undefined>();

const props = defineProps<{
  nodeBase: MenuProps;
}>();

const modifyInfo = reactive<{
  name: string;
  touch?: {
    [key: number | string]: {
      name: string;
      block: boolean;
    };
  };
}>({
  name: "",
});

const blockInput = reactive({
  name: true,
});

const handleUpdate = (
  type: UpdateType,
  ele: HTMLInputElement,
  opt?: { position?: string }
) => {
  if (type === "name") {
    if (!blockInput.name) {
      // TODO: update name
      // console.log(ele.value);
      updateNameNode(props.nodeBase.id, ele.value);
    }
    blockInput.name = !blockInput.name;
  } else if (type === "touch") {
    if (opt?.position) {
      if(!modifyInfo.touch) { return; }
      updateNameTouch(props.nodeBase.id, parseInt(opt.position), modifyInfo.touch[opt.position].name);
      modifyInfo.touch[opt.position].block = !modifyInfo.touch[opt.position].block;
    }
  }
};

if (props.nodeBase.dType.includes("touch")) {
  const numTouch = parseInt(props.nodeBase.dType.slice(-1));
  modifyInfo["touch"] = {};
  Array(numTouch)
    .fill(0)
    .forEach((_, i) => {
      if (!modifyInfo["touch"]) {
        return;
      }
      modifyInfo["touch"][i + 1] = {
        name: "chưa có tên",
        block: true,
      };
    });
}

if (props.nodeBase.id) {
  node.value = nodes.value.find((node) => node.target === props.nodeBase.id);
  modifyInfo.name = node.value?.info.name ?? "chưa có tên";
  if (node.value?.info.dType.includes("touch")) {
    if (node.value?.value) {
      node.value.value.forEach((touch) => {
        if (!modifyInfo.touch) {
          return;
        }
        modifyInfo.touch[touch.position].name = touch.name as string;
      });
    }
  }
}
</script>
