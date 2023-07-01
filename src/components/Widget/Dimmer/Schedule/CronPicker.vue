<template>
  <n-space vertical>
    <n-space vertical>
      <span class="font-bold">Thời gian</span>
      <div class="grid grid-cols-12 gap-2">
        <!-- pick second -->
        <n-select class="col-span-4" placement="top" placeholder="giây" v-model:value="timePicker.second"
          :options="[emptyOption, ...repeat(60, undefined).map((_, i) => ({ label: `Giây ${i}`, value: i }))]" />
        <!-- pick minute -->
        <n-select class="col-span-4" placement="top" placeholder="phút" v-model:value="timePicker.minute"
          :options="[emptyOption, ...repeat(60, undefined).map((_, i) => ({ label: `Phút ${i}`, value: i }))]" />
        <!-- pick hour -->
        <n-select class="col-span-4" placement="top" placeholder="giờ" v-model:value="timePicker.hour"
          :options="[emptyOption, ...repeat(24, undefined).map((_, i) => ({ label: `${i} - ${i >= 12 ? 'PM' : 'AM'}`, value: i }))]" />
        <!-- pick day of week -->
        <n-select class="col-span-6" placement="top" placeholder="thứ" v-model:value="timePicker.dayWeek"
          :options="[emptyOption, ...repeat(7, undefined).map((_, i) => ({ label: `Thứ ${i + 2}`, value: i }))]" />
        <!-- pick day of month -->
        <n-select class="col-span-6" placement="top" placeholder="ngày (theo tháng)" v-model:value="timePicker.dayMonth"
          :options="[emptyOption, ...repeat(31, undefined).map((_, i) => ({ label: `Ngày ${i + 1}`, value: i + 1 }))]" />
        <!-- pick month -->
        <n-select class="col-span-12" placement="top" placeholder="tháng" v-model:value="timePicker.month"
          :options="[emptyOption, ...repeat(12, undefined).map((_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }))]" />
      </div>
    </n-space>
    <p>Thực hiện vào: <span class="italic">"{{ sentenceDesc }}"</span></p>
    <p>Schedule CMD: <span class="italic">{{ cronCMD }}</span></p>
  </n-space>
</template>

<script setup lang="ts">
import { NSelect, NSpace } from 'naive-ui';
import { ref, reactive, watch } from 'vue';
import { repeat } from 'seemly';

// import './i18n.local';
import cronstrue from 'cronstrue';

const emptyOption = {
  label: 'bỏ chọn',
  value: undefined
}

const emit = defineEmits<{
  (e: 'change', schedule: string): void
}>()

const sentenceDesc = ref<string>('trống');
const cronCMD = ref<string>('* * * * * *');

const timePicker = reactive({
  second: emptyOption.value,
  minute: emptyOption.value,
  hour: emptyOption.value,
  dayMonth: emptyOption.value,
  dayWeek: emptyOption.value,
  month: emptyOption.value,
});

watch(timePicker, (tPicker) => {
  // console.log(tPicker);
  try {
    const cmd = `${tPicker.second ?? '*'} ${tPicker.minute ?? '*'} ${tPicker.hour ?? '*'} ${tPicker.dayMonth ?? '*'} ${tPicker.month ?? '*'} ${tPicker.dayWeek ?? '*'}`;
    sentenceDesc.value = cronstrue.toString(cmd, { use24HourTimeFormat: true });
    cronCMD.value = cmd;
    emit('change', cmd);
  } catch (error) {

  }
})

</script>

<style scoped></style>