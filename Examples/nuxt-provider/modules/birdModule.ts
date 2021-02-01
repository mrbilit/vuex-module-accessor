import AnimalModule, { AnimalState } from '~/modules/animalModule';

export class BirdState extends AnimalState {}

export default class BirdModule extends AnimalModule<BirdState> {
	constructor() {
		super(BirdState);
	}

	print() {
		console.log('biiiird!!!');
	}
}
