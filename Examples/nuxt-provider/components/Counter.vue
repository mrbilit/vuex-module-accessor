<template>
	<div class="counter-container">
		<button @click="provider.decrease()">-</button>
		<div>
			{{ provider.count }}
		</div>
		<button @click="provider.increase()">+</button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';

import FooModule from '../modules/fooModule';
import BarModule from '../modules/barModule';

import { consumer } from '../../../lib/context';

export default consumer(BarModule).extend({
	mounted() {
		// console.log(this.provider);
	}
});
</script>
