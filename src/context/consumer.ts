import Vue from 'vue';
import Vuex from 'vuex';
import ModuleAccessor from '../ModuleAccessor';
import Module from '../Module';
import { ExtractState } from '../Types';
import { ProviderData } from './types';
Vue.use(Vuex);

export default function <
	TModule extends Module<TState>,
	TState = ExtractState<TModule>
>(accessor: ModuleAccessor<TModule, TState>, providerName: string) {
	return Vue.extend({
		inject: ['__providerData'],
		data() {
			return {
				[providerName]: accessor.of<TModule>(
					((this as any).__providerData as ProviderData)[providerName]
				)
			};
		}
	});
}
