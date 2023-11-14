<template>
  <n-drawer v-model:show="showDrawer" default-width="100%" height="60%" :placement="'bottom'"
    :on-after-leave="() => { emit('close') }">
    <n-drawer-content title="Tạo ngữ cảnh" closable>
      <n-space vertical>
        <n-space vertical>
          <n-text strong>
            Ràng buộc vào
          </n-text>
          <n-select v-model:value="numTouch" :options="bindOptions" />
        </n-space>
        <n-space vertical>
          <n-text strong>
            Chọn loại công tắc
          </n-text>
          <n-select v-model:value="chooseDType" :options="optionsDType" />
        </n-space>
        <n-space vertical>
          <n-text strong>
            Chọn công tắc
          </n-text>
          <n-tree-select v-model:value="selectPosition" :options="touchOptions" check-strategy="child" />
        </n-space>
        <n-space vertical>
          <n-text strong>
            Chọn trạng thái
          </n-text>
          <n-switch v-model:value="chooseState" />
        </n-space>
        <n-space justify="end">
          <n-button @click="addScene" type="success">
            Thêm đối tượng điều khiển
          </n-button>
        </n-space>
      </n-space>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { NDrawer, NDrawerContent, SelectOption, NSelect, NSpace, NText, TreeSelectOption, NTreeSelect, NSwitch, NButton } from 'naive-ui';

import { storeToRefs } from 'pinia'
import { useNodeStore, useCommonStore } from '@/store'
import { ref, onUnmounted, watch } from 'vue';

import notyf from '@/notyf';

import { MenuProps, WidgetType } from '@/components/Widget';

interface TouchProps {
  label: string,
  key: string | number,
  children: Array<TouchProps | []>
}

const optionsDType = [
  {
    label: 'Công tắc 1 chạm',
    value: 'touch_1'
  },
  {
    label: 'Công tắc 2 chạm',
    value: 'touch_2'
  },
  {
    label: 'Công tắc 3 chạm',
    value: 'touch_3'
  },
  {
    label: 'Công tắc 4 chạm',
    value: 'touch_4'
  },
]

const { value: nodes } = storeToRefs(useNodeStore());
const { wsClient } = storeToRefs(useCommonStore());

const props = defineProps<{
  nodeBase: MenuProps,
  show: boolean,
}>();

const emit = defineEmits<{
  (e: 'close'): void
}>();

const dTypeNumTouch = ref<number>(parseInt(props.nodeBase.dType.slice(-1)));

const chooseState = ref<boolean>(true);
const chooseDType = ref<null | WidgetType>(null);
const showDrawer = ref<boolean>(props.show);
const numTouch = ref(null);
const touchOptions = ref<Array<TreeSelectOption> | []>([]);
const selectPosition = ref<string | null>(null);
const bindOptions = ref<Array<SelectOption> | []>([]);

const addScene = () => {
  if (wsClient.value) {
    if (wsClient.value.readyState === wsClient.value.OPEN) {
      console.log(numTouch.value, chooseDType.value, selectPosition.value, chooseState.value);

      if (!numTouch.value || !selectPosition.value || !chooseDType.value) {
        notyf.error('Vui lòng chọn đầy đủ thông tin');
        return;
      }

      const packet = {
        target: props.nodeBase.id,
        payload: {
          pType: 'scene',
          pAction: 'CREATE',
          mode: 1, // read all scene at num
          position: numTouch.value,
          payload: {
            target: selectPosition.value.split('-')[0],
            payload: {
              pType: "controll",
              pAction: "UPDATE",
              dType: chooseDType.value,
              mode: 0,
              position: parseInt(selectPosition.value.split('-')[1]),
              state: chooseState.value
            }
          }
        }
      };
      wsClient.value.send(JSON.stringify(packet));
    }
  }
}

watch(props, (propsCtx) => {
  dTypeNumTouch.value = parseInt(propsCtx.nodeBase.dType.slice(-1));
  showDrawer.value = propsCtx.show;
})

const filterOptionDType = (num: number) => {
  bindOptions.value = Array(num).fill(0).map((_, index) => ({ label: `Chạm ${index + 1}`, value: index + 1 }));
}

filterOptionDType(dTypeNumTouch.value);

watch(dTypeNumTouch, filterOptionDType);

watch(chooseDType, (dType) => {
  if (dType) {
    touchOptions.value = nodes.value.filter((node) => node.info.dType === dType).map((node) => ({
      label: `${node.target}`,
      key: `${node.target}`,
      children: node.info.dType.includes('touch') ? node.value.map(touch => ({
        label: `Chạm ${touch.position}`,
        key: `${node.target}-${touch.position}`,
      })) : [],
    }));
    console.log(touchOptions.value);
  }
})

</script>