import { Reflection } from '@abraham/reflection';
import { InjectMeta } from './types';

export const INJECT_KEY = 'inject-modules';
export function inject(
	modulename: string
): (target: any, propertyKey: string | symbol, parameterIndex: number) => any {
	return function (
		target: any,
		_propertyKey: string | symbol,
		parameterIndex: number
	): any {
		const modules: InjectMeta =
			Reflection.getOwnMetadata(INJECT_KEY, target) || {};
		modules[parameterIndex] = modulename;
		Reflection.defineMetadata(INJECT_KEY, modules, target);
	};
}
