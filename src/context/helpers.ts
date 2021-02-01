import {
	Accessors,
	Accessor,
	ModuleConstructor,
	ModuleAbstract
} from './types';
import Module from '../Module';
import { ExtractState } from '../Types';

export function getAccessor<
	TModule extends Module<TState>,
	TState = ExtractState<TModule>
>(
	path: string,
	module: string | ModuleConstructor<TModule> | ModuleAbstract<TModule>,
	accessors: Accessors
): Accessor {
	if (typeof module === 'string') {
		const moduleName = module;
		const moduleNames: string[] = path.split('/');
		const firstModuleIndex = moduleNames.findIndex((m) => m === moduleName);
		if (firstModuleIndex > -1) {
			const modulePath = moduleNames.reduce((fullPath, value, index) => {
				if (index <= firstModuleIndex) {
					return (fullPath += `${value}/`);
				} else if (index + 1 === firstModuleIndex) {
					return (fullPath += value);
				} else {
					return fullPath;
				}
			}, '');
			return accessors[modulePath];
		} else if (accessors.root && accessors.root.moduleName === moduleName) {
			return accessors.root;
		} else {
			throw new Error('module not found!');
		}
	} else {
		let accessor: Accessor | null = null;
		for (const key in accessors) {
			const aModule = accessors[key].accessor.module;
			if (
				module.prototype.constructor === aModule.constructor ||
				module.prototype.constructor.isPrototypeOf(aModule.constructor)
			) {
				accessor = accessors[key];
			}
		}
		if (accessor) {
			return accessor;
		} else {
			throw new Error('module not found!');
		}
	}
}

export function getModuleNames(path: string, moduleName: string): string[] {
	const modules = path.split('/');
	modules.pop();
	modules.push(moduleName as string);
	return modules;
}
