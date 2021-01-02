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
>(module: TModule, providerName: string): VueConstructor {
	return {
		props: {
			root: {
				type: Boolean,
				default: false
			}
		},
		inject: { __providerData: { from: '__providerData', default: undefined } },
		provide() {
			if (this.root) {
				return {
					__providerData: new Vuex.Store(
						new ModuleAccessor<TModule, TState>(module)
					)
				};
			} else {
				if (this.__providerData) {
					(this.__providerData as ProviderData).registerModule(providerName, {
						...new ModuleAccessor<TModule, TState>(module),
						namespaced: true
					});
				} else {
					if (this.$store) {
						this.$store.registerModule(
							providerName,
							new ModuleAccessor<TModule, TState>(module)
						);
					} else {
						throw new Error('No vuex provided!');
					}
				}
			}
		},
		render(createElement: any) {
			return createElement('div', this.$slots.default);
		}
	} as any;
}
