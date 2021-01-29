import { Accessors, Accessor } from './types';
import Module from '../Module';
import { ExtractState } from '../Types';

export function getAccessor<
	TModule extends Module<TState>,
	TState = ExtractState<TModule>
>(path: string, moduleName: string, accessors: Accessors): Accessor {
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
	} else if (accessors.root.moduleName === moduleName) {
		return accessors.root;
	} else {
		throw new Error('module not found!');
	}
}

export function getModuleNames(path: string, moduleName: string): string[] {
	const modules = path.split('/');
	modules.pop();
	modules.push(moduleName as string);
	return modules;
}
