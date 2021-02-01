import { ModuleAccessor } from '../../../lib';
import FooModule from '~/modules/fooModule';
export default new ModuleAccessor(new FooModule(), 'foo/');
