<template>
  <div @click="open = !open"
    class="w-10 fixed bottom-8 right-8 rounded-md transition-shadow active:ring-2 shadow-sm shadow-slate-300 bg-white">
    <div class="flex flex-col items-center py-2">
      <div
        :class="`${open ? 'rotate-45 scale-x-[1.25] -translate-y-[1px] translate-x-[1px]' : 'rotate-0'} transition-transform origin-left w-6 h-[4px] bg-slate-500 rounded-md`">
      </div>
      <div
        :class="`${open ? 'opacity-0' : 'opacity-100'} transition-opacity w-6 h-[4px] bg-slate-500 rounded-md my-[5px]`">
      </div>
      <div
        :class="`${open ? '-rotate-45 scale-x-[1.25] translate-y-[2px] translate-x-[1px]' : 'rotate-0'} transition-transform origin-left w-6 h-[4px] bg-slate-500 rounded-md`">
      </div>
    </div>
    <n-drawer v-model:show="open" width="50%" placement="right">
      <n-drawer-content :body-content-style="{ 'padding': '0' }" title="Menu">
        <n-list hoverable clickable>
          <div @click="handleMenuList(info)" :key="info.name" v-for="info in drawerInfo">
            <n-list-item>
              <div class="flex items-center">
                <component class="w-5 h-5" :is="info.icon"></component>
                <span class="pl-2">{{ info.title }}</span>
              </div>
            </n-list-item>
          </div>
        </n-list>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { NDrawer, NDrawerContent, NList, NListItem } from 'naive-ui';
import { InformationCircleIcon, WifiIcon, AdjustmentsVerticalIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';

import { FunctionalComponent, HTMLAttributes, VNodeProps, ref } from 'vue';
import { useRouter } from 'vue-router';

interface DrawerInfo {
  name: string,
  title: string,
  icon: FunctionalComponent<HTMLAttributes & VNodeProps, {}, any>,
}

const router = useRouter();

const open = ref<boolean>(false);

const drawerInfo: Array<DrawerInfo> = [
  { name: 'device-info', title: 'thông tin hệ thống', icon: InformationCircleIcon },
  { name: 'connection', title: 'cấu hình mạng', icon: WifiIcon },
  { name: 'controll-device', title: 'điều khiển thiết bị', icon: AdjustmentsVerticalIcon },
  { name: 'ota-upgrade', title: 'cập nhật OTA', icon: ArrowPathIcon },
]

const handleMenuList = (item: DrawerInfo) => {
  router.push({ name: item.name });
  open.value = false;
}

</script>

<style scoped></style>