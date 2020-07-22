import Vue from 'vue';
import ModuleAccessor from './ModuleAccessor';
import { ExtractModule, ExtractState } from './Types';
import Module from './Module';

type StoreMap<TProps extends Selector<T>, T> = {
	[key in keyof TProps]: () => ReturnType<TProps[key]>;
};
type Selector<T> = { [key: string]: (accessor: T) => any };

export const typedMapState = function <
	TProps extends Selector<TState>,
	TModuleAccessor extends ModuleAccessor<TModule, TState>,
	TModule extends Module<TState> = ExtractModule<TModuleAccessor>,
	TState = ExtractState<TModule>
>(accessor: TModuleAccessor, props: TProps): StoreMap<TProps, TState> {
	const ret: StoreMap<TProps, TState> = {} as StoreMap<TProps, TState>;
	for (const key in props) {
		ret[key] = function (this: Vue) {
			return props[key](accessor.of(this.$store).state);
		};
	}

	return ret;
};

export const typedMapGetters = function <
	TProps extends Selector<TModule>,
	TModuleAccessor extends ModuleAccessor<TModule, TState>,
	TModule extends Module<TState> = ExtractModule<TModuleAccessor>,
	TState = ExtractState<TModule>
>(accessor: TModuleAccessor, props: TProps): StoreMap<TProps, TModule> {
	const ret: StoreMap<TProps, TModule> = {} as StoreMap<TProps, TModule>;
	for (const key in props) {
		ret[key] = function (this: Vue) {
			return props[key](accessor.of(this.$store));
		};
	}
	return ret;
};
