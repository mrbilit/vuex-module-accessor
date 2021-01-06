import Vue, { VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import ModuleAccessor from '../ModuleAccessor';
import Module from '../Module';
import { ExtractState } from '../Types';
import { ProviderData } from './types';

Vue.use(Vuex);

export default function provider<
	TModule extends Module<TState>,
	TState = ExtractState<TModule>
>(module: TModule, moduleName?: string): VueConstructor {
	return {
		props: {
			root: {
				type: Boolean,
				default: false
			}
		},
		inject: { __providerData: { from: '__providerData', default: undefined } },
		provide(): { __providerData: ProviderData } | undefined {
			const providerData = this.__providerData as ProviderData;
			if (this.root) {
				return {
					__providerData: {
						path: '',
						$path: '',
						providerStore: new Vuex.Store(
							new ModuleAccessor<TModule, TState>(module)
						)
					}
				};
			} else {
				if (moduleName) {
					if (providerData && providerData.providerStore) {
						const { providerStore, path } = providerData;
						const modules = path.split('/');
						modules.splice(0, 1);
						modules.push(moduleName);
						providerStore.registerModule(modules, {
							...new ModuleAccessor<TModule, TState>(module),
							namespaced: true
						});
						return {
							__providerData: {
								path: `${path}/${moduleName}`,
								$path: '',
								providerStore: providerStore
							}
						};
					} else if (this.$store) {
						if (providerData) {
							const { $path } = providerData;
							const modules = $path.split('/');
							modules.splice(0, 1);
							modules.push(moduleName);
							this.$store.registerModule(modules, {
								...new ModuleAccessor<TModule, TState>(module),
								namespaced: true
							});
							return {
								__providerData: {
									$path: `${$path}/${moduleName}`,
									path: ''
								}
							};
						} else {
							this.$store.registerModule(moduleName, {
								...new ModuleAccessor<TModule, TState>(module),
								namespaced: true
							});
							return {
								__providerData: {
									$path: `/${moduleName}`,
									path: ''
								}
							};
						}
					} else {
						throw new Error('No vuex provided!');
					}
				} else {
					throw new Error('use root provider or set module name!');
				}
			}
		},
		render(createElement: any) {
			return createElement(
				'div',
				{
					attrs: {
						id: moduleName ? `__${moduleName}-provider` : '__root-provider'
					}
				},
				this.$slots.default
			);
		}
	} as any;
}
