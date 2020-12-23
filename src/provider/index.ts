import Vue, { VueConstructor } from 'vue';
import Vuex from 'vuex';
import ModuleAccessor from '../ModuleAccessor';
import Module from '../Module';
import { ExtractState } from '../Types';
import mixins from 'vue-typed-mixins';

Vue.use(Vuex);

export default class Provider<
	TModule extends Module<TState>,
	TState = ExtractState<TModule>
> {
	provider: VueConstructor;
	consumer: VueConstructor;
	constructor(store: ModuleAccessor<TModule, TState>) {
		this.provider = mixins(
			Vue.extend({
				data: () => ({
					module: new Vuex.Store({
						...store
					})
				}),
				provide() {
					return { storeProvider: this.module };
				}
			})
		);
		this.consumer = mixins(
			Vue.extend({
				inject: ['storeProvider'],
				data() {
					return {
						store: store.of<TModule>((this as any).storeProvider)
					};
				}
			})
		);
	}
}
