import Vue from 'vue';
import Vuex from 'vuex';
import ModuleAccessor from '../ModuleAccessor';
import Module from '../Module';
import { ExtractState } from '../Types';
Vue.use(Vuex);

export default function <
	TModule extends Module<TState>,
	TState = ExtractState<TModule>
>(accessor: ModuleAccessor<TModule, TState>, providerName: string) {
	return Vue.extend({
		inject: [providerName],
		data() {
			return {
				[providerName]: accessor.of<TModule>((this as any)[providerName])
			};
		}
	});
}
