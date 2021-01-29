import Vue from 'vue';
import Vuex from 'vuex';
import ModuleAccessor from '../ModuleAccessor';
import Module from '../Module';
import { ExtractState } from '../Types';
import { ProviderData, Accessors, ConsumerOptions } from './types';
import { getAccessor } from './helpers';
Vue.use(Vuex);

export default function <
	TModule extends Module<TState>,
	TState = ExtractState<TModule>
>(Module: { new (...args: any[]): TModule }, options?: ConsumerOptions) {
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
			const moduleName = Module.name;
			const providerData = (this as any).__providerData as ProviderData;
			if (providerData && providerData.providerStore) {
				const { path, providerStore, accessors } = providerData;
				if (moduleName) {
					const accessor = getAccessor<TModule, TState>(
						path,
						moduleName,
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
				if (moduleName) {
					const accessor = getAccessor<TModule, TState>(
						providerData?.path || '',
						moduleName,
						providerData?.accessors
					);
					return {
						provider: accessor.accessor.of(this.$store)
					};
				} else {
					throw new Error('module name is required!');
				}
			}
		}
	});
}
