import Vue, { VueConstructor } from 'vue';
import Vuex from 'vuex';
import ModuleAccessor from '../ModuleAccessor';
import Module from '../Module';
import { ExtractState } from '../Types';

Vue.use(Vuex);

export default function provider<
	TModule extends Module<TState>,
	TState = ExtractState<TModule>
>(
	accessor: ModuleAccessor<TModule, TState>,
	providerName: string
): VueConstructor {
	return {
		provide: {
			[providerName]: new Vuex.Store({
				...accessor
			})
		},
		render(createElement: any) {
			return createElement('div', this.$slots.default);
		}
	} as any;
}
