import Vue from 'vue';
import Vuex from 'vuex';
import ModuleAccessor from '../ModuleAccessor';
import Module from '../Module';
import { ExtractState } from '../Types';
import { ProviderData, Accessors, ConsumerOptions } from './types';
Vue.use(Vuex);

export default function <
	TModule extends Module<TState>,
	TState = ExtractState<TModule>
>(moduleName?: string, options?: ConsumerOptions) {
	const getAccessor = (
		path: string,
		moduleName: string,
		accessors: Accessors
	): ModuleAccessor<TModule, TState> => {
		const moduleNames: string[] = path.split('/');
		const firstModuleIndex = moduleNames.findIndex((m) => m === moduleName);
		if (firstModuleIndex > -1) {
			const modulePath = moduleNames.reduce((fullPath, value, index) => {
				if (index <= firstModuleIndex) {
					return (fullPath += `${value}/`);
				} else if (index + 1 === firstModuleIndex) {
					return (fullPath += value);
				} else {
					return fullPath;
				}
			}, '');
			return accessors[modulePath];
		} else {
			throw new Error('module not found!');
		}
	};

	return Vue.extend({
		inject: { __providerData: { from: '__providerData', default: undefined } },
		provide() {
			if (options?.bedrock) {
				return {
					__providerData: null
				};
			}
		},
		data() {
			const providerData = (this as any).__providerData as ProviderData;
			if (providerData && providerData.providerStore) {
				const { path, providerStore, accessors } = providerData;
				if (moduleName) {
					const accessor = getAccessor(path, moduleName, accessors);
					return {
						provider: accessor.of(providerStore)
					};
				} else {
					return {
						provider: (accessors.root as ModuleAccessor<TModule, TState>).of(
							providerStore
						)
					};
				}
			} else {
				if (moduleName) {
					const accessor = getAccessor(
						providerData?.path || '',
						moduleName,
						providerData?.accessors
					);
					return {
						provider: accessor.of(this.$store)
					};
				} else {
					throw new Error('module name is required!');
				}
			}
		}
	});
}
