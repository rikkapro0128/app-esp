<template>
  <n-space vertical>
    <n-divider style="margin: 0.4rem 0;" title-placement="left">
      <span class="font-bold text-lg">Thay đổi</span>
    </n-divider>
    <n-space vertical>
      <span class="font-bold">Loại điều khiển</span>
      <n-switch :value="payload.mode ? true : false" @update-value="(val) => val ? payload.mode = 1 : payload.mode = 0">
        <template #checked>
          tất cả
        </template>
        <template #unchecked>
          đơn
        </template>
      </n-switch>
      <n-space vertical v-if="props.dType?.includes('touch')">
        <n-space vertical>
          <span class="font-bold">Vị trí</span>
          <n-select :disabled="payload.mode === 1 ? true : false" v-model:value="selectTouch" :options="options" />
        </n-space>
        <n-space>
          <span class="font-bold">Trạng thái</span>
          <n-switch v-model:value="payload.state" />
        </n-space>
      </n-space>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">

import { reactive, watch, ref } from 'vue';
import { NSlider, NSpace, NDivider, NSwitch, NSelect } from 'naive-ui';

import { WidgetType, PickerTouch } from '@/components/Widget';

const props = defineProps<{
  dType: WidgetType | undefined,
  defailtValue: PickerTouch,
}>()

const options = ref<Array<{
  label: string,
  value: number,
}>>([]);

const payload = reactive<PickerTouch>(props.defailtValue);

const selectTouch = ref<number>(1);

if (props.dType?.includes('touch')) {
  options.value = new Array(parseInt(props.dType.slice(-1))).fill(0).map((val, index) => ({ label: `chạm ${index + 1}`, value: index }));
}

const emit = defineEmits<{
  (e: 'change', payload: PickerTouch): void
}>()

watch(selectTouch, (selectTouch: number) => {
  payload.position = selectTouch + 1;
})

watch(payload, (payload: PickerTouch) => {
  emit('change', payload);
})

</script>

<style scoped></style>