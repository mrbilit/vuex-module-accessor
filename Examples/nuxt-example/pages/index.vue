<template>
	<div class="container">
		<div class="title">{{ testValue }}</div>
		<button @click="reset">reset</button>
		<div class="counter-container">
			<button @click="decrease">-</button>
			<div>
				{{ count }}
			</div>
			<button @click="increase">+</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { typedMapState } from 'module-accessor';

// stores
import test, { TestModule } from '../store/testStore';

export default Vue.extend({
	computed: {
		testStore(): TestModule {
			return test.of(this.$store);
		},
		...typedMapState(test, {
			testValue: (state) => state.testValue,
			count: (state) => state.count
		})
	},
	methods: {
		increase() {
			this.testStore.increase();
		},
		decrease() {
			this.testStore.decrease();
		},
		reset() {
			this.testStore.reset();
		}
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
