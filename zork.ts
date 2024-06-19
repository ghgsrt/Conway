// type OBJECT = {};
// type ACTION = (PRSO?: OBJECT, PRSI?: OBJECT) => void;

// const BUZZ = [
// 	'AGAIN',
// 	'G',
// 	'OOPS',
// 	'A',
// 	'AN',
// 	'THE',
// 	'IS',
// 	'AND',
// 	'OF',
// 	'THEN',
// 	'ALL',
// 	'ONE',
// 	'BUT',
// 	'EXCEPT',
// 	'.',
// 	',',
// 	'"',
// 	'YES',
// 	'NO',
// 	'Y',
// 	'HERE',
// ];

// const PREPS = [];

// const OBJECT_NAMES = ['ROPE'] as const;
// type OBJECT_NAME = (typeof OBJECT_NAMES)[number];
// const _SYNTAX: Record<string, any> = {};

// const SYNTAX = (...args: [...string[], ACTION]) => {
// 	const cb = args.pop()!;
// 	const _args = args as string[];

// 	let prevLayer: typeof _SYNTAX;
// 	let layer = _SYNTAX;
// 	for (let i = 0; i < _args.length; i++) {
// 		prevLayer = layer;
// 		layer = prevLayer[_args[i]] ??= i === _args.length - 1 ? cb : {};
// 	}
// };

// const PERFORM = (PRSA: ACTION, PRSO?: OBJECT, PRSI?: OBJECT) => {
// 	PRSA(PRSO, PRSI);
// };

// const PROMPT = (str: string) => {
// 	const words = str.toUpperCase().split(' ');

// 	let layer = _SYNTAX;
// 	let objects: Array<OBJECT_NAME> = [];
// 	for (const word of words) {
// 		if (BUZZ.includes(word)) continue;

// 		if (typeof layer[word] === 'function') {
// 			PERFORM(layer[word], ...objects);
// 			return;
// 		}

// 		if (layer[word] === undefined) {
// 			if (OBJECT_NAMES.includes(word as OBJECT_NAME)) {
// 				objects.push(word as OBJECT_NAME);
// 				layer = layer['OBJECT'];
// 				if (typeof layer === 'function') {
// 					PERFORM(layer as ACTION, ...objects);
// 					return;
// 				}

// 				continue;
// 			} else return console.log(`${word} is not recognized.`);
// 		}

// 		layer = layer[word];
// 	}

// 	console.log('no action', JSON.stringify(_SYNTAX));
// };

// SYNTAX('CLIMB', 'UP', 'OBJECT', (PRSO) => {
// 	console.log(`climbing up ${PRSO}`);
// });

// PROMPT('climb up rope');

// const deepMerge = <T extends Record<string, any>>(
// 	target: T,
// 	source: Partial<T>
// ) => {
// 	for (let key in target) {
// 		if (source[key] === undefined) continue;

// 		if ((source[key] as any) instanceof Object)
// 			target[key] = deepMerge(target[key], source[key]!);
// 		else target[key] = source[key]!;
// 	}

// 	return target;
// };

// const obj = {
// 	hello: 'world',
// 	bar: 'foo',
// };
// const obj2 = {
// 	hello: 'deez',
// 	foo: 'bar',
// };

// console.log(deepMerge(obj, obj2), obj, obj2);

// const temp0 = () => 0;
// const temp1 = () => 1;
// const temp2 = () => 2;
// const temp3 = () => 3;

// const temp = [temp0, temp1, temp2, temp3];

// const execute = (fn: () => number) => {
// 	return fn();
// };

// console.log(temp.reduce((_, curr) => execute(curr), 0));


