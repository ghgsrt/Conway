export const deepCopy = (obj: Record<string, any>) =>
	JSON.parse(JSON.stringify(obj));

export const deepMerge = <T extends Record<string, any>>(
	target: T,
	source: Partial<T>
) => {
	for (let key in target) {
		if (source[key] === undefined) continue;

		if ((source[key] as any) instanceof Object)
			target[key] = deepMerge(target[key], source[key]!);
		else target[key] = source[key]!;
	}

	return target;
};
