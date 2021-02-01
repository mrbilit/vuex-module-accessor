<template>
	<div class="container">
		<bird-provider root>
			bird
			<print />
		</bird-provider>
		<reptile-provider root>
			reptile
			<print />
		</reptile-provider>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';

import BirdModule, { BirdState } from '../modules/birdModule';
import ReptileModule from '../modules/reptileModule';

import Print from '../components/Print.vue';

import { provider } from '../../../lib/context';

export default Vue.extend({
	computed: {},
	components: {
		BirdProvider: provider(BirdModule),
		ReptileProvider: provider(ReptileModule),
		Print
	}
});
</script>

<style>
.container {
	margin: 0 auto;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
}

button {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 10px;
	box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.1);
	border: 0;
	outline: none;
	cursor: pointer;
	overflow: hidden;
	box-sizing: border-box;
	padding: 10px;
	margin: 10px;
}
button:hover {
	box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
}

title {
	font-size: 18px;
	margin-bottom: 20px;
}

.counter-container {
	display: flex;
	align-items: center;
}
</style>
