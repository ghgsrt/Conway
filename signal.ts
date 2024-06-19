const makeObjIterable = (obj: { [key: string | number | symbol]: any }) => {
	const keys = Object.keys(obj);
	let idx = 0;
	obj[Symbol.iterator] = function* () {
		while (idx < keys.length) yield obj[keys[idx++]];
	};
};

const hm = () => {
	const obj = {
		get 0() {
			return 2 * 5;
		},
		get 1() {
			return 5 * 10;
		},
	};

	makeObjIterable(obj);

	return obj as typeof obj & { [Symbol.iterator]: GeneratorFunction };
};

console.log(...hm());

// https://stackoverflow.com/a/52490977
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
	? R
	: _TupleOf<T, N, [T, ...R]>;
export type Tuple<T, N extends number> = N extends N
	? number extends N
		? T[]
		: _TupleOf<T, N, []>
	: never;

type EffectFn<T = any> = (prevValue?: T) => void;
type _Accessor<T = any> = {
	call: () => T;
	setName: (name: string) => void;
};
type Accessor<T = any> = () => T;
type Setter<T> = (newValue: T) => T;
type Signal<T> = [Accessor<T>, Setter<T>];

function useSignal() {
	const _masterKey: {
		[signalName: string]: {
			effects: Array<[EffectFn, boolean]>;
			shouldRetrigger: boolean;
		};
	} = {};

	const emit = (signalName: string) => {
		if (!_masterKey[signalName]) return;

		for (const [effect, _shouldRetrigger] of _masterKey[signalName].effects) {
			_masterKey[signalName].shouldRetrigger = _shouldRetrigger;
			effect(eval(`${signalName}?.()`));
			_masterKey[signalName].shouldRetrigger = true;
		}
	};

	function createSignal<T>(
		initialValue: T,
		options?: {
			emitOnSet?: boolean;
			name?: string;
		}
	): Signal<T> {
		let value = initialValue;
		let signalName: string;

		const emit = (name: string, newValue: T) => {
			for (const [effect, shouldRetrigger] of _masterKey[name].effects) {
				_masterKey[name].shouldRetrigger = shouldRetrigger;
				effect(newValue);
				_masterKey[name].shouldRetrigger = true;
			}
		};

		const get = () => value;
		get.setName = (name: string) => (signalName = name);

		const signal: Signal<T> = [
			get,
			(newValue: T) => {
				const name = options?.name ?? signalName;
				console.log(name);
				const temp = value;
				value = newValue;
				if (
					(options?.emitOnSet ?? true) &&
					((_masterKey[name] ?? false).shouldRetrigger ?? true)
				)
					emit(name, temp);

				return value;
			},
		];

		return signal;
	}

	function on<T = void>(
		signalName: string,
		effectFn: (prevValue: T) => void,
		shouldRetrigger = false
	) {
		eval(`${signalName}.setName('${signalName}')`);
		(_masterKey[signalName] ??= {
			effects: [],
			shouldRetrigger: true,
		}).effects.push([effectFn, shouldRetrigger]);
	}

	return { createSignal, on, emit };
}

const { createSignal, on, emit } = useSignal();

const [test, setTest] = createSignal(0);

on(
	'test',
	(prev) => {
		console.log(prev, test());
		if (test() < 6) setTest(7);
	},
	true
);

setTest(5);
