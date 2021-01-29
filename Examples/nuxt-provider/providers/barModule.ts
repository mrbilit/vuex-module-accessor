import { Module } from '../../../lib';
import { injectModules } from '../../../lib/context';

import FooModule from '~/providers/fooModule';

class BarState {}

@injectModules
export default class BarModule extends Module<BarState> {
	constructor(private fooModule: FooModule) {
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
