<template>
  <div>
    <n-collapse>
      <n-collapse-item v-for="num in numTouch"
        :title="`Công tắc ${num} - khoá điều khiển ${scenes[num]?.value ? scenes[num]?.value.length : 0}`" :name="num">
        <n-space v-if="scenes[num]?.value && scenes[num]?.value.length > 0" vertical>
          <n-card v-for="scene in scenes[num].value" :title="`Địa chỉ: ${scene.target}`" size="small">
            <template #header-extra>
              <n-button @click="removeScene(scene, num)" type="error" round>
                Xoá
              </n-button>
            </template>
            <span><b>Loại thiết bị:</b> {{ scene.payload.dType }}</span>
            <div>
              <p><b>Chế độ điều khiển:</b> {{ scene.payload.mode === 1 ? 'tất cả' : 'chỉ một' }}</p>
              <p v-if="scene.payload.mode === 1"><b>Vị trí:</b> chạm {{ scene.payload.position }}</p>
            </div>
            <span><b>Trạng thái:</b> {{ scene.payload.state ? 'bật' : 'tắt' }}</span>
          </n-card>
        </n-space>
        <n-empty v-else description="chưa có ngữ cảnh nào được tạo.">
          <template #icon>
            <i style="line-height: 0;" class="fi fi-rr-calendar-xmark"></i>
          </template>
        </n-empty>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<script setup lang="ts">
import { NEmpty, NSpin, NSpace, NButton, NEllipsis, NCollapse, NCollapseItem, NCard } from 'naive-ui';
import { onMounted, onUnmounted, reactive, ref } from 'vue';

import { MessageSocketProps, PacketProps, PacketControll, TouchProps, WidgetType, CountdownProps, LoadType } from '@/components/Widget';

import notyf from '@/notyf';
import { storeToRefs } from 'pinia'
import { useCommonStore } from '@/store';

import { sleep } from '@/helper';

interface SceneProps {
  [key: number]: {
    value: Array<any>,
  }
}

const { ipMeshRoot, wsClient } = storeToRefs(useCommonStore());

const props = defineProps<{
  target: string,
  dType: WidgetType,
}>();

const numTouch = ref<number>(parseInt(props.dType.slice(-1)));
let scenes = reactive<SceneProps>({});

Array(numTouch.value).fill(0).forEach((_, i) => {
  scenes[i + 1] = { value: [] };
})

const removeScene = (scene: any, position: number) => {
  // console.log(position);
  if (wsClient.value) {
    if (wsClient.value.readyState === wsClient.value.OPEN) {
      const packet = {
        target: props.target,
        payload: {
          pType: 'scene',
          pAction: 'DELETE',
          mode: 1,
          position: position,
          id: scene.id
        }
      };
      wsClient.value.send(JSON.stringify(packet));
    }
  }
}

const onMessage = (event: MessageEvent<any>) => {
  const { target, payload } = JSON.parse(typeof event.data === 'string' ? event.data : '');

  if (target !== props.target) { // check device id of payload
    return;
  }

  if (payload) {
    const { payload: scene, message, position, pType, id } = payload;

    if (pType !== 'scene') {
      return;
    }

    console.log(payload);

    if (message === 'SCENE_CREATE_OK') {
      notyf.success(`Thêm ngữ cảnh vào chạm ${position} thành công!`);
    } else if (message === 'SCENE_DELETE_OK') {
      notyf.success(`Xoá ngữ cảnh thành công!`);
      if (position > 0) {
        scenes[position]['value'] = scenes[position]['value'].filter((scene: any) => scene.id !== id);
      }
    }

    if (position <= numTouch.value && position > 0 && scene) {
      scenes[position]['value'].push(scene);
    }
    console.log(scene);
  }
}

onMounted(() => {
  if (wsClient.value) {
    if (wsClient.value.readyState === wsClient.value.OPEN) {
      wsClient.value.addEventListener('message', onMessage);
      if (props.dType.includes('touch')) {
        (async () => {
          const nums = Array(parseInt(props.dType.slice(-1))).fill(0).map((_, i) => i + 1);
          for await (const num of nums) {
            // console.log(num);
            const packet = {
              target: props.target,
              payload: {
                pType: 'scene',
                pAction: 'READ',
                mode: 0, // read all scene at num
                position: num,
              }
            };
            wsClient.value.send(JSON.stringify(packet));
            await sleep(100)
          }
        })()
      }
    }
  }
})

onUnmounted(() => {
  if (wsClient.value) {
    wsClient.value.removeEventListener('message', onMessage);
  }
})

</script>