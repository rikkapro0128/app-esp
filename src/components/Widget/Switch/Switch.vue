<template>
  <div class="w-full rounded-lg flex flex-col items-center">
    <div @touchstart="onTouch" :class="{ 'active': touch }"
      class="transition-all w-3/4 aspect-square shadow--soft rounded-full flex justify-center items-center"><i
        class="fi fi-rr-power text-3xl" :class="{ 'text-green-400': touch }" style="line-height: 0;"></i>
    </div>
    <p class="relative pt-2">{{ props.name }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  name: string,
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'controll', value: boolean): void
}>()

const touch = ref<boolean>(false);

const onTouch = async () => {
  touch.value = !touch.value
  emit('controll', touch.value);
}

</script>

<style scoped>
.shadow--soft {
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  box-shadow: 8px 8px 5px #dbdbdb,
    -8px -8px 5px #ffffff;
}

.shadow--soft.active {
  background: linear-gradient(145deg, #e6e6e6, #ffffff);
  box-shadow: 8px 8px 5px #dbdbdb,
    -8px -8px 5px #ffffff;
}
</style>