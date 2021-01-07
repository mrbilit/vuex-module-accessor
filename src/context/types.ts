import Vuex, { Store } from 'vuex';
import { ModuleAccessor } from '..';

export type Accessors = { [key: string]: ModuleAccessor<any, any> };
export type ProviderData = {
	path: string;
	accessors: Accessors;
	providerStore?: Store<any>;
};
