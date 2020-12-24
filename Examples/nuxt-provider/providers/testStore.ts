import { ModuleAccessor, Module, mutation } from 'vuex-module-accessor';

class TestState {
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

export default new ModuleAccessor(new TestModule(), '');
