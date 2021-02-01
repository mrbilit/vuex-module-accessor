import Vue from 'vue';
import Vuex from 'vuex';
import ModuleAccessor from '../ModuleAccessor';
import Module from '../Module';
import { ExtractState } from '../Types';
import {
	ProviderData,
	ConsumerOptions,
	ModuleConstructor,
	ModuleAbstract
} from './types';
import { getAccessor } from './helpers';
Vue.use(Vuex);

export default function <
	TModule extends Module<TState>,
	TState = ExtractState<TModule>
>(
	Module: ModuleConstructor<TModule> | ModuleAbstract<TModule>,
	options?: ConsumerOptions
) {
	return Vue.extend({
		inject: { __providerData: { from: '__providerData', default: undefined } },
		provide() {
			if (options?.bedrock) {
				return {
					__providerData: null
				};
			}
		},
		data(): { provider: TModule } {
			const providerName = options?.providerName;
			const providerData = (this as any).__providerData as ProviderData;
			if (providerData && providerData.providerStore) {
				const { path, providerStore, accessors } = providerData;
				if (Module) {
					const accessor = getAccessor<TModule, TState>(
						path,
						providerName || Module,
						accessors
					);
					return {
						provider: accessor.accessor.of(providerStore)
					};
				} else {
					return {
						provider: (accessors.root.accessor as ModuleAccessor<
							TModule,
							TState
						>).of(providerStore)
					};
				}
			} else {
				if (Module) {
					const accessor = getAccessor<TModule, TState>(
						providerData?.path || '',
						providerName || Module,
						providerData?.accessors
					);
					return {
						provider: accessor.accessor.of(this.$store)
					};
				} else {
					throw new Error('Module or module name is required!');
				}
			}
		}
	});
}
