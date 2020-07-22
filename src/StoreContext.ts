import { Store } from 'vuex/types/index';

export interface StoreContext<T> {
	commit?: Function;
	state: T;
	dispatch?: Function;
	getters?: any;
	rootGetters?: any;
	rootState?: any;
	store?: Store<any>;
}
