import { Store } from 'vuex/types/index';
import ModuleState from './ModuleState';
import { StoreContext } from './StoreContext';

export default abstract class Module<TState extends ModuleState> {
	state: TState;
	context: StoreContext<TState>;
	namespace: string | null = null;
	$t: (text: string, params?: string[] | { (k: string): string }) => string;

	get __module__(): string {
		return '';
	}

	constructor(state: TState) {
		this.state = state;
		this.context = {
			state
		};
		this.$t = () => '';
	}
}
