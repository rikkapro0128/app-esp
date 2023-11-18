<template>
  <div class="h-full flex flex-col overflow-hidden max-h-full">
    <h1 class="capitalize text-2xl pb-4 col-span-12">App test</h1>
    <div>
			<n-button @click="saveName" type="success">Save</n-button>
			<n-button @click="getName" type="success">Get</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NSpace, NInput, NButton } from "naive-ui";

// import { Storage, Drivers } from '@ionic/storage';
import DBNodeInfo from '@/IndexDB/nodeInfo'

const saveName = async () => {
	await DBNodeInfo.storage.set("name", {
		some: 'thing'
	});
};

const getName = async () => {
	const name = await DBNodeInfo.storage.get('name');
	console.log(name);
};

</script>
