import ModuleState from './ModuleState';
import { StoreContext } from './StoreContext';

export default abstract class Module<TState extends ModuleState> {
	state: TState;
	context: StoreContext<TState>;
	namespace: string | null = null;
	$t: (text: string, params?: string[] | { (k: string): string }) => string;
	stateConstructor: { new (...args: any[]): TState };

	get __module__(): string {
		return '';
	}

	constructor(stateConstructor: { new (...args: any[]): TState }) {
		const state = new stateConstructor();
		this.state = state;
		this.stateConstructor = stateConstructor;
		this.context = {
			state
		};
		this.$t = () => '';
	}
}
