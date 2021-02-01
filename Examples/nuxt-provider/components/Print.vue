<template>
	<div class="counter-container">
		<button @click="provider.print()">print</button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';

import AnimalModule from '../modules/animalModule';
import ReptileModule from '../modules/reptileModule';

import { consumer } from '../../../lib/context';

export default consumer(AnimalModule).extend({
	mounted() {
		// console.log(this.provider);
	}
});
</script>
