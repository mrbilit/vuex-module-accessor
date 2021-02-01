import { Module, mutation } from '../../../lib';

class FooState {
	testValue: string = 'Foo Module';
	count: number = 0;
}

export default class FooModule extends Module<FooState> {
	constructor() {
		super(FooState);
	}
	set count(count: number) {
		this.state.count = count;
	}
	increase() {
		this.count = this.state.count + 1;
	}
	decrease() {
		this.count = this.state.count - 1;
	}
}
