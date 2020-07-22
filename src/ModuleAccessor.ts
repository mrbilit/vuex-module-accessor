import { Store } from 'vuex/types/index';
import Module from './Module';
import ModuleState from './ModuleState';
import ModuleWrapper from './ModuleWrapper';
import { StoreContext } from './StoreContext';
import { ExtractState } from './Types';

// Constants
export const mutationSetTransform = (name: string) =>
	'set' + name[0].toUpperCase() + name.substr(1);
export const mutationTransform = (name: string) => name;
export const getterTransform = (name: string) => name;
export const actionTransform = (name: string) => name;

export default class ModuleAccessor<
	TModule extends Module<TState>,
	TState = ExtractState<TModule>
> {
	state: () => TState;
	mutations: { [key: string]: any };
	getters: { [key: string]: any };
	actions: { [key: string]: any };
	wrapper: ModuleWrapper<TModule, TState>;

	constructor(public module: TModule, public namespace: string = '') {
		const { state, mutations, getters, actions } = this.getModule();
		this.state = state;
		this.mutations = mutations;
		this.getters = getters;
		this.actions = actions;

		if (this.namespace !== '' && !this.namespace.endsWith('/')) {
			this.namespace += '/';
		}

		this.wrapper = new ModuleWrapper(module, namespace);
	}

	of<T>(context: StoreContext<T> | Store<TState>): TModule {
		const storeContext = context as StoreContext<TState>;
		let state = (storeContext && storeContext.rootState) || context.state;
		this.namespace.split('/').forEach((p) => {
			if (!p) return;
			state = state[p];
		});
		const wrapper: any = {
			context: context,
			state: state
		};
		// eslint-disable-next-line no-proto
		wrapper.__proto__ = this.wrapper;
		return wrapper as TModule;
	}

	private mutationSetNames: string[] = [];
	private mutationNames: string[] = [];
	private getterNames: string[] = [];
	private actionNames: string[] = [];
	private utilityNames: string[] = [];
	private dataNames: string[] = [];

	getModule() {
		const props = ModuleAccessor.getAllDescriptors(this.module);

		for (const key in props) {
			if (key === 'constructor' || key === '__proto__' || key === '__module__')
				continue;

			if (props[key].set) {
				this.mutationSetNames.push(key);
			}

			if (props[key].get) {
				this.getterNames.push(key);
			}

			if (props[key].value && typeof props[key].value === 'function') {
				if (props[key].value._isUtility) {
					this.utilityNames.push(key);
				} else if (props[key].value._isMutation) {
					this.mutationNames.push(key);
				} else if (key !== '$t') {
					this.actionNames.push(key);
				}
			} else if (props[key].value && key !== 'state' && key !== 'context') {
				this.dataNames.push(key);
			}
		}

		const mutations: { [key: string]: any } = {};
		const getters: { [key: string]: any } = {};
		const actions: { [key: string]: any } = {};

		this.mutationSetNames.forEach((m) => {
			// Mutation
			const accessor = this;
			mutations[mutationSetTransform(m)] = function (
				state: TState,
				payload: any
			) {
				props[m].set!.call(
					accessor.getThis({
						state,
						rootState: this.state
					}),
					payload
				);
			};
		});

		this.mutationNames.forEach((m) => {
			// Mutation
			const accessor = this;
			mutations[mutationTransform(m)] = function (state: TState, payload: any) {
				props[m].value.call(
					accessor.getThis({
						state,
						rootState: this.state
					}),
					payload
				);
			};
		});

		this.getterNames.forEach((g) => {
			// Getter
			getters[getterTransform(g)] = (
				state: TState,
				getters: any,
				rootState: any,
				rootGetters: any
			) => {
				return props[g].get!.call(
					this.getThis({
						state,
						rootGetters,
						rootState,
						getters
					})
				);
			};
		});

		const that = this;
		this.actionNames.forEach((actionName) => {
			// Action
			actions[actionTransform(actionName)] = function (
				this: Store<TState>,
				params: StoreContext<TState>,
				payload: any
			) {
				return props[actionName].value.call(
					that.getThis({ ...params, store: this }),
					payload
				);
			};
		});

		return {
			state: () => this.module.state,
			mutations,
			getters,
			actions,
			namespaced: true
		};
	}

	private getThis(params: StoreContext<TState>) {
		const _this = {
			state: params.state,
			context: params,
			$t: (text: string) => {
				if (!params.rootState || !params.rootState.i18n) {
					throw new Error('I18n in not available in this context');
				}
				return params.rootState.i18n[text] || text;
			}
		};
		this.getterNames.forEach((g) => {
			Object.defineProperty(_this, g, {
				configurable: true,
				get() {
					if (!params.getters) {
						throw new Error('Getters are not available in this context');
					}
					return params.getters[getterTransform(g)];
				}
			});
		});

		this.mutationSetNames.forEach((m) => {
			// Mutation
			Object.defineProperty(_this, m, {
				configurable: true,
				set(payload) {
					if (!params.commit) {
						throw new Error('Mutations are not available in this context');
					}
					params.commit(mutationSetTransform(m), payload);
				}
			});
		});

		this.mutationNames.forEach((m) => {
			// Mutation
			Object.defineProperty(_this, m, {
				configurable: true,
				value: (payload: any) => {
					if (!params.commit) {
						throw new Error('Mutations are not available in this context');
					}
					params.commit(mutationTransform(m), payload);
				}
			});
		});

		this.actionNames.forEach((a) => {
			// Action
			Object.defineProperty(_this, a, {
				configurable: true,
				value: (payload: any) => {
					if (!params.dispatch) {
						throw new Error('Actions are not available in this context');
					}
					return params.dispatch(actionTransform(a), payload);
				}
			});
		});

		this.utilityNames.forEach((u: string) => {
			// Utility
			Object.defineProperty(_this, u, {
				configurable: true,
				value: (this.module as any)[u]
			});
		});

		this.dataNames.forEach((u: string) => {
			// Data
			Object.defineProperty(_this, u, {
				configurable: true,
				value: (this.module as any)[u]
			});
		});

		return _this;
	}

	static getAllDescriptors(object: any): { [x: string]: PropertyDescriptor } {
		const aggregate: { [x: string]: PropertyDescriptor } = {};
		do {
			const descriptors = Object.getOwnPropertyDescriptors(object);
			for (const key in descriptors) {
				if (key === '__proto__') continue;
				if (!aggregate[key]) {
					aggregate[key] = { ...descriptors[key] };
				} else {
					if (
						!aggregate[key].set &&
						!aggregate[key].value &&
						descriptors[key].set
					) {
						aggregate[key].set = descriptors[key].set;
					}
					if (
						!aggregate[key].get &&
						!aggregate[key].value &&
						descriptors[key].get
					) {
						aggregate[key].get = descriptors[key].get;
					}
					if (
						!aggregate[key].value &&
						!aggregate[key].set &&
						!aggregate[key].get &&
						descriptors[key].value
					) {
						aggregate[key].value = descriptors[key].value;
					}
				}
			}
			object = Object.getPrototypeOf(object);
		} while (object && typeof object.hasOwnProperty('__module__'));

		return aggregate;
	}
}
