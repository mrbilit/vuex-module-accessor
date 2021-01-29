import { Reflection } from '@abraham/reflection';

function getParamInfo(target: any) {
	const params: any[] =
		Reflection.getMetadata('design:paramtypes', target) || [];
	return params.map((p) => p.name);
}

export const injectModules = function (target: any) {
	Reflection.defineMetadata('inject-modules', getParamInfo(target), target);
};
