import { ModuleAccessor } from '../../../lib';
import FooModule from '~/providers/fooModule';
export default new ModuleAccessor(new FooModule(), 'foo/');
