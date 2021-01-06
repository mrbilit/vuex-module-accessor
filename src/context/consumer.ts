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
>(module: TModule, moduleName?: string) {
	const getModulePath = (path: string, name: string): string | null => {
		const modules: string[] = path.split('/');
		const firstModuleIndex = modules.findIndex((m) => m === name);
		let modulePath = '';
		if (firstModuleIndex > -1) {
			modulePath = modules.reduce((path, value, index) => {
				if (index <= firstModuleIndex) {
					return (path += `${value}/`);
				} else if (index + 1 === firstModuleIndex) {
					return (path += value);
				} else {
					return path;
				}
			});
			return modulePath;
		} else {
			return null;
		}
	};

	return Vue.extend({
		inject: { __providerData: { from: '__providerData', default: undefined } },
		data() {
			const providerData = (this as any).__providerData as ProviderData;
			const get$StoreModule = () => {
				if (moduleName) {
					const modulePath = getModulePath(providerData.$path, moduleName);
					if (modulePath) {
						return {
							provider: new ModuleAccessor<TModule, TState>(
								module,
								modulePath
							).of<TModule>(this.$store)
						};
					} else {
						throw new Error('module not found!');
					}
				} else {
					throw new Error('module name is required!');
				}
			};
			if (providerData && providerData.providerStore) {
				const { path, providerStore } = providerData;
				if (moduleName) {
					const modulePath = getModulePath(path, moduleName);
					if (modulePath) {
						return {
							provider: new ModuleAccessor<TModule, TState>(
								module,
								modulePath
							).of<TModule>(providerStore)
						};
					} else {
						return get$StoreModule();
					}
				} else {
					return {
						provider: new ModuleAccessor<TModule, TState>(
							module,
							''
						).of<TModule>(providerStore)
					};
				}
			} else {
				return get$StoreModule();
			}
		}
	});
}
