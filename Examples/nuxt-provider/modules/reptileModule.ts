import AnimalModule, { AnimalState } from '~/modules/animalModule';

class ReptileState extends AnimalState {}

export default class ReptileModule extends AnimalModule<ReptileState> {
	constructor() {
		super(ReptileState);
	}

	print() {
		console.log('reptile!!!');
	}
}
