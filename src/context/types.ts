import Vuex, { Store } from 'vuex';

export type ProviderData = {
	path: string;
	providerStore?: Store<any>;
	$path: string;
};
