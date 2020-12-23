<template>
	<div></div>
</template>

<script lang="ts">
import Vue from 'vue';

import countProvider from '../providers/counter.vue';

export default countProvider.consumer.extend({
	mounted() {
		console.log(this.store.state.count);
		this.store.count = 10;
		console.log(this.store.state.count);
	}
});
</script>
