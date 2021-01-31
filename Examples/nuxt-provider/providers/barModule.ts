import { Module } from '../../../lib';
import { inject } from '../../../lib/context';

import FooModule from '~/providers/fooModule';

class BarState {}

export default class BarModule extends Module<BarState> {
	constructor(@inject('FooModule') private fooModule: FooModule) {
		super(BarState);
	}
	get count(): number {
		return this.fooModule.state.count;
	}
	increase() {
		this.fooModule.increase();
	}
	decrease() {
		this.fooModule.decrease();
	}
}
