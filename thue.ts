// https://stackoverflow.com/a/52490977
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
	? R
	: _TupleOf<T, N, [T, ...R]>;
export type Tuple<T, N extends number> = N extends N
	? number extends N
		? T[]
		: _TupleOf<T, N, []>
	: never;

type ReplacementTable = Tuple<string, 2>[];

// OOOOOOOO d=0, i=0
//  OOOOOOO d=1, i=0
// OOOOOOO  d=1, i=1
//   OOOOOO d=2, i=0
//  OOOOOO  d=2, i=1
// OOOOOO   d=2, i=2
//    OOOOO d=3, i=0
//   OOOOO  d=3, i=1
//  OOOOO   d=3, i=2
// OOOOO    d=3, i=3
// idx, length - depth + idx
type ParseOptions = {
	dir?: 'leftToRight' | 'rightToLeft';
	delta?: 'bigToSmall' | 'smallToBig';
};
type ParseResult = ReturnType<ReturnType<typeof parse>['next']>;
const parse = (input: string, options: ParseOptions = {}) => {
	options.dir ??= 'rightToLeft';
	options.delta ??= 'bigToSmall';

	const isBigToSmall = options.delta === 'bigToSmall';

	const length = input.length;
	let depth = isBigToSmall ? 0 : length - 1;
	let idx = isBigToSmall ? -1 : length;

	return {
		next: () => {
			if (isBigToSmall) {
				if (++idx > depth) {
					idx = 0;
					depth++;
				}
				if (depth === length) return undefined;
			} else {
				if (--idx < 0) idx = --depth;
				if (depth === -1) return undefined;
			}

			const sliceArgs =
				options.dir === 'rightToLeft'
					? [depth - idx, length - idx]
					: [idx, length - depth + idx];

			return {
				value: input.slice(...sliceArgs),
				replace: (replacement: string) =>
					[input.slice(0, sliceArgs[0]), input.slice(sliceArgs[1])].join(
						replacement
					),
			};
		},
	};
};
// const it = parse('ABCDEFG', { dir: 'leftToRight', delta: 'smallToBig' });
// let result: ParseResult;
// while ((result = it.next())) console.log(result.value);

const parseRulebase = (rules: string[]): ReplacementTable => {
	const replacementTable: ReplacementTable = [];

	for (const rule of rules) {
		replacementTable.push(rule.split('::=') as Tuple<string, 2>);
	}

	return replacementTable;
};

const createRulebase = (
	init: string[],
	options:
		| ParseOptions
		| {
				dir: ParseOptions['dir'];
				delta: ParseOptions['delta'] | 'ruleOrder';
		  } = {}
) => {
	options.dir ??= 'rightToLeft';
	options.delta ??= 'bigToSmall';

	const replacementTable = parseRulebase(init);

	return (input: string) => {
		let it = parse(input, options as ParseOptions);

		let result: ParseResult;
		while ((result = it.next())) {
			let i = 0;
			while (i < replacementTable.length) {
				if (options.delta === 'ruleOrder') {
				} else if (result.value === replacementTable[i][0]) {
					const rhs = replacementTable[i][1];

					if (rhs[0] === '~') {
						process.stdout.write(rhs.slice(1));
						input = result.replace('');
					} else input = result.replace(rhs);

					i = 0;
					it = parse(input, options as ParseOptions);
					break;
				} else i++;
			}
		}

		return input;
	};
};

const excecute = createRulebase([
	
]);

// //? Serpinskii triangle
// const execute = createRulebase([
// 	'X::=~ ',
// 	'Y::=~*',
// 	'Z::=~\n',
// 	'_.::=._X',
// 	'_*::=*_Y',
// 	'._|::=.Z-|',
// 	'*_|::=Z',
// 	'..-::=.-.',
// 	'**-::=*-.',
// 	'*.-::=*-*',
// 	'.*-::=.-*',
// 	'@.-::=@_.',
// 	'@*-::=@_*',
// ]); 
// execute('@_*...............................|');
// const t1 = Date.now();
// const t2 = Date.now();

// console.log(t2 - t1);

//? print example
// const execute = createRulebase(['a::=~Hello World!']);
//? binary addition
// const execute = createRulebase([
// 	'1_::=1++',
// 	'0_::=1',

// 	'01++::=10',
// 	'11++::=1++0',

// 	'_0::=_',
// 	'_1++::=10',

// 	'__::=1',
// ]);
//? infinite loop/random output
// const execute = createRulebase(['b::=~0', 'b::=~1', 'ac::=abc']);
// //? Serpinskii triangle
// const execute = createRulebase([
// 	'X::=~ ',
// 	'Y::=~*',
// 	'Z::=~\n',
// 	'_.::=._X',
// 	'_*::=*_Y',
// 	'._|::=.Z-|',
// 	'*_|::=Z',
// 	'..-::=.-.',
// 	'**-::=*-.',
// 	'*.-::=*-*',
// 	'.*-::=.-*',
// 	'@.-::=@_.',
// 	'@*-::=@_*',
// ]);
// // const execute = createRulebase(
// // 	['a::=b', 'b::=fc', 'ab::=d', 'bc::=d', 'ac::=e'],
// // 	{
// // 		dir: 'leftToRight',
// // 		delta: 'smallToBig',
// // 	}
// // );
// const t1 = Date.now();
// // console.log(execute('a'))
// // execute('a');
// // console.log(execute('_1111111_'));
// // console.log(execute('abc'));
// console.log(execute('@_*...............................|'));
// // console.log(execute('abc'));
// const t2 = Date.now();

// console.log(t2 - t1);
