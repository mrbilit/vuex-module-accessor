<template>
	<div>
		<slot />
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ModuleAccessor, Module, mutation } from '../../../src';
import provider from '../../../src/provider';

export class TestState {
	testValue: string = 'Module Accessor';
	count: number = 0;
}

export class TestModule extends Module<TestState> {
	constructor() {
		super(new TestState());
	}

	// mutations
	set count(count: number) {
		this.state.count = count;
	}

	@mutation
	reset() {
		this.state.count = 0;
	}

	// actions
	increase() {
		this.count = this.state.count + 1;
	}
	decrease() {
		this.count = this.state.count - 1;
	}
}

export const accessor = new ModuleAccessor(new TestModule());
export default new provider(accessor);
</script>
