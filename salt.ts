type Option<T extends any> =
	| {
			readonly isSome: true;
			readonly value: T;
	  }
	| {
			readonly isSome: false;
			readonly value: undefined;
	  };

const Some = <T extends any>(value: T): Option<T> => ({
	isSome: true,
	value,
});
const None = <T extends any>(): Option<T> => ({
	isSome: false,
	value: undefined,
});

type Result<T extends any, E extends Error = Error> =
	| {
			ok: true;
			value: T;
	  }
	| {
			ok: false;
			error: E;
	  };

const Ok = <T extends any>(value: T): Result<T> => ({
	ok: true,
	value,
});
const Err = <E extends Error>(error: E): Result<never, E> => ({
	ok: false,
	error,
});

type State<T extends any = any> = {
	readonly value: T;
	get: () => T;
	put: (value: T) => void;
};

function State<T extends any>(value: T): State<T>;
function State<T extends any[]>(...value: T): State<T>;
function State<T extends any[]>(...value: T) {
	let state = value.length === 1 ? value[0] : value;
	return {
		get: () => state,
		put: (value: T) => {
			state = value;
		},
	};
}

type Composable<First extends any[], R> = {
	<NewR>(fn: (args: R) => NewR): Composable<First, NewR>;
	run: (...args: First) => R;
};

function compose<First extends any[], R>(
	fn: (...args: First) => R
): Composable<First, R> {
	const run = (...initial: First) => fn(...initial);

	const chain = <NewR>(nextFn: (args: R) => NewR): Composable<First, NewR> =>
		compose((...initial: First) => nextFn(run(...initial)));

	const call = <NewR>(nextFn: (args: R) => NewR) => chain(nextFn);
	call.run = run;

	return call;
}


enum MySymbol {
	ILLEGAL,
	
	EOF,
	IDENT,
	NEWLINE,
	NUMBER,
	STRING,

	// Operators
	PLUS,
	MINUS,
	ASTERISK,
	SLASH,
	PERCENT,
	EXCLAMATION,
	QUESTION,
	AMPERSAND,
	PIPE,
	CARET,
	TILDE,
	LESS,
	GREATER,
	EQUAL,
	PLUS_EQUAL,
	MINUS_EQUAL,
	ASTERISK_EQUAL,
	SLASH_EQUAL,
	PERCENT_EQUAL,
	AMPERSAND_EQUAL,
	PIPE_EQUAL,
	CARET_EQUAL,
	LESS_EQUAL,
	GREATER_EQUAL,
	EQUAL_EQUAL,
	EXCLAMATION_EQUAL,
	AMPERSAND_AMPERSAND,
	PIPE_PIPE,
	PLUS_PLUS,
	MINUS_MINUS,
	PLUS_PLUS_EQUAL,
	MINUS_MINUS_EQUAL,
	PERIOD,
	PERIOD_PERIOD,
	PERIOD_PERIOD_PERIOD,

	// Punctuation
	LPAREN,
	RPAREN,
	LBRACE,
	RBRACE,
	LBRACKET,
	RBRACKET,
	COMMA,
	COLON,
	SEMICOLON,
	AT,
	BACKTICK,
	DOLLAR,
	HASH,
	QUESTION_PERIOD,

	// Keywords
	BREAK,
	CASE,
	CONST,
	CONTINUE,
	DEFAULT,
	DELETE,
	DO,
	ELSE,
	EXPORT,
	FOR,
	FUNCTION,
	IF,
	IMPORT,
	IN,
	OF,
	RETURN,
	SWITCH,
	WHILE,
	LET,
	TYPEOF,
	ENUM,
}

const symbols = {
	'=': 
}













// const compose = <First extends State, FirstR extends State>(
// 	fn: (state: First) => FirstR
// ) => {
// 	const _compose = <P extends State, R extends State>(
// 		next: (state: P) => R,
// 		run: (state: First) => P
// 	): Composable<First, R> => {
// 		const _run = (state: First) => next(run(state));
// 		const _next = (next: (state: R) => State) => _compose(next, _run);
// 		_next.run = _run;
// 		return _next as Composable<First, R>;
// 	};

// 	const next = <FR extends State>(next: (state: FirstR) => FR) =>
// 		_compose(next, fn);
// 	next.run = fn;
// 	return next as Composable<First, FirstR>;
// };

// type test = <F extends (...args: any[]) => any, P extends Parameters<F>, R extends ReturnType<F>>(...args: P) => R;

// type _Cont<P extends any[], R extends any[]> = {
// 	runCont: (...args: P) => R;
// 	then: <TR extends Cont>(
// 		fn: (...args: R) => TR
// 	) => Cont<(...args: TR[]) => any>;
// };

// type Cont<F extends (...args: any[]) => any = (...args: any) => any> = _Cont<
// 	Parameters<F>,
// 	ReturnType<F>
// >;

// type ContFn = <F extends (...args: any[]) => any>(
// 	fn: F
// ) => Cont<F> & (<T extends any>(value: T) => Cont<(value: T) => T>);

// type ContFn = <F extends any>(
// 	arg: F
// ) => Cont<F extends (args: any) => any ? F : (value: F) => F>; // & (<T extends any>(value: T) => Cont<(value: T) => T>);

// const cont = <
// 	F extends (...args: any[]) => any,
// 	P extends Parameters<F>,
// 	R extends ReturnType<F>
// >(
// 	arg: F
// ) => {
// 	// if (typeof arg !== 'function') return
// 	// else
// 	return {
// 		runCont: (...args: P): R => arg(...args),
// 		// then: <TR >(f: (...args: R) => TR) => cont((next: (...args: any[]) => Cont) => f(...arg(next))),
// 		then: (f: <TR>(...args: R) => TR) =>
// 			cont((next: (...args: R) => any) => f(...arg()).runCont(next)),
// 	} as Cont<F>;
// };
// cont.of = <F extends Exclude<any, (...args: any[]) => any>[]>(...args: F) =>
// 	cont((next: (...args: F) => F) => next(...args));

// const test = cont((next) => next(0)); //.then((value) => value + 1);
// const test2 = cont.of(1, 3, 2).then((vas, e, th) => cont.of(vas + 1)); //.then((val) => cont((next) => next(val + 1)));
// test2.runCont((value) => console.log(value));

// // type StateFn<T extends State, R extends any> = (state: T) => R;

// type cont<F extends (...args: any[]) => any> = F;
