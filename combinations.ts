// // https://stackoverflow.com/a/52490977
// type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
// 	? R
// 	: _TupleOf<T, N, [T, ...R]>;
// export type Tuple<T, N extends number> = N extends N
// 	? number extends N
// 		? T[]
// 		: _TupleOf<T, N, []>
// 	: never;

// type RemoveArrayRepeats<T extends readonly any[]> = {
// 	[K in keyof T]: T[number] extends {
// 		[P in keyof T]: P extends K ? never : T[P];
// 	}[number]
// 		? never
// 		: T[K];
// };

// 1 2 3 4 5
// 2
// 1 2
// 1 3
// 1 4
// 1 5
// 2 3
// 2 4
// 2 5
// 3 4
// 3 5
// 4 5

// 1 2 3 4 5
// 3
// 1 2 3
// 1 2 4
// 1 2 5
// 1 3 4
// 1 3 5
// 1 4 5

// const signals: Record<string, SignalGroup<any>> = {};

// let uuid = 0;
// const createSignal = <T extends number | string>(
// 	initial: T,
// 	keyPrecedence?: string[]
// ): Signal<T, any> => {
// 	const id = uuid++;
// 	let value = initial;

// 	const signal: Signal<T, any> = (set) => {
// 		if (set) {
// 			const _prev = value;

// 			if (typeof set === 'function') value = set(_prev);
// 			else value = set;

// 			for (const key in keyPrecedence ?? signals[id])
// 				signals[id][keyPrecedence?.[key] ?? key]?.(value, _prev);
// 		}

// 		return value;
// 	};
// 	signal.subscribe = (signalFn, key) =>
// 		((signals[id] ??= {})[key ?? `signal_${Object.keys(signals).length}`] =
// 			signalFn);
// 	signal.unsubscribe = (key) => delete signals[id][key];

// 	return signal;
// };

type SignalFn<T> = (next: T, prev: T) => void;
type SignalGroup<T> = Record<string, SignalFn<T>>;
type Signal<T> = {
	(set?: T | ((value: T) => T)): T;
	subscribe: (signalFn: SignalFn<T>) => () => void;
};

const signals: SignalFn<number>[][] = [];

const createSignal = (initial: number): Signal<number> => {
	const id = signals.length;
	let value = initial;

	signals.push([]);

	const signal: Signal<number> = (set) => {
		if (set) {
			const _prev = value;

			if (typeof set === 'function') value = set(_prev);
			else value = set;

			for (const fn of signals[id]) fn(value, _prev);
		}

		return value;
	};
	signal.subscribe = (signalFn) => {
		const fnIdx = signals[id].push(signalFn);

		return () => delete signals[id][fnIdx - 1];
	};

	return signal;
};

const unwrap = <T>(arr: Signal<T>[]) => {
	const result: T[] = [];

	for (const signal of arr) result.push(signal());

	return result;
};

const combine = (n: number, k: number): number[][] => {
	let stopFlag = false;
	const numbers = Array.from({ length: k }, (_, i) => createSignal(i + 1));

	for (let i = 1; i < numbers.length - 1; i++) {
		const maxValue = n - k + i + 1;
		numbers[i].subscribe((next) => {
			if (next > maxValue) numbers[i - 1]((prev) => prev + 1);
			else numbers[i + 1](() => next + 1);
		});
	}

	const maxValue = n - k + 1;
	numbers[0].subscribe((next) => {
		if (next > maxValue) stopFlag = true;
		else if (k > 1) numbers[1](() => next + 1);
	});

	if (k > 1)
		numbers[k - 1].subscribe((next) => {
			if (next > n) numbers[k - 2]((prev) => prev + 1);
		});

	const result: number[][] = [unwrap(numbers)];
	while (true) {
		numbers[k - 1]((prev) => prev + 1);
		if (stopFlag) break;
		result.push(unwrap(numbers));
	}

	return result;
};

// const t1 = Date.now();
// combine(10, 3);
// console.log(Date.now() - t1);

function combinationSum(candidates: number[], target: number): number[][] {
	const result: number[][] = [];

	const memo: { arr: number[]; value: number }[] = [];

	candidates = candidates.sort();

	let candidate: number;
	for (let i = 0; i < candidates.length; i++) {
		candidate = candidates[i];

		if (target % candidate === 0)
			result.push(Array.from({ length: target / candidate }, () => candidate));

		const memoLength = memo.length;
		for (let l = 0; l < memoLength; l++) {
			if ((target - memo[l].value) % candidate === 0) {
				result.push([
					...memo[l].arr,
					...Array.from(
						{ length: (target - memo[l].value) / candidate },
						() => candidate
					),
				]);
			} else {
				let temp = { ...memo[l] };
				while (temp.value + candidates[i + 1] < target) {
					memo.push(
						(temp = {
							arr: [...temp.arr, candidate],
							value: temp.value + candidate,
						})
					);
				}
			}
		}

		let temp: (typeof memo)[number] = {
			arr: [],
			value: 0,
		};
		for (let j = 1; j < target / candidate; j++) {
			memo.push(
				(temp = {
					arr: [...Array.from({ length: j }, () => candidate)],
					value: temp.value + candidate,
				})
			);
		}
	}

	console.log(JSON.stringify(memo));
	return result;
}

function combinationSum2(candidates: number[], target: number): number[][] {
	const result: number[][] = [];

	const memo: { arr: number[]; value: number }[] = [
		{
			arr: [candidates[0]],
			value: candidates[0],
		},
	];

	candidates = candidates.sort();

	let candidate: number;
	for (let i = 1; i < candidates.length; i++) {
		candidate = candidates[i];

		if (candidate === target) {
			result.push([candidate]);
		}

		const memoLength = memo.length;
		for (let l = 0; l < memoLength; l++) {
			const newValue = memo[l].value + candidate;

			if (newValue === target) {
				result.push([...memo[l].arr, candidate]);
			} else if (newValue < target) {
				memo.push({
					arr: [...memo[l].arr, candidate],
					value: newValue,
				});
			}

			if (candidate < target)
				memo.push({
					arr: [candidate],
					value: candidate,
				});
		}
	}

	console.log(JSON.stringify(memo));
	return result;
}

// combinationSum([7, 3, 2], 18);
// console.log(combine(5, 3));
