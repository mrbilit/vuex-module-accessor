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
		inject: { __providerData: { from: '__providerData', default: undefined } },
		data() {
			console.log((this as any).__providerData);
			if ((this as any).__providerData) {
				return {
					[providerName]: accessor.of<TModule>(
						(this as any).__providerData as ProviderData
					)
				};
			} else {
				return {
					[providerName]: accessor.of<TModule>(this.$store)
				};
			}
		}
	});
}
