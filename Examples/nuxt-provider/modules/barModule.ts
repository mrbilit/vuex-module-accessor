import { Module } from '../../../lib';
import { inject } from '../../../lib/context';

import FooModule from '~/modules/fooModule';
import { ModuleGetter } from '~/../../lib/Types';

class BarState {}

export default class BarModule extends Module<BarState> {
	foo: FooModule;
	constructor(@inject(FooModule) private fooModule: ModuleGetter<FooModule>) {
		super(BarState);
		this.foo = this.useModule(this.fooModule);
	}

	get count(): number {
		return this.foo.state.count;
	}
	increase() {
		this.foo.increase();
	}
	decrease() {
		this.foo.decrease();
	}
}
