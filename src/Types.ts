import Module from './Module';
import ModuleAccessor from './ModuleAccessor';
import { StoreContext } from './StoreContext';

export type ExtractState<T> = T extends Module<infer X> ? X : never;
export type ExtractModule<T> = T extends ModuleAccessor<infer X, infer Y>
	? X
	: never;

export type ModuleGetter<T> = (c: StoreContext<any>) => T;
