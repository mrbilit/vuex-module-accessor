import Vue, { VueConstructor } from 'vue';
import Vuex from 'vuex';
import ModuleAccessor from '../ModuleAccessor';
import Module from '../Module';
import { ExtractState } from '../Types';
import { ProviderData } from './types';

Vue.use(Vuex);

export default function provider<
	TModule extends Module<TState>,
	TState = ExtractState<TModule>
>(
	accessor: ModuleAccessor<TModule, TState>,
	providerName: string
): VueConstructor {
	return {
		props: {
			root: {
				type: Boolean,
				default: false
			}
		},
		data: () => ({
			__providerData: {} as ProviderData
		}),
		inject: ['__providerData'],
		provide() {
			const providerData = this.__providerData || { providers: [] };
			if (this.__providerData) {
				if (this.root) {
					providerData[providerName] = new Vuex.Store({
						...accessor
					});
					providerData.providers.push(providerName);
				} else {
					const lastProviderName =
						providerData.providers[providerData.providers.length - 1];
					providerData[lastProviderName].registerModule(providerName, {
						...accessor
					});
				}
			} else if (this.root) {
				providerData[providerName] = new Vuex.Store({
					...accessor
				});
				providerData.providers.push(providerName);
			} else {
				throw new Error('No provider found');
			}
			return { __providerData: providerData };
		},
		render(createElement: any) {
			return createElement('div', this.$slots.default);
		}
	} as any;
}
