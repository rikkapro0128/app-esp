<template>
  <div class="bg-white p-2 shadow-sm rounded-md shadow-slate-300">
    <div class="flex flex-nowrap">
      <i class="fi fi-rr-memory mx-1 self-center text-3xl"></i>
      <div class="pl-2 flex-1">
        <p class="capitalize text-left pb-1">lưu trữ bên trong</p>
        <div class="flex items-center">
          <div class="relative rounded-full bg-green-100 p-[3px] overflow-hidden flex-1">
            <!-- present percent -->
            <div :style="{ 'transform': `translateX(${percent - 100}%)` }"
              class="absolute p-[3px] top-0 left-0 w-full bg-green-500 rounded-full transition-transform">
            </div>
          </div>
          <span class="pl-4">{{ percent }}%</span>
        </div>
        <div class="pt-1">
          <transition name="fade" mode="out-in" :duration="200">
            <n-skeleton v-if="skeleton" height="1rem" text />
            <div v-else class="flex flex-nowrap">
              <p>Còn trống: {{ totalSize - presentSize }} {{ unit }}</p>
              <p>, Tổng: {{ totalSize }} {{ unit }}</p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NSkeleton } from 'naive-ui';

import { ref, onMounted } from 'vue';

const percent = ref<number>(0);
const skeleton = ref<boolean>(true);

onMounted(() => {
  setTimeout(() => {
    percent.value = Math.ceil((props.presentSize / props.totalSize) * 100);
    skeleton.value = false;
  }, 1000);
})

const props = defineProps({
  totalSize: {
    type: Number,
    default: 320,
  },
  presentSize: {
    type: Number,
    default: 240,
  },
  unit: {
    type: String,
    default: 'KByte'
  },
})

</script>

<style scoped></style>