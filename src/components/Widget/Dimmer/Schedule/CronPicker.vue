<template>
  <n-space vertical>
    <n-space vertical>
      <n-divider style="margin: 0.4rem 0;" title-placement="left">
        <span class="font-bold text-lg">Thời gian</span>
      </n-divider>
      <div class="grid grid-cols-12 gap-2">
        <!-- pick second -->
        <n-space vertical class="col-span-4 mt-1">
          <n-button text class="flex items-center" @click="formatSelection.second = !formatSelection.second">
            <i style="line-height: 0;" class="fi fi-rr-replace mr-1"></i>
            <span>{{ formatSelection.second ? 'mỗi' : 'vào' }}</span>
          </n-button>
          <n-select placement="top" placeholder="giây" v-model:value="timePicker.second"
            :options="[emptyOption, ...repeat(60, undefined).map((_, i) => ({ label: `Giây ${i}`, value: i }))]" />
        </n-space>
        <!-- pick minute -->
        <n-space vertical class="col-span-4 mt-1">
          <n-button text class="flex items-center" @click="formatSelection.minute = !formatSelection.minute">
            <i style="line-height: 0;" class="fi fi-rr-replace mr-1"></i>
            <span>{{ formatSelection.minute ? 'mỗi' : 'vào' }}</span>
          </n-button>
          <n-select placement="top" placeholder="phút" v-model:value="timePicker.minute"
            :options="[emptyOption, ...repeat(60, undefined).map((_, i) => ({ label: `Phút ${i}`, value: i }))]" />
        </n-space>
        <!-- pick hour -->
        <n-space vertical class="col-span-4 mt-1">
          <n-button text class="flex items-center" @click="formatSelection.hour = !formatSelection.hour">
            <i style="line-height: 0;" class="fi fi-rr-replace mr-1"></i>
            <span>{{ formatSelection.hour ? 'mỗi' : 'vào' }}</span>
          </n-button>
          <n-select placement="top" placeholder="giờ" v-model:value="timePicker.hour"
            :options="[emptyOption, ...repeat(24, undefined).map((_, i) => ({ label: `${i} - ${i >= 12 ? 'PM' : 'AM'}`, value: i }))]" />
        </n-space>
        <!-- pick day of week -->
        <n-space vertical class="col-span-6 mt-1">
          <n-button text class="flex items-center" @click="formatSelection.dayWeek = !formatSelection.dayWeek">
            <i style="line-height: 0;" class="fi fi-rr-replace mr-1"></i>
            <span>{{ formatSelection.dayWeek ? 'mỗi' : 'vào' }}</span>
          </n-button>
          <n-select placement="top" placeholder="thứ" v-model:value="timePicker.dayWeek"
            :options="[emptyOption, ...repeat(7, undefined).map((_, i) => ({ label: `Thứ ${i + 2}`, value: i }))]" />
        </n-space>
        <!-- pick day of month -->
        <n-space vertical class="col-span-6 mt-1">
          <n-button text class="flex items-center" @click="formatSelection.dayMonth = !formatSelection.dayMonth">
            <i style="line-height: 0;" class="fi fi-rr-replace mr-1"></i>
            <span>{{ formatSelection.dayMonth ? 'mỗi' : 'vào' }}</span>
          </n-button>
          <n-select placement="top" placeholder="ngày" v-model:value="timePicker.dayMonth"
            :options="[emptyOption, ...repeat(31, undefined).map((_, i) => ({ label: `Ngày ${i + 1}`, value: i + 1 }))]" />
        </n-space>
        <!-- pick month -->
        <n-space vertical class="col-span-12 mt-1">
          <n-button text class="flex items-center" @click="formatSelection.month = !formatSelection.month">
            <i style="line-height: 0;" class="fi fi-rr-replace mr-1"></i>
            <span>{{ formatSelection.month ? 'mỗi' : 'vào' }}</span>
          </n-button>
          <n-select placement="top" placeholder="tháng" v-model:value="timePicker.month"
            :options="[emptyOption, ...repeat(12, undefined).map((_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }))]" />
        </n-space>
      </div>
    </n-space>
    <p>Thực hiện vào: <span class="italic">"{{ sentenceDesc }}"</span></p>
    <!-- <p>Schedule CMD: <span class="italic">{{ cronCMD }}</span></p> -->
  </n-space>
</template>

<script setup lang="ts">
import { NSelect, NSpace, NDivider, NButton } from 'naive-ui';
import { ref, reactive, watch, onMounted } from 'vue';
import { repeat } from 'seemly';

import 'cronstrue/locales/vi';
import cronstrue from 'cronstrue';

const emptyOption = {
  label: 'bỏ chọn',
  select: false,
  value: undefined,
}

const defaultOptions = {
  use24HourTimeFormat: true,
  locale: 'vi'
}

const emit = defineEmits<{
  (e: 'change', schedule: string): void
}>()

const sentenceDesc = ref<string>('trống');

const formatSelection = reactive({ // false: at | true: every
  second: emptyOption.select,
  minute: emptyOption.select,
  hour: emptyOption.select,
  dayMonth: emptyOption.select,
  dayWeek: emptyOption.select,
  month: emptyOption.select,
});

const timePicker = reactive({
  second: emptyOption.value,
  minute: emptyOption.value,
  hour: emptyOption.value,
  dayMonth: emptyOption.value,
  dayWeek: emptyOption.value,
  month: emptyOption.value,
});

const cronCMD = ref<string>(`* * * * * *`);

const parserCronStr = () => {
  return `${formatSelection.second && timePicker.second ? '*/' : ''}${timePicker.second ?? '*'} ${formatSelection.minute && timePicker.minute ? '*/' : ''}${timePicker.minute ?? '*'} ${formatSelection.hour && timePicker.hour ? '*/' : ''}${timePicker.hour ?? '*'} ${formatSelection.dayMonth && timePicker.dayMonth ? '*/' : ''}${timePicker.dayMonth ?? '*'} ${formatSelection.month && timePicker.month ? '*/' : ''}${timePicker.month ?? '*'} ${formatSelection.dayWeek && timePicker.dayWeek ? '*/' : ''}${timePicker.dayWeek ?? '*'}`;
}

cronCMD.value = parserCronStr();

onMounted(() => {
  sentenceDesc.value = cronstrue.toString(cronCMD.value, defaultOptions);
})

watch([timePicker, formatSelection], ([tPicker]) => {
  // console.log(tPicker);
  try {
    const cmd = parserCronStr();
    sentenceDesc.value = cronstrue.toString(cmd, defaultOptions);
    cronCMD.value = cmd;
    emit('change', cmd);
  } catch (error) {
    console.log(error);
  }
})

</script>

<style scoped></style>