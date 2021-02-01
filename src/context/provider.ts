import Vue, { VueConstructor } from 'vue';
import Vuex, { Module as VModule } from 'vuex';
import { Reflection } from '@abraham/reflection';
import ModuleAccessor from '../ModuleAccessor';
import Module from '../Module';
import { ExtractState } from '../Types';
import { InjectMeta, ProviderData, ModuleConstructor } from './types';
import { getAccessor, getModuleNames } from './helpers';
import { INJECT_KEY } from './decorators';

Vue.use(Vuex);

export default function provider<
	TModule extends Module<TState>,
	TState = ExtractState<TModule>
>(Module: ModuleConstructor<TModule> | any): VueConstructor {
	return {
		props: {
			root: {
				type: Boolean,
				default: false
			},
			name: {
				type: String,
				default: null
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
			// provider
			const providerData = this.__providerData as ProviderData;
			let newProviderData: ProviderData = {
				path: '',
				accessors: {}
			};
			// get a new module
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
			// inject modules
			const moduleNames: InjectMeta | undefined = Reflection.getMetadata(
				INJECT_KEY,
				Module
			);

			const injectedModules: (() => TModule)[] = [];
			if (moduleNames) {
				Object.keys(moduleNames).forEach((key) => {
					if (providerData) {
						const accessorInfo = getAccessor<TModule, TState>(
							providerData.path,
							moduleNames[Number(key)],
							providerData.accessors
						);
						if (providerData.providerStore !== undefined) {
							const accessor = accessorInfo.accessor.of(
								providerData.providerStore
							);
							injectedModules[Number(key)] = () => accessor;
						} else {
							injectedModules[Number(key)] = () =>
								accessorInfo.accessor.of(this.$store);
						}
					}
				});
			}
			// new module
			const module: TModule = new Module(...injectedModules);
			const moduleName = this.name || Module.name;
			// get new path
			const getPath = (): string => {
				return `${providerData?.path || ''}${moduleName}/`;
			};
			//
			if (this.root) {
				const newModule = getNewModule('');
				const store = new Vuex.Store(newModule.module);
				this.localAccessor = newModule.accessor.of(store);
				return {
					__providerData: {
						path: '',
						providerStore: store,
						accessors: {
							root: { accessor: newModule.accessor, moduleName }
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
							[newPath]: { accessor: newModule.accessor, moduleName }
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
								[newPath]: { accessor: newModule.accessor, moduleName }
							}
						};
					} else {
						const newPath = getPath();
						const newModule = getNewModule(newPath);
						this.$store.registerModule(moduleName, newModule.module);
						this.localAccessor = newModule.accessor.of(this.$store);
						newProviderData = {
							path: newPath,
							accessors: {
								[newPath]: { accessor: newModule.accessor, moduleName }
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
