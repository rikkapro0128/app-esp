<template>
  <div class="h-full flex flex-col overflow-hidden max-h-full">
    <h1 class="capitalize text-2xl pb-4 col-span-12">Sơ đồ mạng mesh</h1>
    <div id="org-chart-container" class="relative">
      <n-button-group size="tiny">
        <n-button @click="orgChart?.smaller()" round>
          <template #icon>
            <i style="line-height: 0" class="fi fi-rr-zoom-out"></i>
          </template>
          thu nhỏ
        </n-button>
        <n-button @click="orgChart?.bigger()" round>
          <template #icon>
            <i style="line-height: 0" class="fi fi-rr-zoom-in"></i>
          </template>
          phóng to
        </n-button>
      </n-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
// import VueTree from "@ssthouse/vue3-tree-chart";
// import "@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css";
import { NButtonGroup, NButton } from "naive-ui";

import OrgChart from "@/libs/tree-chart/org-chart";
import { generateOrgChartData } from "@/libs/tree-chart/data-generator";

import { ref, onMounted, watch } from "vue";

import { storeToRefs } from "pinia";
import { useNodeStore } from "@/store";

interface DataProps {
  name: string;
  title: string;
  children: any;
}

const orgChart = ref<OrgChart>();
const dataDemo = generateOrgChartData(10);
const data: DataProps = {
  name: "root",
  title: "root",
  children: [],
};

let parents: {
	[key: string]: {
		children: any[]
	}
} = {};

const { value } = storeToRefs(useNodeStore());

const assignByLevel = (
  target: any,
  count: number,
  level: number,
  data: any
) => {};

onMounted(() => {
  // orgChart.value = new OrgChart();
  // orgChart.value.context.imageSmoothingQuality = "high";
  // console.log(orgChart.value.context);
  // orgChart.value.draw(dataDemo);
  // console.log(orgChart.value);
});

watch(value, (nodes) => {
	// console.log(nodes.length);
	
	// for (const node of nodes) {
	// 	console.log(node);
	// }
	parents = {};
  nodes.forEach((node) => {
		if(!parents[node.info.parentBssi]) { parents[node.info.parentBssi] = { children: [] } }
		else {
			parents[node.info.parentBssi].children.push({
				name: node.target,
				layer: node.info.layer,
			})
		}
  });
	console.log(parents);
});


</script>

<style scoped lang="css"></style>
