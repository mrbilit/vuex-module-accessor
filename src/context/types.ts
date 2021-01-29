import Vuex, { Store } from 'vuex';
import { ModuleAccessor } from '..';

export type Accessor = {
	accessor: ModuleAccessor<any, any>;
	moduleName: string;
};
export type Accessors = {
	[key: string]: Accessor;
};
export type ProviderData = {
	path: string;
	accessors: Accessors;
	providerStore?: Store<any>;
};

export type ConsumerOptions = {
	bedrock?: boolean;
};
