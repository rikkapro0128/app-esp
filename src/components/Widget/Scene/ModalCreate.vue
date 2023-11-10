<template>
  <n-drawer v-model:show="showDrawer" default-width="100%" :placement="'right'" :on-after-leave="() => { emit('close') }">
    <n-drawer-content title="Tạo ngữ cảnh" closable>
      <n-space vertical>
        <n-text strong>
          Chọn công tắc
        </n-text>
        <n-select v-model:value="selectPosition" :options="options" />
      </n-space>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { NDrawer, NDrawerContent, SelectOption, NSelect, NSpace, NText } from 'naive-ui';

import { storeToRefs } from 'pinia'
import { useNodeStore } from '@/store'
import { ref, onUnmounted, watch } from 'vue';

import notyf from '@/notyf';

import { MenuProps } from '@/components/Widget';

const { value } = storeToRefs(useNodeStore());

const props = defineProps<{
  nodeBase: MenuProps,
  show: boolean,
}>();

const emit = defineEmits<{
  (e: 'close'): void
}>();

const showDrawer = ref<boolean>(props.show);
const numTouch = ref<number>(0);
const selectPosition = ref<number | null>(null);
const options = ref<Array<SelectOption> | []>([]);

watch(props, (propsCtx) => {
  numTouch.value = parseInt(propsCtx.nodeBase.dType.slice(-1));
  showDrawer.value = propsCtx.show;
})

watch(numTouch, (num) => {
  options.value = Array(num).fill(0).map((_, index) => ({ label: `Chạm ${index + 1}`, value: index + 1 }));
  console.log(options.value);
})

</script>