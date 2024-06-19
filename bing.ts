// function hyperop(a: number, op: 0): number;
// function hyperop(a: number, op: number, b: number): number;
// function hyperop(a: number, op: number, b?: number): number {
// 	if (b === 0) {
// 		if (op === 1) return a;
// 		if (op === 2) return 0;
// 		if (op > 2) return 1;
// 	}
// 	if (op === 1) return hyperop(a, op, b! - 1) + 1;

// 	return hyperop(a, op - 1, hyperop(a, op, b! - 1));
// }

type Enumerate<
	N extends number,
	Acc extends number[] = []
> = Acc['length'] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc['length']]>;

type NumRange<F extends number, T extends number> = Exclude<
	Enumerate<T>,
	Enumerate<F>
>;

// function hyperop(a: number, op: 0): number;
// function hyperop(
// 	a: number,
// 	op: NumRange<1, 9007199254740991>,
// 	b: number
// ): number;
// let total = 0;
function hyperop(a: number, op: number, b: number) {
	if (op === 0) return a + b;
	let total = a;

	// for (let i = 0; i < b - 1; i++) {
	// 	if (op === 1) total += a;
	// 	else total =
	// 		(op > 1 ? 0 : total) +
	// 		hyperop(op > 1 ? a : total, op - 1, op > 2 ? total : a);
	// }
	for (let i = 0; i < b - 1; i++) {
		if (op === 1) total += a;
		else if (op === 2) total += hyperop(a, 1, a);
		else if (op === 3) return hyperop(a, 2, b);
		else total = hyperop(a, op - 1, total);
	}
	console.log('op:', op, total);

	return total;
}

console.log(hyperop(2, 4, 3));

// op>2 => a, op - 1, total => total init as a
// op=2 => a, op - 1, a
// op=1 => a, op - 1, a
// op=0 => 1, a

// op = 4 =>
// op = 3 => 3^3
// op = 2 => 3 * 3 * 3
// op = 1 => 3 + 3 + 3  +  3 + 3 + 3  +  3 + 3 + 3
// op = 0 => 1 + 1 + 1  +  1 + 1 + 1  +  1 + 1 + 1  +  1 + 1 + 1  +  1 + 1 + 1  +  1 + 1 + 1  +  1 + 1 + 1  +  1 + 1 + 1  +  1 + 1 + 1

// op = 4 => 2^^3
// op = 3 => 2^(2^2) => a^a => a^(a^a)
// op = 2 => a^a => 2*2 = 4 => 2^4 => 2*2*2*2
// op = 1 => a*a => 2+2 = 4 => 2*2*2*2 => 2+2 + 2+2 + 2+2 + 2+2
// op = 0 => a+a => 1+1 + 1+1 = 4 => 1+1 + 1+1  +  1+1 + 1+1  +  1+1 + 1+1  +  1+1 + 1+1
