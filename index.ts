import ModuleAccessor from './src/ModuleAccessor';
import Module from './src/Module';
import { mutation, utility } from './src/Decorators';
import { typedMapGetters, typedMapState } from './src/Mappers';

export { Module, mutation, utility, typedMapGetters, typedMapState };
export default ModuleAccessor;
