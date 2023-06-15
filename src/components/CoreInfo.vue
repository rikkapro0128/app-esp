<template>
  <div class="rounded-md shadow-sm bg-white shadow-slate-300 p-2 flex items-center">
    <CpuChipIcon class="w-8 h-8" />
    <div class="flex-1">
      <p class="capitalize text-center">Core {{ coreNumber }}</p>
      <p class="text-center">{{ clock }} {{ unit }}</p>
    </div>
  </div>
</template> 

<script setup lang="ts">
import { CpuChipIcon } from '@heroicons/vue/24/outline';

defineProps({
  coreNumber: {
    type: Number,
    default: 0
  },
  clock: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'Mhz'
  }
})
</script>

<style scoped></style>