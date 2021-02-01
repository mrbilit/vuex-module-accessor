import { Store } from 'vuex';
import { ModuleAccessor } from '..';

export type ModuleAbstract<TModule> = Function & { prototype: TModule };
export type ModuleConstructor<TModule> = new (...args: any[]) => TModule;

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
	providerName?: string;
	bedrock?: boolean;
};

export type InjectMeta = { [key: number]: string };
