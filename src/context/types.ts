import Vuex, { Store } from 'vuex';

export type ProviderData = { [key: string]: Store<any> } & {
	providers: string[];
};
