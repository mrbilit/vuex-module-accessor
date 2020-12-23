<template>
	<div class="container">
		<show-number />
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import testStore, { TestState } from '../store/testStore';

import ShowNumber from '../components/ShowNumber.vue';
import countProvider from '../providers/counter.vue';

export default countProvider.provider.extend({
	// inject: ['test'],
	computed: {},
	components: {
		ShowNumber
	},
	mounted() {
		// console.log((this as any).default);
	},
	methods: {}
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
