import { Store } from 'vuex/types/index';
import Module from './Module';
import { StoreContext } from './StoreContext';
import ModuleAccessor, {
	getterTransform,
	mutationTransform,
	actionTransform,
	mutationSetTransform
} from './ModuleAccessor';

export default class ModuleWrapper<TModule extends Module<TState>, TState> {
	state: any;
	context: StoreContext<TState> | Store<TState> | undefined;
	constructor(public module: TModule, public namespace: string) {
		const props = ModuleAccessor.getAllDescriptors(this.module);

		for (const key in props) {
			if (key === 'constructor' || key === '__proto__') continue;

			if (props[key].set) {
				// Defining setter mutations
				Object.defineProperty(this, key, {
					configurable: true,
					set(val) {
						if (!this.context.commit) {
							throw new Error('Mutations are not available in this context');
						}
						this.context.commit(namespace + mutationSetTransform(key), val, {
							root: true
						});
					}
				});
			}

			if (props[key].get) {
				// Defining getters
				Object.defineProperty(this, key, {
					configurable: true,
					get() {
						const storeContext = this.context as StoreContext<TState>;
						return ((storeContext && storeContext.rootGetters) ||
							this.context.getters)[namespace + getterTransform(key)];
					}
				});
			}

			if (props[key].value && typeof props[key].value === 'function') {
				if (props[key].value._isUtility) {
					// Defining utilities to be callable from outside
					Object.defineProperty(this, key, {
						value: props[key].value
					});
				} else if (props[key].value._isMutation) {
					// Defining method mutations
					Object.defineProperty(this, key, {
						value: function (payload: any) {
							if (!this.context || !this.context.commit) {
								throw new Error('Mutations are not available in this context');
							}
							return this.context.commit(
								namespace + mutationTransform(key),
								payload,
								{ root: true }
							);
						}
					});
				} else {
					// Defining actions
					Object.defineProperty(this, key, {
						value: function (payload: any) {
							if (!this.context || !this.context.dispatch) {
								throw new Error('Actions are not available in this context');
							}
							return this.context.dispatch(
								namespace + actionTransform(key),
								payload,
								{ root: true }
							);
						}
					});
				}
			}
		}
	}
}
