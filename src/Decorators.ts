export function mutation(
	target: any,
	propertyName: string,
	descriptor: PropertyDescriptor
) {
	target[propertyName]._isMutation = true;
}

export function utility(
	target: any,
	propertyName: string,
	descriptor: PropertyDescriptor
) {
	target[propertyName]._isUtility = true;
}
