<template>
  <div class="flex-1">
    <n-empty class="h-full flex flex-col justify-center" description="chưa có lập lịch nào được tạo.">
      <template #icon>
        <i style="line-height: 0;" class="fi fi-rr-calendar-xmark"></i>
      </template>
    </n-empty>
  </div>
</template>

<script setup lang="ts">
import { NEmpty } from 'naive-ui';

defineProps({
  idDevice: {
    type: String,
  }
})
</script>

<style scoped></style>