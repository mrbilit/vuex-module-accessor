import Vue, { VueConstructor } from 'vue';
import Vuex, { Module as VModule } from 'vuex';
import ModuleAccessor from '../ModuleAccessor';
import Module from '../Module';
import { ExtractState } from '../Types';
import { ProviderData } from './types';

Vue.use(Vuex);

export default function provider<
	TModule extends Module<TState>,
	TState = ExtractState<TModule>
>(module: TModule): VueConstructor {
	const getModuleNames = (path: string, moduleName: string): string[] => {
		const modules = path.split('/');
		modules.pop();
		modules.push(moduleName as string);
		return modules;
	};
	return {
		props: {
			root: {
				type: Boolean,
				default: false
			},
			moduleName: {
				type: String,
				default: ''
			},
			bedrock: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return { localAccessor: null };
		},
		inject: { __providerData: { from: '__providerData', default: undefined } },
		provide(): { __providerData: ProviderData | null } | undefined {
			const getNewModule = (
				namespace: string
			): {
				accessor: ModuleAccessor<TModule, TState>;
				module: VModule<any, any>;
			} => {
				const accessor = new ModuleAccessor<TModule, TState>(module, namespace);
				return {
					module: {
						namespaced: true,
						state: {
							...accessor.state()
						},
						getters: accessor.getters,
						actions: accessor.actions,
						mutations: accessor.mutations
					},
					accessor
				};
			};
			// set module name
			const moduleName = this.moduleName || module.constructor.name;
			//
			const providerData = this.__providerData as ProviderData;
			let newProviderData: ProviderData = {
				path: '',
				accessors: {}
			};
			const getPath = (): string => {
				return `${providerData?.path || ''}${moduleName}/`;
			};
			if (this.root) {
				const newModule = getNewModule('');
				const store = new Vuex.Store(newModule.module);
				this.localAccessor = newModule.accessor.of(store);
				return {
					__providerData: {
						path: '',
						providerStore: store,
						accessors: {
							root: newModule.accessor
						}
					}
				};
			} else {
				if (providerData && providerData.providerStore) {
					const { providerStore, path, accessors } = providerData;
					const newPath = getPath();
					const newModule = getNewModule(newPath);
					providerStore.registerModule(
						getModuleNames(path, moduleName),
						newModule.module
					);
					this.localAccessor = newModule.accessor.of(providerStore);
					newProviderData = {
						path: getPath(),
						providerStore: providerStore,
						accessors: {
							...accessors,
							[newPath]: newModule.accessor
						}
					};
				} else if (this.$store) {
					if (providerData) {
						const { path, accessors } = providerData;
						const newPath = getPath();
						const newModule = getNewModule(newPath);
						this.localAccessor = newModule.accessor.of(this.$store);
						this.$store.registerModule(
							getModuleNames(path, moduleName),
							newModule.module
						);
						newProviderData = {
							path: newPath,
							accessors: {
								...accessors,
								[newPath]: newModule.accessor
							}
						};
					} else {
						const newPath = getPath();
						const newModule = getNewModule(newPath);
						this.$store.registerModule(moduleName, newModule.module);
						this.localAccessor = newModule.accessor.of(this.$store);
						newProviderData = {
							path: `${moduleName}/`,
							accessors: {
								[newPath]: newModule.accessor
							}
						};
					}
				} else {
					throw new Error('No vuex provided!');
				}
			}
			if (!this.bedrock) {
				return {
					__providerData: newProviderData
				};
			} else {
				return {
					__providerData: null
				};
			}
		},
		render(createElement: any) {
			return createElement(
				'div',
				{
					attrs: {
						id: `__${this.$options._componentTag}`
					}
				},
				[
					this.$scopedSlots.default
						? this.$scopedSlots.default({ provider: this.localAccessor })
						: this.$slots.default
				]
			);
		}
	} as any;
}
