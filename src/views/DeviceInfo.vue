<template>
  <div>
    <div class="relative h-12">
      <h1 class="text-2xl pb-4 fixed">Thông tin thiết bị</h1>
    </div>
    <div class="">
      <!-- cpu status ui -->
      <div class="grid grid-cols-12 gap-2">
        <p class="col-span-12">Trạng thái CPU</p>
        <div class="col-span-12 grid grid-cols-12 gap-4">
          <core-info class="col-span-6" :core-number="0" :clock="10.3" />
          <core-info class="col-span-6" :core-number="1" :clock="8.2" />
        </div>
      </div>
      <!-- storage status ui -->
      <div class="grid grid-cols-12 gap-2 pt-4">
        <p class="col-span-12">Trạng thái Lưu trữ</p>
        <storage-info class="col-span-12" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { NButton } from 'naive-ui';

import CoreInfo from '@/components/CoreInfo.vue';
import StorageInfo from '@/components/Info/Storage.vue';

</script>

<style scoped></style>