<template>
	<div class="counter-container">
		<button @click="testStore.decrease()">-</button>
		<div>
			{{ testStore.state.count }}
		</div>
		<button @click="testStore.increase()">+</button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';

import testStore from '../providers/testStore';
import { consumer } from 'vuex-module-accessor';

export default consumer(testStore, 'testStore').extend({});
</script>
