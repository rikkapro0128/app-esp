<template>
  <div class="flex items-center border rounded-full p-2 py-1 transition-colors"
    :class="props.status ? 'border-green-500 text-green-500' : ''">
    <i style="line-height: 0;" class="fi fi-rr-wifi-alt mr-1"></i>
    <span>{{
      props.status
      ? 'đang hoạt động' :
      'mất kết nối' }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  status: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped></style>