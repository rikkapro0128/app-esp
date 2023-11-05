<template>
  <div class="h-full flex flex-col overflow-hidden max-h-full">
    <h1 class="capitalize text-2xl pb-4 col-span-12">Cài đặt</h1>
    <div>
      <n-space vertical>
        <n-space vertical>
          <h2>Server OTA {hostname:port}</h2>
          <n-input v-model:value="urlOTA" type="text" placeholder="hostnames" />
        </n-space>
        <div class="flex justify-end">
          <n-button @click="saveConfig" type="primary">
            <template #icon>
              <i style="line-height: 0;" class="fi fi-rr-disk"></i>
            </template>
            lưu lại</n-button
          >
        </div>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { BookmarkIcon } from "@heroicons/vue/24/solid";
import notyf from "@/notyf";
import { NSpace, NInput, NButton } from "naive-ui";

const urlOTA = ref<string>("");

const saveConfig = () => {
  localStorage.setItem("linkOTA", urlOTA.value);
  notyf.success("Lưu cấu hình thành công");
};

const linkOTA = localStorage.getItem("linkOTA");

if (linkOTA) {
  urlOTA.value = linkOTA;
}
</script>
