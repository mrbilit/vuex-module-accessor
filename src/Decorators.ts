export function mutation(
	target: any,
	propertyName: string,
	descriptor: PropertyDescriptor
): void {
	target[propertyName]._isMutation = true;
}

export function utility(
	target: any,
	propertyName: string,
	descriptor: PropertyDescriptor
): void {
	target[propertyName]._isUtility = true;
}

export function defSetterGetter(target: any, propertyName: string): any {
	return {
		set: function (value: any) {
			this.state[propertyName] = value;
		},
		get: function () {
			return this.state[propertyName];
		},
		enumerable: true,
		configurable: true
	};
}
